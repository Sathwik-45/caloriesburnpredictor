import React, { useState, useCallback } from "react";
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  Heart,
  User,
  Clock,
  Ruler,
  Sunset,
  Activity,
  Maximize2,
} from "lucide-react";

/* =======================
   TYPE DEFINITIONS
======================= */

type FormData = {
  age: string;
  weight: string;
  duration: string;
  steps: string;
  heart_rate: string;
  sleep: string;
  daily_calories: string;
};

type PredictionResponse = {
  calories: number;
};

type InputFieldProps = {
  name: keyof FormData;
  value: string;
  placeholder: string;
  icon: React.ElementType;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/* =======================
   REUSABLE COMPONENTS
======================= */

const FitnessLoader: React.FC = () => (
  <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
    <Activity className="w-5 h-5 animate-spin" />
    Calculating calories...
  </div>
);

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  placeholder,
  icon: Icon,
  unit,
  onChange,
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={0}
      required
      className="w-full pl-10 pr-14 py-3 rounded-xl border border-gray-300 bg-gray-50
                 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
    />

    {unit && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
        {unit}
      </span>
    )}
  </div>
);

/* =======================
   MAIN APP
======================= */

function App() {
  const [form, setForm] = useState<FormData>({
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const predictCalories = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(form).some((v) => v === "" || Number(v) <= 0)) {
      setError("⚠️ Please fill all fields with positive numbers.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://caloriesburnpredictor-m450.onrender.com/predict",
        {
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
        }
      );

      if (!response.ok) throw new Error("Server error");

      const data: PredictionResponse = await response.json();
      setResult(Math.round(data.calories));
    } catch (err) {
      setError("❌ Prediction failed. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={predictCalories}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Activity className="mx-auto w-12 h-12 text-red-500 mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Calorie Burn Predictor
          </h1>
          <p className="text-gray-500 mt-2">
            Estimate calories burned using your fitness data
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InputField
            name="age"
            value={form.age}
            placeholder="Age"
            icon={User}
            unit="yrs"
            onChange={handleChange}
          />
          <InputField
            name="weight"
            value={form.weight}
            placeholder="Weight"
            icon={Maximize2}
            unit="kg"
            onChange={handleChange}
          />
          <InputField
            name="duration"
            value={form.duration}
            placeholder="Workout Time"
            icon={Clock}
            unit="min"
            onChange={handleChange}
          />

          <InputField
            name="steps"
            value={form.steps}
            placeholder="Steps"
            icon={Ruler}
            onChange={handleChange}
          />
          <InputField
            name="heart_rate"
            value={form.heart_rate}
            placeholder="Heart Rate"
            icon={Heart}
            unit="bpm"
            onChange={handleChange}
          />
          <InputField
            name="sleep"
            value={form.sleep}
            placeholder="Sleep Hours"
            icon={Sunset}
            unit="hrs"
            onChange={handleChange}
          />

          <div className="md:col-span-3">
            <InputField
              name="daily_calories"
              value={form.daily_calories}
              placeholder="Daily Calorie Intake"
              icon={Zap}
              unit="kCal"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl
                     font-semibold transition disabled:bg-gray-300"
        >
          {loading ? <FitnessLoader /> : "Predict Calories"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle className="mx-auto w-10 h-10 text-green-500 mb-2" />
            <p className="text-gray-600 font-medium">
              Estimated Calories Burned
            </p>
            <p className="text-4xl font-extrabold text-green-700">
              {result} <span className="text-lg">kCal</span>
            </p>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-4 text-sm font-semibold text-green-700 hover:underline"
            >
              New Prediction
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
