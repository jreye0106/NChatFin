export default function TypingIndicator() {
  return (
    <div style={{ padding: "6px 12px", opacity: 0.7 }}>
      <div className="typing">
        <span></span><span></span><span></span>
      </div>

      <style>{`
        .typing span {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          background: #4f7cff;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
      `}</style>
    </div>
  );
}
