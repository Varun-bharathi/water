import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv(r"C:\Users\C.R.VARUN BHARATHI\Downloads\water_potability.csv")
for col in df.columns:
    df[col].fillna(df[col].median(), inplace=True)

X = df.drop('Potability', axis=1)
y = df['Potability']

# Data leakage: SMOTE before split
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)
rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train)
preds = rf.predict(X_test)
print(f"Leakage Accuracy: {accuracy_score(y_test, preds)}")
