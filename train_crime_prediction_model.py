import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
import warnings
warnings.filterwarnings('ignore')

# Load the processed crime data
data_path = 'data/processed_crime_data.csv'
if not os.path.exists(data_path):
    print(f"❌ Error: {data_path} file not found")
    exit(1)

df = pd.read_csv(data_path)
print(f"📖 Reading processed crime data from {data_path}...")
print(f"📊 Total records: {len(df)}")

# Load city coordinates to get location data
coords_path = 'data/city_coordinates.csv'
if not os.path.exists(coords_path):
    print(f"❌ Error: {coords_path} file not found")
    exit(1)

coords_df = pd.read_csv(coords_path)
print(f"📖 Reading city coordinates from {coords_path}...")

# Data preprocessing function
def preprocess_data(df, coords_df):
    # Select relevant features for prediction
    # The last column in the CSV appears to be the crime category
    # Let's check all column names first
    print(f"\n📋 Available columns: {list(df.columns)}")
    
    # The crime category seems to be the last column
    category_column = df.columns[-1]
    print(f"🔍 Identified crime category column: '{category_column}'")
    
    features = ['District', 'Police Station', category_column, 'Year', 'Month']
    target = 'Severity'
    
    # Create severity column based on crime category (this is a simplified mapping)
    severity_map = {
        'Murder': 4, 'Assault': 3, 'Cyber Crime': 3, 'Law Enforcement Obstruction': 2,
        'Prohibition Offense': 2, 'Gambling Offense': 2, 'Electricity Offense': 1,
        'Immigration Offense': 2, 'Property Damage': 2, 'Animal Offense': 1,
        'Offenses against Public Tranquility': 3, 'Arms Offense': 3, 'Public Order': 3,
        'Traffic Offense': 1, 'Corruption Offense': 3, 'Gambling/Lottery Offense': 2,
        'Tobacco Offense': 1, 'Child Offense': 4, 'Privacy Offense': 2,
        'Public Health Offense': 2, 'Family Offense': 2, 'Human Trafficking Offense': 4,
        'Juvenile Offense': 3, 'Other': 2, 'Theft/Robbery': 3, 'Drug Offense': 3
    }
    
    # Add severity column
    df['Severity'] = df[category_column].map(severity_map)
    
    # Make sure we use the correct column name in the features list
    # Store the actual category column name for later use
    category_col_name = category_column
    
    # Add latitude and longitude based on Police Station or District
    def get_location_coords(location):
        if pd.isna(location):
            return (np.nan, np.nan)
        # Try to find exact match first
        match = coords_df[coords_df['City'].str.contains(str(location), case=False, na=False)]
        if not match.empty:
            return (match.iloc[0]['latitude'], match.iloc[0]['longitude'])
        # Fallback to district match if police station not found
        district_match = coords_df[coords_df['City'].str.contains('District', case=False, na=False)]
        if not district_match.empty:
            return (district_match.iloc[0]['latitude'], district_match.iloc[0]['longitude'])
        return (np.nan, np.nan)
    
    # Add coordinates
    df[['Latitude', 'Longitude']] = df.apply(
        lambda row: get_location_coords(row['Police Station']) if pd.notna(row['Police Station']) else get_location_coords(row['District']),
        axis=1, result_type='expand'
    )
    
    # Find the correct date column
    date_columns = [col for col in df.columns if 'date' in col.lower()]
    
    # Clean up Year column first
    print("🧹 Cleaning Year column...")
    # Handle potential non-numeric values in Year column
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    
    if not date_columns:
        # If no date column found, use existing Year column
        print("⚠️ No date column found, using existing Year column")
        df['Year'] = df['Year'].fillna(0).astype(int)
        df['Month'] = 1  # Default to January if no month info
    else:
        date_col = date_columns[0]
        print(f"🔍 Found date column: '{date_col}'")
        # Extract year from date column
        date_year = pd.to_datetime(df[date_col], errors='coerce').dt.year
        # Use existing Year column if date_year is NaN
        df['Year'] = date_year.fillna(df['Year']).fillna(0).astype(int)
        df['Month'] = pd.to_datetime(df[date_col], errors='coerce').dt.month.fillna(1).astype(int)
    
    # Drop rows with NaN in target or critical features
    df = df.dropna(subset=[target, 'Year'])
    
    # Add frequency features
    crime_freq = df.groupby(category_col_name).size().to_dict()
    location_freq = df.groupby('Police Station').size().to_dict()
    df['Crime_Frequency'] = df[category_col_name].map(crime_freq)
    df['Location_Frequency'] = df['Police Station'].map(location_freq).fillna(0)
    
    # Update features list with new features
    features.extend(['Latitude', 'Longitude', 'Crime_Frequency', 'Location_Frequency'])
    
    # Select features and target
    X = df[features]
    y = df[target]
    
    # Return the processed data, features, and the actual category column name
    return X, y, features, df, category_col_name

# Preprocess the data
print("🔄 Preprocessing data for model training...")
X, y, features, processed_df, category_col_name = preprocess_data(df, coords_df)
print(f"✅ Data preprocessing completed. Features: {features}")

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"🔢 Training set size: {len(X_train)}, Test set size: {len(X_test)}")

# Create preprocessing pipeline
print("🛠️ Creating preprocessing pipeline...")

# Identify categorical and numerical columns
categorical_cols = ['District', 'Police Station', category_col_name]
numerical_cols = [col for col in features if col not in categorical_cols]

# Create transformers
from sklearn.preprocessing import OneHotEncoder

# Use OneHotEncoder instead of LabelEncoder for better compatibility with Pipeline
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])

# Combine transformers
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', categorical_transformer, categorical_cols)
    ]
)

# Define models to try
print("🤖 Defining machine learning models...")

models = {
    'Random Forest': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ]),
    'Gradient Boosting': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', GradientBoostingClassifier(random_state=42))
    ]),
    'Logistic Regression': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(random_state=42, max_iter=1000))
    ]),
    'SVM': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', SVC(random_state=42, probability=True))
    ])
}

# Hyperparameter grids for tuning
hyperparameters = {
    'Random Forest': {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10]
    },
    'Gradient Boosting': {
        'n_estimators': [100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    },
    'Logistic Regression': {
        'C': [0.1, 1.0, 10.0],
        'solver': ['liblinear', 'lbfgs']
    },
    'SVM': {
        'C': [0.1, 1.0, 10.0],
        'kernel': ['linear', 'rbf']
    }
}

# Train and evaluate models
print("🚀 Training and evaluating models...")
best_model = None
best_score = 0
model_results = {}

for name, model in models.items():
    print(f"\n🧪 Training {name}...")
    
    # Grid search for hyperparameter tuning
    grid_search = GridSearchCV(
        estimator=model,
        param_grid={f'classifier__{k}': v for k, v in hyperparameters[name].items()},
        cv=5,
        scoring='accuracy',
        n_jobs=-1
    )
    
    grid_search.fit(X_train, y_train)
    best_estimator = grid_search.best_estimator_
    
    # Predict on test set
    y_pred = best_estimator.predict(X_test)
    
    # Evaluate model performance
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    # Store results
    model_results[name] = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'best_params': grid_search.best_params_
    }
    
    print(f"📊 {name} Results:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"   Precision: {precision:.4f}")
    print(f"   Recall: {recall:.4f}")
    print(f"   F1 Score: {f1:.4f}")
    print(f"   Best Parameters: {grid_search.best_params_}")
    
    # Update best model
    if accuracy > best_score:
        best_score = accuracy
        best_model = best_estimator
        best_model_name = name

# Create an ensemble model with the best performing models
print("\n🔗 Creating ensemble model...")
ensemble_models = []
for name, result in model_results.items():
    if result['accuracy'] > 0.7:  # Only include models with good performance
        # Recreate the model with best parameters
        model = models[name]
        grid_search = GridSearchCV(
            estimator=model,
            param_grid={f'classifier__{k}': v for k, v in hyperparameters[name].items()},
            cv=5,
            scoring='accuracy',
            n_jobs=-1
        )
        grid_search.fit(X_train, y_train)
        ensemble_models.append((name, grid_search.best_estimator_))

# Create voting classifier
if len(ensemble_models) >= 2:
    voting_clf = VotingClassifier(
        estimators=ensemble_models,
        voting='soft'
    )
    
    voting_clf.fit(X_train, y_train)
    y_pred_ensemble = voting_clf.predict(X_test)
    
    ensemble_accuracy = accuracy_score(y_test, y_pred_ensemble)
    ensemble_precision = precision_score(y_test, y_pred_ensemble, average='weighted')
    ensemble_recall = recall_score(y_test, y_pred_ensemble, average='weighted')
    ensemble_f1 = f1_score(y_test, y_pred_ensemble, average='weighted')
    
    print(f"📊 Ensemble Model Results:")
    print(f"   Accuracy: {ensemble_accuracy:.4f}")
    print(f"   Precision: {ensemble_precision:.4f}")
    print(f"   Recall: {ensemble_recall:.4f}")
    print(f"   F1 Score: {ensemble_f1:.4f}")
    
    # Update best model if ensemble is better
    if ensemble_accuracy > best_score:
        best_score = ensemble_accuracy
        best_model = voting_clf
        best_model_name = "Ensemble Model"

# Final model evaluation
print(f"\n🏆 Best Model: {best_model_name} with accuracy: {best_score:.4f}")

# Save the best model
model_dir = 'models'
if not os.path.exists(model_dir):
    os.makedirs(model_dir)

model_path = os.path.join(model_dir, 'crime_prediction_model.pkl')
joblib.dump(best_model, model_path)
print(f"💾 Saved best model to {model_path}")

# Save feature importance if applicable
if hasattr(best_model.named_steps.get('classifier', best_model), 'feature_importances_'):
    importances = best_model.named_steps['classifier'].feature_importances_
    
    # Get the actual feature names from the preprocessor
    if hasattr(best_model.named_steps['preprocessor'], 'get_feature_names_out'):
        try:
            # Get actual feature names after preprocessing
            actual_feature_names = best_model.named_steps['preprocessor'].get_feature_names_out()
            indices = np.argsort(importances)[::-1]
            
            print("\n📈 Feature Importances:")
            for f in range(min(10, len(actual_feature_names))):
                if f < len(importances):
                    print(f"   {actual_feature_names[indices[f]]}: {importances[indices[f]]:.4f}")
        except Exception as e:
            print(f"⚠️ Could not get detailed feature importances: {str(e)}")
            print(f"   Total features used: {len(importances)}")
    else:
        print(f"\n📈 Total features used by model: {len(importances)}")
        print(f"   Top 3 feature importance values: {sorted(importances, reverse=True)[:3]}")

# Create a simple prediction function for the model
# First, determine the actual category column name to use in the prediction code
print(f"📝 Creating prediction function with category column: '{category_col_name}'")

# Simple approach using a template
prediction_template = '''import joblib
import pandas as pd

# Load the trained model
model = joblib.load('MODEL_PATH')

# Function to predict crime severity
def predict_crime_severity(district, police_station, crime_category, year, month, crime_freq=1, location_freq=1):
    # Create a DataFrame with the input data
    input_data = pd.DataFrame({
        'District': [district],
        'Police Station': [police_station],
        'CATEGORY_COLUMN': [crime_category],
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
'''

# Replace placeholders with actual values
prediction_code = prediction_template.replace('MODEL_PATH', model_path).replace('CATEGORY_COLUMN', category_col_name)

# Save prediction function to a separate file
prediction_script_path = os.path.join(model_dir, 'crime_prediction_function.py')
with open(prediction_script_path, 'w') as f:
    f.write(prediction_code)

print(f"💾 Saved prediction function to {prediction_script_path}")
print("\n✅ Model training completed successfully!")
print("🎯 You can now use the trained model in your application for improved crime predictions and AI suggestions.")

# Cross-validation for best model
print("\n🔍 Performing cross-validation for best model...")
cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='accuracy')
print(f"📊 Cross-validation scores: {cv_scores}")
print(f"📊 Mean CV accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")