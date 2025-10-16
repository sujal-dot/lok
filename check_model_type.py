import joblib
import os

# Path to the saved model
model_path = 'models/crime_prediction_model.pkl'

if not os.path.exists(model_path):
    print(f"❌ Error: {model_path} file not found")
    exit(1)

# Load the model
print(f"📥 Loading model from {model_path}...")
model = joblib.load(model_path)

# Determine the type of the model
print(f"🔍 Model type: {type(model).__name__}")

# If it's a pipeline, check the classifier
if hasattr(model, 'named_steps'):
    if 'classifier' in model.named_steps:
        classifier = model.named_steps['classifier']
        print(f"🤖 Classifier: {type(classifier).__name__}")
        
        # Check if it's an ensemble model
        if hasattr(classifier, 'estimators_'):
            print(f"📊 Number of estimators: {len(classifier.estimators_)}")
            
            # For VotingClassifier, show the base estimators
            if hasattr(classifier, 'estimators'):
                print("🧩 Base estimators in ensemble:")
                for name, est in classifier.estimators:
                    if hasattr(est, 'named_steps') and 'classifier' in est.named_steps:
                        base_clf = est.named_steps['classifier']
                        print(f"   - {name}: {type(base_clf).__name__}")
                    else:
                        print(f"   - {name}: {type(est).__name__}")

print("✅ Model analysis completed.")