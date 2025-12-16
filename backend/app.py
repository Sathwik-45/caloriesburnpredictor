from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)   # ✅ Fixes CORS issue for React (VERY IMPORTANT)

# -------------------------------------------------
# LOAD & TRAIN MODEL (simple version)
# -------------------------------------------------

# Load dataset
data = pd.read_csv("workout.csv")

# Select features (X) and target (y)
X = data[
    [
        "Age",
        "Weight (kg)",
        "Duration",
        "Steps Taken",
        "Heart Rate (bpm)",
        "Sleep Hours",
        "Daily Calories Intake"
    ]
]

y = data["Calories Burned"]

# Train model
model = LinearRegression()
model.fit(X, y)

# -------------------------------------------------
# API ROUTE
# -------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Extract values from frontend
        age = data["age"]
        weight = data["weight"]
        duration = data["duration"]
        steps = data["steps"]
        heart_rate = data["heart_rate"]
        sleep = data["sleep"]
        daily_calories = data["daily_calories"]

        # Prepare input for model
        input_data = np.array([[
            age,
            weight,
            duration,
            steps,
            heart_rate,
            sleep,
            daily_calories
        ]])

        # Prediction
        prediction = model.predict(input_data)

        return jsonify({
            "calories": int(prediction[0])
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# -------------------------------------------------
# RUN SERVER
# -------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
