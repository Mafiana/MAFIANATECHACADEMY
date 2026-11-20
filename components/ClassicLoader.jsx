export default function ClassicLoader({ className = "", size = 20, ...props }) {
  return (
    <>
      <style>{`
        @keyframes classic-fade {
          0%   { opacity: 1; }
          100% { opacity: 0.15; }
        }
        .classic-loader {
          display: inline-block;
          position: relative;
          box-sizing: border-box;
        }
        .classic-loader span {
          position: absolute;
          top: -3.9%;
          left: -10%;
          display: block;
          height: 8%;
          width: 24%;
          border-radius: 2px;
          background: currentColor;
          animation: classic-fade 1.2s linear infinite;
        }
      `}</style>

      <span
        role="status"
        className={`classic-loader ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            top: "50%",
            left: "50%",
            display: "block",
            width: "100%",
            height: "100%",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              style={{
                transform: `rotate(${i * 30}deg) translate(146%)`,
                animationDelay: `calc(1.2s / 12 * ${i - 12})`,
              }}
            />
          ))}
        </span>
        <span className="sr-only">Loading</span>
      </span>
    </>
  );
}