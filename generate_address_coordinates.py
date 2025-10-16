import pandas as pd
import numpy as np
import os
import requests
from time import sleep
from tqdm import tqdm

# Import Google Maps API key from process_crime_data.py
GOOGLE_MAPS_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'

# Function to get coordinates for a location using Google Maps Geocoding API
def get_coordinates(location):
    """Get latitude and longitude for a location using Google Maps Geocoding API"""
    try:
        # Clean and format the location string
        location_clean = location.replace(',', ' ').strip()
        # Add Thane and Maharashtra to improve geocoding accuracy
        full_location = f"{location_clean}, Thane, Maharashtra, India"
        
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={full_location}&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'OK':
            lat = data['results'][0]['geometry']['location']['lat']
            lng = data['results'][0]['geometry']['location']['lng']
            return lat, lng
        else:
            print(f"Geocoding API error: {data['status']} for location: {full_location}")
            return None, None
    except Exception as e:
        print(f"Error in get_coordinates: {str(e)} for location: {location}")
        return None, None

def main():
    # Load the processed crime data
    data_path = 'data/processed_crime_data.csv'
    if not os.path.exists(data_path):
        print(f"❌ Error: {data_path} file not found")
        exit(1)
    
    print(f"📖 Reading processed crime data from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"📊 Total records: {len(df)}")
    
    # Check if Address column exists
    if 'Address' not in df.columns:
        print("❌ Error: 'Address' column not found in the CSV file")
        # If not, assume it's the 8th column (index 7) based on previous observation
        address_column = df.columns[7]
        print(f"ℹ️  Using column '{address_column}' as address source")
    else:
        address_column = 'Address'
    
    # Create new columns for latitude and longitude
    df['Latitude'] = None
    df['Longitude'] = None
    
    # Create a dictionary to cache coordinates for addresses to avoid redundant API calls
    address_cache = {}
    
    # Process each row with tqdm progress bar
    print("🌍 Generating coordinates for addresses...")
    for index, row in tqdm(df.iterrows(), total=len(df)):
        address = row[address_column]
        
        # Skip if address is NaN
        if pd.isna(address):
            continue
        
        # Check if we've already processed this address
        if address in address_cache:
            lat, lng = address_cache[address]
            df.at[index, 'Latitude'] = lat
            df.at[index, 'Longitude'] = lng
            continue
        
        # Get coordinates for the address
        lat, lng = get_coordinates(address)
        
        # Cache the results
        address_cache[address] = (lat, lng)
        
        # Update the DataFrame
        df.at[index, 'Latitude'] = lat
        df.at[index, 'Longitude'] = lng
        
        # Add a small delay to avoid hitting API rate limits
        sleep(0.2)
    
    # For addresses that couldn't be geocoded, use backup coordinates
    # based on the city coordinates from city_coordinates.csv
    city_coords_path = 'data/city_coordinates.csv'
    city_coords = pd.DataFrame()
    
    if os.path.exists(city_coords_path):
        city_coords = pd.read_csv(city_coords_path)
        city_dict = dict(zip(city_coords['City'], zip(city_coords['latitude'], city_coords['longitude'])))
        
        print("🔧 Filling missing coordinates using city data...")
        
        # Check if District column exists
        if 'District' in df.columns:
            district_column = 'District'
        else:
            # If not, assume it's the first column based on previous observation
            district_column = df.columns[0]
            print(f"ℹ️  Using column '{district_column}' as district source")
        
        # Fill missing coordinates with district coordinates
        for index, row in df.iterrows():
            if pd.isna(row['Latitude']) and not pd.isna(row[district_column]):
                district = row[district_column]
                # Try to find exact match first
                if district in city_dict:
                    df.at[index, 'Latitude'], df.at[index, 'Longitude'] = city_dict[district]
                else:
                    # Try to find partial match
                    for city, coords in city_dict.items():
                        if city.lower() in district.lower() or district.lower() in city.lower():
                            df.at[index, 'Latitude'], df.at[index, 'Longitude'] = coords
                            break
    
    # Create output path
    output_path = 'data/processed_crime_data_with_coordinates.csv'
    
    # Save the DataFrame with coordinates
    df.to_csv(output_path, index=False)
    print(f"💾 Saved processed crime data with coordinates to {output_path}")
    
    # Calculate statistics
    total_rows = len(df)
    geocoded_rows = df['Latitude'].count()
    success_rate = (geocoded_rows / total_rows) * 100 if total_rows > 0 else 0
    
    print(f"📊 Statistics:")
    print(f"   Total records: {total_rows}")
    print(f"   Successfully geocoded: {geocoded_rows}")
    print(f"   Success rate: {success_rate:.2f}%")
    
    print("✅ Coordinates generation completed successfully!")

if __name__ == "__main__":
    main()