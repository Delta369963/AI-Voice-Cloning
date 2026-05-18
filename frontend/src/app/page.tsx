"use client";

import { useState } from "react";
import API from "@/services/api";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);

  const [text, setText] = useState("");

  const [audioUrl, setAudioUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {

    if (!file || !text) {
      alert("Please upload a file and enter text.");
      return;
    }

    try {

      setLoading(true);

      // Upload file
      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const filename = uploadResponse.data.filename;

      // Generate voice
      const generateResponse = await API.post(
        "/generate",
        {
          text,
          filename,
          speed: 1.2
        }
      );

      const generatedFile =
        generateResponse.data.audio_file;

      const finalAudioUrl =
        `http://127.0.0.1:8000/audio/${generatedFile}`;

      setAudioUrl(finalAudioUrl);

    } catch (error) {

      console.error(error);

      alert("Voice generation failed.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      flex
      flex-col
      items-center
      justify-center
      p-10
    ">

      <div className="
        w-full
        max-w-2xl
        bg-zinc-900
        rounded-2xl
        p-8
        shadow-2xl
        space-y-6
      ">

        <h1 className="
          text-4xl
          font-bold
          text-center
        ">
          AI Voice Cloning
        </h1>

        {/* File Upload */}
        <div className="space-y-3">

          <label
            htmlFor="audio-upload"
            className="
              flex
              flex-col
              items-center
              justify-center
              w-full
              h-40
              border-2
              border-dashed
              border-zinc-600
              rounded-2xl
              cursor-pointer
              hover:border-blue-500
              hover:bg-zinc-800/50
              transition
              text-zinc-300
            "
          >

            <div className="text-center space-y-2">

              <p className="text-xl font-semibold">
                Upload Voice Sample
              </p>

              <p className="text-sm text-zinc-400">
                WAV or MP3 • Clear single-speaker audio
              </p>

              {
                file && (
                  <p className="text-green-400 font-medium">
                    Selected: {file.name}
                  </p>
                )
              }

            </div>

          </label>

          <input
            id="audio-upload"
            type="file"
            accept=".wav,.mp3"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

        </div>

        {/* Text Input */}
        <textarea
          placeholder="Enter text to generate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="
            w-full
            h-40
            bg-zinc-800
            rounded-xl
            p-4
            text-white
            outline-none
          "
        />

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            transition
            rounded-xl
            py-4
            font-bold
            text-lg
          "
        >
          {
            loading
            ? "Generating..."
            : "Generate Voice"
          }
        </button>

        {/* Audio Player */}
        {
          audioUrl && (
            <div className="space-y-4">

              <audio
                controls
                className="w-full"
              >
                <source
                  src={audioUrl}
                  type="audio/wav"
                />
              </audio>

              <a
                href={audioUrl}
                download
                className="
                  block
                  text-center
                  bg-green-500
                  hover:bg-green-600
                  transition
                  rounded-xl
                  py-3
                  font-bold
                "
              >
                Download Audio
              </a>

            </div>
          )
        }

      </div>

    </main>
  );
}