import pandas as pd

# Read the processed crime data
df = pd.read_csv('data/processed_crime_data.csv')

print('\n\nCrime Category Distribution:\n')
print(df['Crime_Section'].value_counts())

print('\n\nSample of newly classified categories:')

# Check samples from each new category
new_categories = [
    'Electricity Offense', 
    'Prohibition Offense', 
    'Gambling Offense', 
    'Public Safety Violation',
    'Law Enforcement Obstruction',
    'Cyber Crime',
    'Bharatiya Nyaya Sanhita Offense',
    'Offenses against Public Tranquility',
    'Immigration Offense',
    'Arms Offense',
    'Corruption Offense',
    'Animal Offense',
    'Land/Property Offense',
    'Tobacco Offense',
    'Child Offense',
    'Gambling/Lottery Offense', 
    'Human Trafficking Offense', 
    'Juvenile Offense', 
    'Public Health Offense', 
    'Privacy Offense', 
    'Labor Law Offense'
]

for category in new_categories:
    if category in df['Crime_Section'].unique():
        sample = df[df['Crime_Section'] == category][['Crime_Section', 'Sections']].head(3)
        print(f'\n{category}:')
        print(sample)

# Check reduction in 'Other' category
print('\n\nTotal records classified as "Other":', len(df[df['Crime_Section'] == 'Other']))
print('Total records:', len(df))
print('Percentage classified with specific categories:', 
      round((1 - len(df[df['Crime_Section'] == 'Other']) / len(df)) * 100, 2), '%')

# Show improvement from previous classification
prev_other = 930
current_other = len(df[df['Crime_Section'] == 'Other'])
reduction = prev_other - current_other
print(f'\n\nImprovement from previous classification:')
print(f'- Previous "Other" crimes: {prev_other}')
print(f'- Current "Other" crimes: {current_other}')
print(f'- Reduction: {reduction} crimes ({round(reduction/prev_other*100, 2)}% fewer "Other" crimes)')