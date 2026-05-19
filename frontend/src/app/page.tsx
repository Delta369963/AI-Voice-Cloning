"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1.2);
  const [genTime, setGenTime] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Canvas background animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;

    // Particles
    const particles = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      sp: Math.random() * 0.00022 + 0.00008,
      a: Math.random() * 0.55 + 0.15,
      side: i < 55 ? "L" : "R",
    }));

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function wave(
      oy: number,
      amp: number,
      freq: number,
      phase: number,
      color: string,
      alpha: number
    ) {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx.beginPath();
      ctx.moveTo(0, oy);
      for (let x = 0; x <= W; x += 3) {
        ctx.lineTo(x, oy + amp * Math.sin((freq * x * Math.PI * 2) / W + phase));
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function frame() {
      const W = canvas!.width;
      const H = canvas!.height;

      ctx.clearRect(0, 0, W, H);

      // Deep navy base
      ctx.fillStyle = "#050d1f";
      ctx.fillRect(0, 0, W, H);

      // Left blue glow
      const gL = ctx.createRadialGradient(W * 0.05, H * 0.1, 0, W * 0.05, H * 0.1, W * 0.52);
      gL.addColorStop(0, "rgba(29,78,216,0.65)");
      gL.addColorStop(0.5, "rgba(29,78,216,0.25)");
      gL.addColorStop(1, "rgba(29,78,216,0)");
      ctx.fillStyle = gL;
      ctx.fillRect(0, 0, W, H);

      // Right orange-pink-purple glow
      const gR = ctx.createRadialGradient(W * 0.95, H * 0.9, 0, W * 0.95, H * 0.9, W * 0.58);
      gR.addColorStop(0, "rgba(234,88,12,0.55)");
      gR.addColorStop(0.3, "rgba(217,70,239,0.45)");
      gR.addColorStop(0.65, "rgba(124,58,237,0.2)");
      gR.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gR;
      ctx.fillRect(0, 0, W, H);

      // Blue wave lines (left side)
      wave(H * 0.28, H * 0.11, 1.6, t * 0.7,        "rgba(96,165,250,1)",  0.55);
      wave(H * 0.40, H * 0.09, 2.1, t * 0.55 + 1.0, "rgba(59,130,246,1)",  0.45);
      wave(H * 0.52, H * 0.07, 1.9, t * 0.85 + 2.0, "rgba(147,197,253,1)", 0.35);

      // Warm wave lines (right side)
      wave(H * 0.60, H * 0.10, 1.7, t * 0.65 + 3.0, "rgba(251,146,60,1)",  0.45);
      wave(H * 0.72, H * 0.08, 2.0, t * 0.50 + 5.0, "rgba(232,121,249,1)", 0.40);
      wave(H * 0.46, H * 0.06, 1.3, t * 0.90 + 4.0, "rgba(196,132,252,1)", 0.30);

      // Floating particles
      particles.forEach((p) => {
        p.y -= p.sp;
        if (p.y < -0.02) { p.y = 1.05; p.x = Math.random(); }
        const px = p.side === "L" ? p.x * W * 0.28 : W * 0.72 + p.x * W * 0.28;
        const py = p.y * H;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.side === "L"
            ? `rgba(147,197,253,${p.a})`
            : `rgba(249,168,212,${p.a})`;
        ctx.fill();
      });

      t += 0.016;
      animId = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  async function generateVoice() {
    if (!file || !text) {
      alert("Please upload a voice sample and enter text.");
      return;
    }
    try {
      setLoading(true);
      setGenTime(null);
      const t0 = Date.now();

      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("http://127.0.0.1:8000/upload", formData);

      const genRes = await axios.post("http://127.0.0.1:8000/generate", {
        text,
        filename: uploadRes.data.filename,
        speed,
      });

      setGenTime(((Date.now() - t0) / 1000).toFixed(2));
      setAudioUrl(
        `http://127.0.0.1:8000/audio/${genRes.data.audio_file}?t=${Date.now()}`
      );
    } catch (err) {
      console.error(err);
      alert("Generation failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  const sliderPct = ((speed - 0.8) / (2 - 0.8)) * 100;

  return (
    <main className="page-root">
      {/* Canvas lives behind everything */}
      <canvas ref={canvasRef} className="bg-canvas" />

      <div className="card">
        {/* Title */}
        <h1 className="title">AI Voice Cloning</h1>
        <p className="subtitle">Generate realistic cloned speech using XTTS v2</p>

        {/* Upload zone */}
        <div className="upload-zone" onClick={() => inputRef.current?.click()}>
          <svg width="68" height="52" viewBox="0 0 68 52" fill="none">
            <path
              d="M11 34c0-9.389 7.611-17 17-17 1.148 0 2.27.114 3.354.33C33.58 12.16 39.57 8 46.5 8 55.612 8 63 15.388 63 24.5c0 .356-.011.71-.033 1.06C65.383 27.22 67 30.12 67 33.5 67 39.299 62.299 44 56.5 44H11C5.477 44 1 39.523 1 34z"
              fill="#3b82f6"
            />
            <path
              d="M34 26v16M27 33l7-7 7 7"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h2 className="upload-title">Upload Voice Sample</h2>
          <p className="upload-sub">WAV or MP3 • Single Speaker</p>
          {file && <p className="upload-filename">Selected: {file.name}</p>}

          <input
            ref={inputRef}
            type="file"
            accept=".wav,.mp3"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
        </div>

        {/* Textarea */}
        <div className="textarea-wrap">
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to generate..."
          />
          <div className="textarea-meta">
            <span>{text.length} characters</span>
            <span>Speed: {speed.toFixed(1)}x</span>
          </div>
        </div>

        {/* Speed slider */}
        <div className="speed-row">
          <span>Speed</span>
          <span>{speed.toFixed(1)}x</span>
        </div>
        <div className="slider-wrap">
          <div className="slider-fill" style={{ width: `${sliderPct}%` }} />
          <input
            type="range"
            className="slider"
            min={0.8}
            max={2}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        {/* Generate button */}
        <button className="btn-generate" onClick={generateVoice} disabled={loading}>
          {loading ? (
            <><span className="spinner" /> Generating...</>
          ) : (
            "Generate Voice ✨"
          )}
        </button>

        {genTime && !loading && (
          <p className="gen-time">Generated in {genTime}s</p>
        )}

        {/* Audio output */}
        {audioUrl && (
          <div className="audio-section">
            <audio key={audioUrl} controls autoPlay className="audio-player">
              <source src={audioUrl} />
            </audio>
            <a href={audioUrl} download className="btn-download">
              ⬇&nbsp; Download Audio
            </a>
          </div>
        )}
      </div>
    </main>
  );
}