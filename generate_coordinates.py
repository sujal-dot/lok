import pandas as pd
import numpy as np
import os

# Load the processed crime data
data_path = 'data/processed_crime_data.csv'
if not os.path.exists(data_path):
    print(f"❌ Error: {data_path} file not found")
    exit(1)

df = pd.read_csv(data_path)
print(f"📖 Reading processed crime data from {data_path}...")
print(f"📊 Total records: {len(df)}")

# Get unique Police Stations and Districts
unique_police_stations = df['Police Station'].dropna().unique()
unique_districts = df['District'].dropna().unique()

print(f"🔍 Found {len(unique_police_stations)} unique Police Stations")
print(f"🔍 Found {len(unique_districts)} unique Districts")

# Load existing city coordinates for reference
existing_coords_path = 'data/city_coordinates.csv'
existing_coords = pd.DataFrame()
if os.path.exists(existing_coords_path):
    existing_coords = pd.read_csv(existing_coords_path)
    print(f"📖 Reading existing city coordinates from {existing_coords_path}...")

# Create a dictionary to store coordinates
coordinates_dict = {}

# Base coordinates for Thane region (we'll use this as a starting point)
base_latitude = 19.1856
base_longitude = 72.9739

# First, add districts with their coordinates
for i, district in enumerate(unique_districts):
    # Check if district exists in existing coordinates
    if not existing_coords.empty and district in existing_coords['City'].values:
        lat = existing_coords.loc[existing_coords['City'] == district, 'latitude'].values[0]
        lon = existing_coords.loc[existing_coords['City'] == district, 'longitude'].values[0]
    else:
        # Generate random coordinates around Thane
        lat = base_latitude + (np.random.rand() - 0.5) * 0.5
        lon = base_longitude + (np.random.rand() - 0.5) * 0.5
    
    coordinates_dict[district] = {'latitude': lat, 'longitude': lon}

# Then, add police stations with their coordinates
for i, police_station in enumerate(unique_police_stations):
    # Get the district for this police station (first occurrence)
    district = df[df['Police Station'] == police_station]['District'].dropna().iloc[0] if pd.notna(police_station) else 'Unknown'
    
    # Start with district coordinates as base
    base_lat = coordinates_dict.get(district, {'latitude': base_latitude})['latitude']
    base_lon = coordinates_dict.get(district, {'longitude': base_longitude})['longitude']
    
    # Generate slightly offset coordinates for each police station
    lat = base_lat + (np.random.rand() - 0.5) * 0.05
    lon = base_lon + (np.random.rand() - 0.5) * 0.05
    
    coordinates_dict[police_station] = {'latitude': lat, 'longitude': lon}

# Create a DataFrame with all coordinates
coords_data = []
for location, coords in coordinates_dict.items():
    coords_data.append({
        'City': location,
        'latitude': coords['latitude'],
        'longitude': coords['longitude']
    })

new_coords_df = pd.DataFrame(coords_data)

# Save the new coordinates to a CSV file
new_coords_path = 'data/new_city_coordinates.csv'
new_coords_df.to_csv(new_coords_path, index=False)
print(f"💾 Saved new city coordinates to {new_coords_path}")
print(f"📊 Total locations in new coordinates file: {len(new_coords_df)}")

# Replace the old city_coordinates.csv with the new one
if os.path.exists(existing_coords_path):
    backup_path = 'data/city_coordinates_backup.csv'
    new_coords_df.to_csv(backup_path, index=False)
    print(f"💾 Created backup of old city coordinates at {backup_path}")
    
    # Overwrite the original file
    new_coords_df.to_csv(existing_coords_path, index=False)
    print(f"✅ Updated {existing_coords_path} with new coordinates")

# Display a sample of the new coordinates
print("\n📋 Sample of new coordinates:")
print(new_coords_df.head(10))

print("✅ Coordinates generation completed successfully!")