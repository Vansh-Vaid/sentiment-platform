import { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("result");

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  const getColor = (s) => {
    if (s === "POSITIVE") return "text-green-600";
    if (s === "NEGATIVE") return "text-red-500";
    return "text-yellow-500";
  };

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.get(
        `${API_URL}/analyze?text=${encodeURIComponent(text)}`
      );

      setResult(res.data);
      setText("");
      setTab("result");
    } catch (err) {
      console.error("API ERROR:", err);
      alert("Backend not responding or wrong endpoint.");
    }

    setLoading(false);
  };

  const chartData = result
    ? [
        {
          name: result.sentiment,
          value: result.score * 100,
        },
        {
          name: "Remaining",
          value: 100 - result.score * 100,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">

      {/* NAV */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b px-6 py-4 flex justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="text-blue-500" />
          Sentiment AI
        </div>
        <div className="text-gray-400 text-sm">Live</div>
      </div>

      {/* HERO */}
      <div className="text-center mt-14 mb-12 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-semibold tracking-tight"
        >
          Emotion Intelligence
        </motion.h1>
        <p className="text-gray-500 mt-4">
          Analyze text with real AI understanding
        </p>
      </div>

      {/* INPUT */}
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow-lg"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={analyze}
            disabled={loading}
            className="w-full mt-4 py-3 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {loading && (
            <p className="text-center mt-4 text-gray-500 flex justify-center gap-2">
              <Brain className="animate-pulse w-4 h-4" />
              Thinking...
            </p>
          )}
        </motion.div>
      </div>

      {/* TABS */}
      <div className="max-w-3xl mx-auto mt-12 px-6">
        <div className="flex justify-center gap-6 border-b pb-2">
          {["result", "insights", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`capitalize ${
                tab === t
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto mt-8 px-6">

        {/* RESULT */}
        <AnimatePresence>
          {tab === "result" && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center"
            >
              <p className="text-sm text-gray-400">Prediction</p>

              <p className={`text-5xl font-semibold ${getColor(result.sentiment)}`}>
                {result.sentiment}
              </p>

              <p className="text-gray-500 mt-2">
                {(result.score * 100).toFixed(1)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INSIGHTS */}
        {tab === "insights" && result && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="w-full h-[320px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? "#22c55e" : "#e5e7eb"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center text-gray-400">
            No history available
          </div>
        )}
      </div>
    </div>
  );
}

export default App;