

'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import removeMd from "remove-markdown";
import confetti from "canvas-confetti";

export default function QueryMate() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<{top:string, left:string, delay:number, duration:number}[]>([]);

  useEffect(() => {
    setIsClient(true);

    // Initialize dark mode based on prefers-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    // Generate particles only on client
    const generated = Array.from({ length: 10 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random(),
      duration: 8 + Math.random() * 4
    }));
    setParticles(generated);
  }, []);

  const cleanAnswer = (text: string) => {
    if (!text) return "";
    return removeMd(text)
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/!\[(.*?)\]\((.*?)\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setShowFull(false);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (data.answer) {
        const clean = cleanAnswer(data.answer);
        setAnswer(clean);
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }, 300);
      } else {
        setAnswer("❌ No answer received.");
      }
    } catch (err) {
      console.error(err);
      setAnswer("💥 Something went wrong.");
    }

    setLoading(false);
  };

  const getPreviewAnswer = () => {
    if (!answer) return "";
    const sentences = answer.match(/[^.!?]+[.!?]+/g) || [answer];
    if (showFull || sentences.length <= 3) return answer;
    return sentences.slice(0, 3).join(" ") + " …";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const themeBg = darkMode ? "#000" : "#fff";
  const themeText = darkMode ? "#fff" : "#000";
  const themeSubText = darkMode ? "#999" : "#555";
  const themeInputBg = darkMode ? "#111" : "#f7f7f7";
  const themeBorder = darkMode ? "#222" : "#ddd";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: themeBg,
        color: themeText,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isClient && (
        <AnimatePresence>
          {particles.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                zIndex: 0,
              }}
              animate={{ y: ["0%", "-200%"], opacity: [1, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* 🌗 Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark/light mode"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "transparent",
          border: `1px solid ${themeBorder}`,
          color: themeText,
          borderRadius: "20px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>

      <h1 style={{ fontSize: "3rem", fontWeight: 700, zIndex: 1 }}>QueryMate 💡</h1>
      <p style={{ color: themeSubText, marginBottom: "20px" }}>Precise, instant answers ✨</p>

      <form onSubmit={handleSubmit} style={{ zIndex: 1 }}>
        <input
          type="text"
          placeholder="Ask your question… ❓"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: "340px",
            padding: "14px",
            borderRadius: "8px",
            border: `1px solid ${themeBorder}`,
            background: themeInputBg,
            color: themeText,
            fontSize: "1rem",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px 22px",
            marginLeft: "10px",
            background: darkMode ? "#fff" : "#000",
            color: darkMode ? "#000" : "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {loading ? "Thinking…" : "Ask 🚀"}
        </button>
      </form>

      <div style={{ maxWidth: "700px", width: "90%", zIndex: 1 }}>
        <h3 style={{ color: themeSubText }}>Answer:</h3>
        <div
          style={{
            minHeight: "80px",
            padding: "20px",
            background: themeInputBg,
            border: `1px solid ${themeBorder}`,
            borderRadius: "8px",
            color: themeText,
            position: "relative",
          }}
        >
          {loading ? (
            <div
              style={{
                background: `linear-gradient(90deg, ${themeInputBg}, ${
                  darkMode ? "#222" : "#ddd"
                }, ${themeInputBg})`,
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                height: "1em",
                width: "80%",
                borderRadius: "4px",
              }}
            />
          ) : (
            getPreviewAnswer()
          )}
        </div>

        {!loading && answer && (
          <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
            <button onClick={() => setShowFull(!showFull)}>{showFull ? "Show Less 🔼" : "Show Full 🔽"}</button>
            <button onClick={handleCopy}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto", padding: "20px", fontSize: "0.8rem", color: themeSubText }}>
        © {new Date().getFullYear()} QueryMate 🌟
      </div>

      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        `}
      </style>
    </div>
  );
}
