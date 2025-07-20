// 'use client';
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import removeMd from "remove-markdown";
// import confetti from "canvas-confetti";

// export default function QueryMate() {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [rawAnswer, setRawAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showFull, setShowFull] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);
//   const [copied, setCopied] = useState(false);

//   const cleanAnswer = (text: string) => {
//     if (!text) return "";
//     return removeMd(text).replace(/\s+/g, " ").trim();
//   };

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     if (!question.trim()) {
//       setAnswer("⚠️ Please enter a question.");
//       return;
//     }

//     setLoading(true);
//     setAnswer("");
//     setRawAnswer("");
//     setShowFull(false);

//     try {
//       const res = await fetch("/api/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question }),
//       });
//       const data = await res.json();

//       if (data.answer) {
//         const clean = cleanAnswer(data.answer);
//         setRawAnswer(data.answer);
//         setAnswer(clean);
//         setTimeout(() => {
//           confetti({
//             particleCount: 100,
//             spread: 70,
//             origin: { y: 0.6 },
//           });
//         }, 300);
//       } else {
//         setAnswer("❌ No answer received.");
//       }
//     } catch (err) {
//       console.error(err);
//       setAnswer("💥 Something went wrong.");
//     }

//     setLoading(false);
//   };

//   const getPreviewAnswer = () => {
//     if (!answer) return "";
//     const sentences = answer.match(/[^.!?]+[.!?]+/g) || [answer];
//     if (showFull || sentences.length <= 3) {
//       return answer;
//     }
//     return sentences.slice(0, 3).join(" ") + " …";
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(answer).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const themeBg = darkMode
//     ? "linear-gradient(135deg, #000, #111)"
//     : "linear-gradient(135deg, #fff, #eee)";
//   const themeText = darkMode ? "#fff" : "#000";
//   const themeSubText = darkMode ? "#999" : "#555";
//   const themeInputBg = darkMode ? "#111" : "#f7f7f7";
//   const themeBorder = darkMode ? "#222" : "#ddd";

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         margin: 0,
//         padding: 0,
//         background: themeBg,
//         color: themeText,
//         fontFamily: "'Inter', sans-serif",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "flex-start",
//         paddingTop: "50px",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* 🎥 Subtle particle animation */}
//       <AnimatePresence>
//         {Array.from({ length: 10 }).map((_, i) => (
//           <motion.div
//             key={i}
//             style={{
//               position: "absolute",
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               width: "6px",
//               height: "6px",
//               borderRadius: "50%",
//               background: darkMode
//                 ? "rgba(255,255,255,0.1)"
//                 : "rgba(0,0,0,0.1)",
//               zIndex: 0,
//             }}
//             animate={{
//               y: ["0%", "-200%"],
//               opacity: [1, 0],
//             }}
//             transition={{
//               duration: 8 + Math.random() * 4,
//               repeat: Infinity,
//               delay: i * 0.5,
//               ease: "linear",
//             }}
//           />
//         ))}
//       </AnimatePresence>

//       {/* 🌗 Theme Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         aria-label="Toggle dark/light mode"
//         style={{
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           background: "transparent",
//           border: `1px solid ${themeBorder}`,
//           color: themeText,
//           borderRadius: "20px",
//           padding: "6px 12px",
//           cursor: "pointer",
//           fontSize: "0.8rem",
//         }}
//       >
//         {darkMode ? "🌞 Light" : "🌙 Dark"}
//       </button>

//       {/* Hero */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         style={{ textAlign: "center", marginBottom: "40px", zIndex: 1 }}
//       >
//         <h1
//           style={{
//             fontSize: "3rem",
//             fontWeight: 700,
//             letterSpacing: "-0.05em",
//             background: darkMode
//               ? "linear-gradient(90deg, #fff, #888)"
//               : "linear-gradient(90deg, #000, #666)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           QueryMate
//         </h1>
//         <p
//           style={{
//             fontSize: "1.1rem",
//             color: themeSubText,
//             marginTop: "0.75rem",
//           }}
//         >
//           Precise, instant answers with elegance.
//         </p>
//       </motion.div>

//       {/* Form */}
//       <motion.form
//         onSubmit={handleSubmit}
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         style={{
//           display: "flex",
//           gap: "10px",
//           marginBottom: "30px",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           zIndex: 1,
//         }}
//         aria-label="Query form"
//       >
//         <input
//           type="text"
//           placeholder="Ask your question…"
//           aria-label="Question input"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           style={{
//             width: "340px",
//             padding: "14px",
//             borderRadius: "8px",
//             border: `1px solid ${themeBorder}`,
//             background: themeInputBg,
//             color: themeText,
//             fontSize: "1rem",
//             outline: "none",
//           }}
//         />
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "14px 22px",
//             background: darkMode ? "#fff" : "#000",
//             color: darkMode ? "#000" : "#fff",
//             fontWeight: 600,
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "1rem",
//           }}
//           aria-label="Submit question"
//         >
//           {loading ? "Thinking…" : "Ask"}
//         </motion.button>
//       </motion.form>

//       {/* Answer */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         style={{
//           maxWidth: "700px",
//           width: "90%",
//           textAlign: "left",
//           zIndex: 1,
//         }}
//       >
//         <h3
//           style={{
//             color: themeSubText,
//             marginBottom: "10px",
//             fontWeight: 500,
//           }}
//         >
//           Answer:
//         </h3>

//         <motion.div
//           key={answer + (showFull ? "-full" : "-preview")}
//           initial={{ opacity: 0.3, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={{
//             minHeight: "80px",
//             padding: "20px",
//             background: themeInputBg,
//             border: `1px solid ${themeBorder}`,
//             borderRadius: "8px",
//             color: themeText,
//             lineHeight: "1.6",
//             fontSize: "1rem",
//             position: "relative",
//             overflow: "hidden",
//           }}
//           aria-live="polite"
//         >
//           {loading ? (
//             <div
//               style={{
//                 background: `linear-gradient(90deg, ${themeInputBg}, ${
//                   darkMode ? "#222" : "#ddd"
//                 }, ${themeInputBg})`,
//                 backgroundSize: "200% 100%",
//                 animation: "shimmer 1.5s infinite",
//                 height: "1em",
//                 width: "80%",
//                 borderRadius: "4px",
//               }}
//             />
//           ) : (
//             getPreviewAnswer()
//           )}
//         </motion.div>

//         {!loading && answer && (
//           <div
//             style={{
//               marginTop: "12px",
//               display: "flex",
//               gap: "10px",
//               flexWrap: "wrap",
//             }}
//           >
//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//                 background: darkMode ? "#222" : "#eee",
//                 color: darkMode ? "#fff" : "#000",
//               }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowFull(!showFull)}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 background: darkMode ? "#fff" : "#000",
//                 color: darkMode ? "#000" : "#fff",
//                 fontWeight: 500,
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: "0.9rem",
//               }}
//               aria-label="Toggle full answer"
//             >
//               {showFull ? "Show Less" : "Show Full Answer"}
//             </motion.button>

//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//               }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleCopy}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 background: darkMode ? "#444" : "#ddd",
//                 color: darkMode ? "#fff" : "#000",
//                 fontWeight: 500,
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: "0.9rem",
//               }}
//               aria-label="Copy answer to clipboard"
//             >
//               {copied ? "✅ Copied!" : "📋 Copy"}
//             </motion.button>
//           </div>
//         )}
//       </motion.div>

//       <div
//         style={{
//           marginTop: "auto",
//           padding: "20px",
//           fontSize: "0.8rem",
//           color: themeSubText,
//         }}
//       >
//         © {new Date().getFullYear()} QueryMate. Premium UX.
//       </div>

//       <style>
//         {`
//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
//       `}
//       </style>
//     </div>
//   );
// }



'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import removeMd from "remove-markdown";
import confetti from "canvas-confetti";

export default function QueryMate() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to handle client-side only rendering for particles

  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts on the client
  }, []);

  const cleanAnswer = (text: string) => {
    if (!text) return "";
    // Using a regex to remove markdown links and images more robustly
    let cleanedText = removeMd(text)
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // Remove markdown links, keep link text
      .replace(/!\[(.*?)\]\((.*?)\)/g, "") // Remove markdown images
      .replace(/\s+/g, " ")
      .trim();
    return cleanedText;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setRawAnswer("");
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
        setRawAnswer(data.answer);
        setAnswer(clean);
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
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
    if (showFull || sentences.length <= 3) {
      return answer;
    }
    return sentences.slice(0, 3).join(" ") + " …";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const themeBg = darkMode
    ? "linear-gradient(135deg, #000, #111)"
    : "linear-gradient(135deg, #fff, #eee)";
  const themeText = darkMode ? "#fff" : "#000";
  const themeSubText = darkMode ? "#999" : "#555";
  const themeInputBg = darkMode ? "#111" : "#f7f7f7";
  const themeBorder = darkMode ? "#222" : "#ddd";

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: themeBg,
        color: themeText,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🎥 Subtle particle animation - Conditionally render on client */}
      {isClient && (
        <AnimatePresence>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                zIndex: 0,
              }}
              animate={{
                y: ["0%", "-200%"],
                opacity: [1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5,
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

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "40px", zIndex: 1 }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            // Directly set text color for clarity and visibility
            color: themeText,
            // Removed gradient background and text clipping
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          QueryMate 💡
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: themeSubText,
            marginTop: "0.75rem",
          }}
        >
          Precise, instant answers with elegance. ✨
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
        aria-label="Query form"
      >
        <input
          type="text"
          placeholder="Ask your question… ❓"
          aria-label="Question input"
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
            outline: "none",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          style={{
            padding: "14px 22px",
            background: darkMode ? "#fff" : "#000",
            color: darkMode ? "#000" : "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          aria-label="Submit question"
        >
          {loading ? "Thinking… 🤔" : "Ask 🚀"}
        </motion.button>
      </motion.form>

      {/* Answer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          maxWidth: "700px",
          width: "90%",
          textAlign: "left",
          zIndex: 1,
        }}
      >
        <h3
          style={{
            color: themeSubText,
            marginBottom: "10px",
            fontWeight: 500,
          }}
        >
          Answer:
        </h3>

        <motion.div
          key={answer + (showFull ? "-full" : "-preview")}
          initial={{ opacity: 0.3, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            minHeight: "80px",
            padding: "20px",
            background: themeInputBg,
            border: `1px solid ${themeBorder}`,
            borderRadius: "8px",
            color: themeText,
            lineHeight: "1.6",
            fontSize: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
          aria-live="polite"
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
        </motion.div>

        {!loading && answer && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                background: darkMode ? "#222" : "#eee",
                color: darkMode ? "#fff" : "#000",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFull(!showFull)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: darkMode ? "#fff" : "#000",
                color: darkMode ? "#000" : "#fff",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
              aria-label="Toggle full answer"
            >
              {showFull ? "Show Less 🔼" : "Show Full Answer 🔽"}
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: darkMode ? "#444" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
              aria-label="Copy answer to clipboard"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </motion.button>
          </div>
        )}
      </motion.div>

      <div
        style={{
          marginTop: "auto",
          padding: "20px",
          fontSize: "0.8rem",
          color: themeSubText,
        }}
      >
        © {new Date().getFullYear()} QueryMate. Premium UX. 🌟
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