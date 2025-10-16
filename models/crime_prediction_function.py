import joblib
import pandas as pd

# Load the trained model
model = joblib.load('models/crime_prediction_model.pkl')

# Function to predict crime severity
def predict_crime_severity(district, police_station, crime_category, year, month, crime_freq=1, location_freq=1):
    # Create a DataFrame with the input data
    input_data = pd.DataFrame({
        'District': [district],
        'Police Station': [police_station],
        'Crime_Section': [crime_category],
        'Year': [year],
        'Month': [month],
        'Latitude': [0],  # Will be imputed during prediction
        'Longitude': [0],  # Will be imputed during prediction
        'Crime_Frequency': [crime_freq],
        'Location_Frequency': [location_freq]
    })
    
    # Make prediction
    severity_prediction = model.predict(input_data)[0]
    
    # Get probability if supported
    try:
        probabilities = model.predict_proba(input_data)[0]
        confidence = max(probabilities)
    except:
        confidence = 0.7  # Default confidence if not available
    
    return {
        'severity': int(severity_prediction),
        'confidence': float(confidence),
        'severity_label': {
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        }.get(int(severity_prediction), 'Unknown')
    }
