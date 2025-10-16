import pandas as pd
import random
import re
import requests
from tqdm import tqdm
from time import sleep

# Google Maps API key from user input
GOOGLE_MAPS_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'

# Crime section classification mapping
def classify_crime_section(section_text):
    """Classify crime sections into categories"""
    if pd.isna(section_text):
        return 'Other'
    section_text = str(section_text).lower()
    
    # Map Devanagari numerals to Arabic numerals
    devanagari_to_arabic = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }
    
    # Convert any Devanagari numerals to Arabic numerals
    converted_text = section_text
    for dev_num, arabic_num in devanagari_to_arabic.items():
        converted_text = converted_text.replace(dev_num, arabic_num)
    
    # Extract all numerical section numbers from the text
    import re
    section_numbers = re.findall(r'\b(\d{3}|\d{2})\b', converted_text)
    
    # Check for specific acts in the text first (most specific to least specific)
    if 'माहिती तंत्रज्ञान अधिनियम' in converted_text or 'information technology act' in converted_text:
        return 'Cyber Crime'
    elif 'महाराष्ट्र पोलीस अधिनियम' in converted_text or 'maharashtra police act' in converted_text:
        return 'Law Enforcement Obstruction'
    elif 'भारतीय न्याय संहिता' in converted_text or 'bharatiya nyaya sanhita' in converted_text or 'बी एन एस' in converted_text:
        return 'Bharatiya Nyaya Sanhita Offense'
    elif 'विदेशी व्‍यक्ति' in converted_text or 'foreigners act' in converted_text or 'पारपञ' in converted_text or 'passport' in converted_text:
        return 'Immigration Offense'
    elif 'शस्‍त्र अधिनियम' in converted_text or 'arms act' in converted_text:
        return 'Arms Offense'
    elif 'भ्रष्टाचार' in converted_text or 'corruption' in converted_text:
        return 'Corruption Offense'
    elif 'पशु संरक्षण' in converted_text or 'animal preservation' in converted_text or 'प्राण्‍यांचा छळ' in converted_text or 'animal cruelty' in converted_text:
        return 'Animal Offense'
    elif 'प्रादेशिक नियोजन' in converted_text or 'land revenue' in converted_text or 'मालमत्‍ता विरूपण' in converted_text or 'property damage' in converted_text:
        return 'Land/Property Offense'
    elif 'सिगारेट' in converted_text or 'तंबाखू' in converted_text or 'tobacco' in converted_text or 'smoke' in converted_text:
        return 'Tobacco Offense'
    elif 'बालविवाह' in converted_text or 'child marriage' in converted_text:
        return 'Child Offense'
    elif 'लॉटरी' in converted_text or 'lottery' in converted_text:
        return 'Gambling/Lottery Offense'
    elif 'स्‍त्रीया व मुली अनैतिक व्यापार' in converted_text or 'immoral traffic' in converted_text:
        return 'Human Trafficking Offense'
    elif 'अल्पवयीन न्याय' in converted_text or 'juvenile justice' in converted_text:
        return 'Juvenile Offense'
    
    # Murder and homicide
    murder_keywords = ['302', '304', '307', '308', '309', 'murder', 'homicide', 'हत्या']
    # Add suicide abetment (IPC 306) to murder category
    if any(keyword in converted_text for keyword in murder_keywords) or any(section in murder_keywords for section in section_numbers) or '306' in converted_text:
        return 'Murder'
    
    # Assault and violence
    assault_keywords = ['323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '360', '361', '362', '363', '364', '365', '366', '367', '368', '369', 'assault', 'violence', 'hurt', 'grievous', 'bodily', 'rape', 'sexual', 'molestation', 'हिंसा', 'आपत्ती', 'अपमान']
    if any(keyword in converted_text for keyword in assault_keywords) or any(section in assault_keywords for section in section_numbers):
        return 'Assault'
    
    # Public health and nuisance
    public_health_keywords = ['268', '269', 'public nuisance', 'public health', 'सार्वजनिक नुकसान', 'सार्वजनिक आरोग्य']
    if any(keyword in converted_text for keyword in public_health_keywords) or any(section in public_health_keywords for section in section_numbers):
        return 'Public Health Offense'
    
    # Law enforcement obstruction - add IPC 188
    if '188' in converted_text:
        return 'Law Enforcement Obstruction'
    
    # Privacy offense - IPC 228-A (victim identity protection)
    if '228-a' in converted_text or '228a' in converted_text:
        return 'Privacy Offense'
    
    # Labor law offense - IPC 374 (unlawful labor)
    if '374' in converted_text:
        return 'Labor Law Offense'
    
    # Theft and robbery
    theft_keywords = ['379', '380', '381', '382', '383', '384', '385', '386', '387', '388', '389', '390', '391', '392', '393', '394', '395', '396', '397', '398', '399', '400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '420', 'theft', 'robbery', 'steal', 'stolen', 'larceny', 'burglary', 'dacoity', 'shoplifting', 'pickpocketing', 'चोरी', 'डकैती', 'फर्जीवाड़ा']
    if any(keyword in converted_text for keyword in theft_keywords) or any(section in theft_keywords for section in section_numbers):
        return 'Theft/Robbery'
    
    # Cyber crimes
    cyber_keywords = ['cyber', 'online', 'computer', 'internet', 'phishing', 'hacking', 'identity', 'fraud', 'सायबर', 'कंप्युटर', 'इंटरनेट', 'माहिती तंत्रज्ञान', '66(c)', '66(ड)', '66b', '66d']
    if any(keyword in converted_text for keyword in cyber_keywords):
        return 'Cyber Crime'
    
    # Drug-related crimes
    drug_keywords = ['drug', 'narcotics', 'smuggling', 'trafficking', 'possession', 'cocaine', 'heroin', 'marijuana', 'गुंगी', 'औषधी', 'नारकोटिक्स']
    if any(keyword in converted_text for keyword in drug_keywords) or '27,8(c)' in converted_text:
        return 'Drug Offense'
    
    # Traffic offenses
    traffic_keywords = ['traffic', 'accident', 'drunk', 'driving', 'speeding', 'license', 'vehicle', 'मोटरवाहन', 'परिवहन', 'दुर्घटना']
    if any(keyword in converted_text for keyword in traffic_keywords) or any(section in ['134', '279'] for section in section_numbers):
        return 'Traffic Offense'
    
    # Property damage
    property_keywords = ['425', '426', '427', '428', '429', '430', '431', '432', '433', '434', '435', '436', '437', '438', '439', 'property', 'damage', 'destruction', 'नुकसान', 'ध्वংस']
    if any(keyword in converted_text for keyword in property_keywords) or any(section in property_keywords for section in section_numbers):
        return 'Property Damage'
    
    # Public order offenses
    public_order_keywords = ['141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', 'rioting', 'unlawful', 'assembly', 'public', 'order', 'दंगा', 'सार्वजनिक', 'व्यवस्था']
    if any(keyword in converted_text for keyword in public_order_keywords) or any(section in public_order_keywords for section in section_numbers):
        return 'Public Order'
    
    # Forgery and counterfeiting
    forgery_keywords = ['463', '464', '465', '466', '467', '468', '469', '470', '471', '472', '473', '474', '475', '476', 'forgery', 'counterfeit', 'fake', 'जालसाजी', 'नकली']
    if any(keyword in converted_text for keyword in forgery_keywords) or any(section in forgery_keywords for section in section_numbers):
        return 'Forgery'
    
    # Electricity-related offenses
    electricity_keywords = ['विद्युत', 'electricity', '135']
    if any(keyword in converted_text for keyword in electricity_keywords):
        return 'Electricity Offense'
    
    # Prohibition and alcohol-related offenses
    prohibition_keywords = ['दारूबंदी', 'prohibition', 'alcohol', '65(e)', '85(1)(a)']
    if any(keyword in converted_text for keyword in prohibition_keywords):
        return 'Prohibition Offense'
    
    # Gambling and betting offenses
    gambling_keywords = ['जुगार', 'gambling', 'betting', '12(a)']
    if any(keyword in converted_text for keyword in gambling_keywords):
        return 'Gambling Offense'
    
    # Public safety and negligent acts
    public_safety_keywords = ['283', '285', 'public safety', 'negligent', 'hazard', 'सुरक्षा', 'लापरवाही']
    if any(keyword in converted_text for keyword in public_safety_keywords) or any(section in public_safety_keywords for section in section_numbers):
        return 'Public Safety Violation'
    
    # Offenses against public tranquility
    public_tranquility_keywords = ['504', '506', '505', 'provoke', 'insult', 'threat', 'रुष्ट', 'gussa', 'shanti']
    if any(keyword in converted_text for keyword in public_tranquility_keywords) or any(section in public_tranquility_keywords for section in section_numbers):
        return 'Offenses against Public Tranquility'
    
    # Family offenses
    family_keywords = ['498a', '498-a', 'cruelty', 'wife', 'husband', 'marriage', 'पत्नी', 'पति', 'शादी', 'घर']
    if any(keyword in converted_text for keyword in family_keywords) or '498' in converted_text:
        return 'Family Offense'
    
    # Law Enforcement Obstruction
    law_enforcement_keywords = ['224', '122c', 'police', 'obstruction', 'resistance', 'पुलिस', 'प्रतिरोध']
    if any(keyword in converted_text for keyword in law_enforcement_keywords) or any(section in law_enforcement_keywords for section in section_numbers):
        return 'Law Enforcement Obstruction'
    
    # Other crimes
    else:
        return 'Other'

# Get coordinates for a location using Google Maps Geocoding API
def get_coordinates(location):
    """Get latitude and longitude for a location using Google Maps Geocoding API"""
    try:
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'OK':
            lat = data['results'][0]['geometry']['location']['lat']
            lng = data['results'][0]['geometry']['location']['lng']
            return lat, lng
        else:
            print(f"Geocoding API error: {data['status']} for location: {location}")
            return None, None
    except Exception as e:
        print(f"Error in get_coordinates: {str(e)}")
        return None, None

# Get nearby places using Google Maps Places API
def get_nearby_places(lat, lng, radius=1000, types=['street_address', 'establishment', 'point_of_interest']):
    """Get nearby places using Google Maps Places API"""
    try:
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&types={','.join(types)}&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'OK':
            return [place['vicinity'] for place in data['results'][:15]]  # Get top 15 places
        else:
            print(f"Places API error: {data['status']} for location: {lat},{lng}")
            return []
    except Exception as e:
        print(f"Error in get_nearby_places: {str(e)}")
        return []

# Enhanced address generation using Google Maps API
def generate_address(police_station):
    """Generate random but realistic addresses for police station areas using Google Maps API"""
    # Pre-defined coordinates for known police stations (fallback if API fails)
    station_coordinates = {
        'AMBERNATH': (19.2130, 73.0270),
        'BADLAPUR': (19.1642, 73.1170),
        'BHIWANDI CITY': (19.3055, 73.0302),
        'KALWA': (19.1987, 72.9692),
        'THANE TOWN': (19.2050, 72.9781),
        'TILAK NAGAR (DOMBIVALI)': (19.1933, 73.0958),
        'NAVI MUMBAI': (19.0330, 73.0297),
        'MIRA ROAD': (19.2939, 72.8631),
        'BHAYANDER': (19.3176, 72.8332),
        'ULHASNAGAR': (19.2418, 73.1342)
    }
    
    # Enhanced address templates with more variations
    base_address_variations = [
        '{landmark}, {area}',
        '{street} Street, {area}',
        '{street} Road, {area}',
        'Plot No. {plot}, {colony}, {area}',
        '{building} Building, {street}, {area}',
        'Sector {sector}, {area}',
        'Block {block}, {area}',
        '{road_type} {road_name}, {area}',
        '{colony_name}, {area}',
        '{village_name}, {area}',
        '{market_name} Market, {area}',
        '{mall_name} Mall Area, {area}',
        '{station_type} Station Road, {area}',
        '{temple_name} Temple Road, {area}',
        '{school_name} School Road, {area}',
        '{hospital_name} Hospital Road, {area}',
        'Near {landmark}, {area}',
        'Opposite {landmark}, {area}',
        'Next to {landmark}, {area}',
        '{area} Industrial Area'
    ]
    
    # Components for address generation
    landmarks = ['Shivaji Chowk', 'Gandhi Chowk', 'Railway Station', 'Bus Stand', 'Market', 'Police Station', 'Post Office', 'Hospital', 'School', 'Temple', 'Mosque', 'Church', 'Mall', 'Theatre']
    streets = ['MG', 'Nehru', 'Gandhi', 'Shivaji', 'Lokmanya Tilak', 'Netaji Subhash', 'Anna Hazare', 'Bal Gangadhar Tilak', 'Vivekananda', 'Rajnath Singh', 'Kamaladevi Chattopadhyay']
    road_types = ['Main', 'Inner', 'Service', 'Ring', 'Link', 'Express', 'State Highway', 'National Highway']
    colonies = ['Shanti Nagar', 'Vasant Vihar', 'Pratap Nagar', 'Gandhi Nagar', 'Shivaji Nagar', 'Nehru Nagar', 'Laxmi Nagar', 'Bharat Nagar', 'Saraswati Nagar', 'Ram Nagar']
    buildings = ['Sai', 'Shubham', 'Siddhivinayak', 'Saraswati', 'Laxmi', 'Ganesh', 'Venkateshwara', 'Shiv', 'Durga', 'Krishna']
    sectors = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
    villages = ['Wagle Estate', 'Hiranandani Estate', 'Teen Hath Naka', 'Kopri', 'Kalwa', 'Majiwada', 'Manpada', 'Kolshet', 'Parsik Nagar', 'Vartak Nagar']
    market_names = ['Crawford', 'Chor', 'Fashion Street', 'Linking Road', 'Colaba Causeway', 'Hill Road', 'Lamington Road', 'Mohammad Ali Road', 'Zaveri Bazaar', 'Chandni Chowk']
    mall_names = ['Phoenix Marketcity', 'Infiniti Mall', 'R City Mall', 'Oberoi Mall', 'Elante Mall', 'Select Citywalk', 'DLF Mall', 'Ambience Mall', 'Phoenix Palassio', 'Mantri Square']
    station_types = ['Railway', 'Metro', 'Bus', 'Monorail', 'Tram']
    temple_names = ['Siddhivinayak', 'Dagdusheth Halwai', 'Shirdi Saibaba', 'Vaishno Devi', 'Kashi Vishwanath', 'Ramnathswamy', 'Meenakshi', 'Jagannath', 'Srikrishna', 'Balaji']
    school_names = ['Delhi Public School', 'St. Mary\'s', 'Bishop Cotton', 'La Martiniere', 'The Doon School', 'Mayo College', 'Scindia School', 'Lawrence School', 'St. Xavier\'s', 'Sainik School']
    hospital_names = ['Apollo', 'Fortis', 'Max Healthcare', 'Manipal', 'Narayana Health', 'Medanta', 'Sir Ganga Ram Hospital', 'Christian Medical College', 'All India Institute of Medical Sciences', 'Jawaharlal Institute of Postgraduate Medical Education and Research']
    
    # Extract area name from police station
    area = police_station.split('(')[0].strip()
    
    try:
        # First, try to get coordinates using Geocoding API
        lat, lng = get_coordinates(f"{area}, Maharashtra, India")
        
        # If API fails, use pre-defined coordinates
        if lat is None or lng is None:
            if area in station_coordinates:
                lat, lng = station_coordinates[area]
            else:
                # Default to Mumbai coordinates if everything fails
                lat, lng = 19.0760, 72.8777
        
        # Get nearby places using Places API
        nearby_places = get_nearby_places(lat, lng)
        
        # If we got nearby places from API, use one of them
        if nearby_places:
            # Add some randomness to avoid repetition
            if random.random() > 0.3:  # 70% chance to use API result
                return random.choice(nearby_places)
        
        # Generate a random address using templates if API fails or we choose not to use API result
        plot_number = str(random.randint(1, 200))
        
        # Select random components
        random_landmark = random.choice(landmarks)
        random_street = random.choice(streets)
        random_road_type = random.choice(road_types)
        random_colony = random.choice(colonies)
        random_building = random.choice(buildings)
        random_sector = random.choice(sectors)
        random_block = random.choice(blocks)
        random_village = random.choice(villages)
        random_market = random.choice(market_names)
        random_mall = random.choice(mall_names)
        random_station_type = random.choice(station_types)
        random_temple = random.choice(temple_names)
        random_school = random.choice(school_names)
        random_hospital = random.choice(hospital_names)
        
        # Select a random template and fill in the components
        template = random.choice(base_address_variations)
        
        # Format the address with the appropriate components
        if '{landmark}' in template:
            address = template.format(landmark=random_landmark, area=area)
        elif '{street}' in template:
            address = template.format(street=random_street, area=area)
        elif '{road_type}' in template:
            address = template.format(road_type=random_road_type, road_name=random_street, area=area)
        elif '{colony}' in template:
            address = template.format(plot=plot_number, colony=random_colony, area=area)
        elif '{building}' in template:
            address = template.format(building=random_building, street=random_street, area=area)
        elif '{sector}' in template:
            address = template.format(sector=random_sector, area=area)
        elif '{block}' in template:
            address = template.format(block=random_block, area=area)
        elif '{colony_name}' in template:
            address = template.format(colony_name=random_colony, area=area)
        elif '{village_name}' in template:
            address = template.format(village_name=random_village, area=area)
        elif '{market_name}' in template:
            address = template.format(market_name=random_market, area=area)
        elif '{mall_name}' in template:
            address = template.format(mall_name=random_mall, area=area)
        elif '{station_type}' in template:
            address = template.format(station_type=random_station_type, area=area)
        elif '{temple_name}' in template:
            address = template.format(temple_name=random_temple, area=area)
        elif '{school_name}' in template:
            address = template.format(school_name=random_school, area=area)
        elif '{hospital_name}' in template:
            address = template.format(hospital_name=random_hospital, area=area)
        else:
            address = template.format(area=area)
        
        return address
    except Exception as e:
        print(f"Error in generate_address: {str(e)}")
        # Fallback to simple address if everything fails
        return f"Main Road, {area}"

# Cache for generated addresses to avoid API rate limits and improve performance
address_cache = {}

def get_or_generate_address(police_station):
    """Get cached address or generate a new one with API rate limiting"""
    global address_cache
    
    # Use a key that's consistent regardless of case or extra spaces
    cache_key = police_station.lower().strip()
    
    if cache_key not in address_cache:
        # Add some delay to avoid hitting API rate limits
        sleep(0.5)  # 500ms delay between API calls
        
        # Generate 3 variations for each police station and store them
        address_cache[cache_key] = [generate_address(police_station) for _ in range(3)]
        
    # Return a random variation from the cache
    return random.choice(address_cache[cache_key])

def main():
    """Main function to process crime data"""
    try:
        # Load the CSV file
        print("📖 Reading crime data from data/newdata.csv...")
        df = pd.read_csv('data/newdata.csv', on_bad_lines='skip')
        print(f"✅ Loaded {len(df)} records")
        
        # Get the list of police stations
        police_stations = df['Police Station'].unique()
        print(f"Found {len(police_stations)} unique police stations")
        
        # Remove state column
        if 'State' in df.columns:
            print("🗑️ Removing 'State' column...")
            df = df.drop('State', axis=1)
        if 'Sr. No.' in df.columns:
            print("remove 'Sr. No.' column...")
            df = df.drop('Sr. No.', axis=1)
        # Generate unique addresses for each crime record using the enhanced Google Maps API integration
        print("🏠 Generating unique realistic addresses for each crime record...")
        df['Address'] = [get_or_generate_address(station) for station in tqdm(df['Police Station'], desc="Generating addresses")]
        
        # Classify crime sections into standardized categories
        print("🔍 Classifying crime sections into categories...")
        df['Crime_Section'] = df['Sections'].apply(classify_crime_section)
        
        # Display the distribution of crime categories
        print("\n📈 Crime Category Distribution:")
        print(df['Crime_Section'].value_counts())
        
        # Remove duplicate addresses for the same police station to ensure variety
        print("\n🔄 Ensuring address variety across records...")
        for station in police_stations:
            # Get all rows for this police station
            station_rows = df[df['Police Station'] == station].index
            if len(station_rows) > 0:
                # Generate new addresses for a portion of the records to ensure variety
                num_to_update = max(1, int(len(station_rows) * 0.7))  # Update 70% of addresses
                rows_to_update = random.sample(list(station_rows), num_to_update)
                for idx in rows_to_update:
                    df.loc[idx, 'Address'] = get_or_generate_address(station)
        
        # Save the processed data
        print("💾 Saving processed data...")
        output_file = 'data/processed_crime_data.csv'
        df.to_csv(output_file, index=False)
        
        print("✅ Processing complete!")
        print(f"📊 Final data shape: {df.shape}")
        print(f"📁 Saved as: {output_file}")
        
        # Show sample of the data
        print("\n📋 Sample of processed data:")
        print(df[[ 'District', 'Police Station', 'Address', 'Crime_Section']].head(10).to_string(index=False))
        
       
    except FileNotFoundError:
        print("❌ Error: 'data/newdata.csv' file not found")
        print("Please ensure the file exists in the data directory and try again.")
    except KeyError as e:
        print(f"❌ Error: Required column not found in the data: {str(e)}")
        print("Please check the CSV file structure and try again.")
    except Exception as e:
        print(f"❌ Error during processing: {str(e)}")
        # If there's an API error, we'll still try to create a CSV with placeholder addresses
        if 'df' in locals():
            print("\n🔄 Attempting to create CSV with fallback addresses...")
            # Use simple fallback addresses
            df['Address'] = df['Police Station'].apply(lambda x: f"Main Road, {x.split('(')[0].strip()}")
            df.to_csv('data/processed_crime_data.csv', index=False)
            print("✅ CSV created with fallback addresses.")

if __name__ == "__main__":
    main()
