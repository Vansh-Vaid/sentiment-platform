import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Copy, Download } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("result");
  const [stats, setStats] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  const getColor = (s) => {
    if (s === "POSITIVE") return "text-green-600";
    if (s === "NEGATIVE") return "text-red-500";
    return "text-yellow-500";
  };

  const getStrength = (score) => {
    if (score > 0.7) return "Strong";
    if (score > 0.4) return "Moderate";
    return "Weak";
  };

  const fetchStats = async () => {
    const res = await axios.get(`${API_URL}/stats`);
    setStats(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${API_URL}/history`);
    setHistoryData(res.data);
  };

  const analyze = async (inputText = null) => {
    const value = inputText || text;
    if (!value.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.get(
        `${API_URL}/analyze?text=${encodeURIComponent(value)}`
      );

      setResult(res.data);
      await fetchStats();
      await fetchHistory();

      toast.success("Analysis complete");
      setText("");
      setTab("result");
    } catch {
      toast.error("Error analyzing text");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const chartData = stats
    ? [
        { name: "Positive", value: stats.POSITIVE },
        { name: "Negative", value: stats.NEGATIVE },
        { name: "Neutral", value: stats.NEUTRAL },
      ]
    : [];

  const total =
    stats?.POSITIVE + stats?.NEGATIVE + stats?.NEUTRAL || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">

      <Toaster position="top-right" />

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
        <h1 className="text-5xl font-semibold">Emotion Intelligence</h1>
        <p className="text-gray-500 mt-4">
          Analyze text with real AI understanding
        </p>
      </div>

      {/* INPUT */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow-lg">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          />

          <p className="text-right text-xs text-gray-400 mt-1">
            {text.length} characters
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => analyze()}
              className="flex-1 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            <button
              onClick={() => setText("")}
              className="px-4 border rounded-xl hover:bg-gray-100 transition"
            >
              Clear
            </button>
          </div>

          {/* QUICK EXAMPLES */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["I love this!", "This is bad", "It's okay"].map((ex, i) => (
              <button
                key={i}
                onClick={() => analyze(ex)}
                className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100 transition"
              >
                {ex}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center mt-4 text-gray-500 flex justify-center gap-2">
              <Brain className="animate-pulse w-4 h-4" />
              Thinking...
            </p>
          )}
        </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center"
            >
              <p className="text-gray-400 text-sm">Prediction</p>

              <p className={`text-4xl font-semibold ${getColor(result.sentiment)}`}>
                {result.sentiment}
              </p>

              {/* Strength badge */}
              <span className="inline-block mt-2 text-xs px-3 py-1 border rounded-full">
                {getStrength(result.score)} confidence
              </span>

              {/* Confidence bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-black rounded-full transition-all"
                  style={{ width: `${result.score * 100}%` }}
                />
              </div>

              <p className="text-gray-500 mt-2">
                {(result.score * 100).toFixed(1)}%
              </p>

              {/* ACTIONS */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.sentiment);
                    toast.success("Copied");
                  }}
                  className="flex items-center gap-1 border px-3 py-1 rounded-lg"
                >
                  <Copy size={14} /> Copy
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob(
                      [JSON.stringify(result, null, 2)],
                      { type: "application/json" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "result.json";
                    a.click();
                  }}
                  className="flex items-center gap-1 border px-3 py-1 rounded-lg"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INSIGHTS */}
        {tab === "insights" && stats && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">

            {/* MINI STATS */}
            <div className="flex justify-around mb-6 text-center">
              {chartData.map((c, i) => (
                <div key={i}>
                  <p className="font-semibold text-lg">{c.value}</p>
                  <p className="text-gray-400 text-sm">{c.name}</p>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chartData} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* PERCENT */}
            <div className="flex justify-around mt-4 text-sm">
              {chartData.map((c, i) => (
                <div key={i}>
                  {((c.value / total) * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-h-[300px] overflow-y-auto">
            {historyData.length === 0 ? (
              <p className="text-center text-gray-400">No history yet</p>
            ) : (
              historyData.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-2 text-sm items-center"
                >
                  <span className="truncate max-w-[40%]">
                    {item.text}
                  </span>

                  <button
                    onClick={() => analyze(item.text)}
                    className="text-blue-500 text-xs"
                  >
                    Reuse
                  </button>

                  <span className={getColor(item.sentiment)}>
                    {item.sentiment}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;