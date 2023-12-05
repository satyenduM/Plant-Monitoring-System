from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
model = joblib.load('ML Model/random_forest_classifier.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
