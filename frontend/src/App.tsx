import { useState } from "react";

type PredictionResponse = {
  calories: number;
};

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    duration: "",
    steps: "",
    heart_rate: "",
    sleep: "",
    daily_calories: "",
  });

  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictCalories = async () => {
    if (Object.values(form).some((v) => v === "")) {
      setError("⚠️ Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          weight: Number(form.weight),
          duration: Number(form.duration),
          steps: Number(form.steps),
          heart_rate: Number(form.heart_rate),
          sleep: Number(form.sleep),
          daily_calories: Number(form.daily_calories),
        }),
      });

      const data: PredictionResponse = await response.json();
      setResult(data.calories);
    } catch {
      setError("❌ Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🏋️ Fitness Progress Predictor</h1>
        <p className="subtitle">
          Predict calories burned using multiple regression
        </p>

        <div className="form-grid">
          <input name="age" placeholder="Age" onChange={handleChange} />
          <input
            name="weight"
            placeholder="Weight (kg)"
            onChange={handleChange}
          />
          <input
            name="duration"
            placeholder="Workout Duration (min)"
            onChange={handleChange}
          />
          <input
            name="steps"
            placeholder="Steps Taken"
            onChange={handleChange}
          />
          <input
            name="heart_rate"
            placeholder="Heart Rate (bpm)"
            onChange={handleChange}
          />
          <input
            name="sleep"
            placeholder="Sleep Hours"
            onChange={handleChange}
          />
          <input
            name="daily_calories"
            placeholder="Daily Calories Intake"
            onChange={handleChange}
          />
        </div>

        <button onClick={predictCalories} disabled={loading}>
          {loading ? "Predicting..." : "Predict Calories"}
        </button>

        {error && <p className="error">{error}</p>}

        {result !== null && (
          <div className="result">
            🔥 Estimated Calories Burned
            <span>{result}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
