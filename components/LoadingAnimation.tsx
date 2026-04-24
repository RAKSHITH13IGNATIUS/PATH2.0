"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05050f]"
    >
      <style jsx>{`
        .trace-bg {
          stroke: #333;
          stroke-width: 1.8;
          fill: none;
        }

        .trace-flow {
          stroke-width: 1.8;
          fill: none;
          stroke-dasharray: 40 400;
          stroke-dashoffset: 438;
          filter: drop-shadow(0 0 6px currentColor);
          animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite;
        }

        .yellow {
          stroke: #ffea00;
          color: #ffea00;
        }
        .blue {
          stroke: #00ccff;
          color: #00ccff;
        }
        .green {
          stroke: #00ff15;
          color: #00ff15;
        }
        .purple {
          stroke: #9900ff;
          color: #9900ff;
        }
        .red {
          stroke: #ff3300;
          color: #ff3300;
        }

        @keyframes flow {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="w-full max-w-3xl px-6">
        <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d2d2d"></stop>
              <stop offset="100%" stopColor="#0f0f0f"></stop>
            </linearGradient>

            <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eeeeee"></stop>
              <stop offset="100%" stopColor="#888888"></stop>
            </linearGradient>

            <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#bbbbbb"></stop>
              <stop offset="50%" stopColor="#888888"></stop>
              <stop offset="100%" stopColor="#555555"></stop>
            </linearGradient>
          </defs>

          <g id="traces">
            <path d="M100 100 H200 V210 H326" className="trace-bg"></path>
            <path d="M100 100 H200 V210 H326" className="trace-flow purple"></path>

            <path d="M80 180 H180 V230 H326" className="trace-bg"></path>
            <path d="M80 180 H180 V230 H326" className="trace-flow blue"></path>

            <path d="M60 260 H150 V250 H326" className="trace-bg"></path>
            <path d="M60 260 H150 V250 H326" className="trace-flow yellow"></path>

            <path d="M100 350 H200 V270 H326" className="trace-bg"></path>
            <path d="M100 350 H200 V270 H326" className="trace-flow green"></path>

            <path d="M700 90 H560 V210 H474" className="trace-bg"></path>
            <path d="M700 90 H560 V210 H474" className="trace-flow blue"></path>

            <path d="M740 160 H580 V230 H474" className="trace-bg"></path>
            <path d="M740 160 H580 V230 H474" className="trace-flow green"></path>

            <path d="M720 250 H590 V250 H474" className="trace-bg"></path>
            <path d="M720 250 H590 V250 H474" className="trace-flow red"></path>

            <path d="M680 340 H570 V270 H474" className="trace-bg"></path>
            <path d="M680 340 H570 V270 H474" className="trace-flow yellow"></path>
          </g>

          <rect
            x="330"
            y="190"
            width="140"
            height="100"
            rx="20"
            ry="20"
            fill="url(#chipGradient)"
            stroke="#222"
            strokeWidth="3"
            filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
          ></rect>

          <g>
            <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
          </g>

          <g>
            <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
            <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
          </g>

          <text
            x="400"
            y="240"
            fontFamily="Arial, sans-serif"
            fontSize="22"
            fill="url(#textGradient)"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Loading
          </text>

          <circle cx="100" cy="100" r="5" fill="black"></circle>
          <circle cx="80" cy="180" r="5" fill="black"></circle>
          <circle cx="60" cy="260" r="5" fill="black"></circle>
          <circle cx="100" cy="350" r="5" fill="black"></circle>

          <circle cx="700" cy="90" r="5" fill="black"></circle>
          <circle cx="740" cy="160" r="5" fill="black"></circle>
          <circle cx="720" cy="250" r="5" fill="black"></circle>
          <circle cx="680" cy="340" r="5" fill="black"></circle>
        </svg>

        <div className="mt-8 text-center">
          <div className="text-purple-400 font-semibold mb-2">Initializing P.A.T.H.</div>
          <div className="w-full max-w-md mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
