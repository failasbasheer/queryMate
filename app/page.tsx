'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import removeMd from "remove-markdown";

export default function QueryMate() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanAnswer = (text: string) => {
    if (!text) return "";
    return removeMd(text).replace(/\s+/g, " ").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setRawAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (data.answer) {
        setRawAnswer(data.answer);
        setAnswer(cleanAnswer(data.answer));
      } else {
        setAnswer("❌ No answer received.");
      }
    } catch (err) {
      console.error(err);
      setAnswer("💥 Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#0a0a0a",
        color: "#e5e5e5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        textRendering: "optimizeLegibility",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.03em",
          }}
        >
          🤖 QueryMate
        </h1>
        <p style={{ fontSize: "1rem", color: "#888", marginTop: "0.5rem" }}>
          Ask anything. Get clear, instant answers.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "#fff",
            color: "#000",
            fontWeight: 500,
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          maxWidth: "600px",
          width: "90%",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <h3 style={{ color: "#999", marginBottom: "10px", fontWeight: 500 }}>
          📋 Answer:
        </h3>

        <motion.div
          key={answer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            minHeight: "80px",
            padding: "20px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "6px",
            color: "#e5e5e5",
            lineHeight: "1.6",
            fontSize: "1rem",
          }}
        >
          {loading ? "Loading..." : answer}
        </motion.div>

        {rawAnswer && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: "20px",
              cursor: "pointer",
              color: "#777",
            }}
          >
            <summary>Show Raw Answer</summary>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#111",
                padding: "10px",
                borderRadius: "6px",
                marginTop: "10px",
                color: "#bbb",
              }}
            >
              {rawAnswer}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}
