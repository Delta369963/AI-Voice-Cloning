"use client";

import { useState } from "react";

import API from "@/services/api";

import toast, { Toaster } from "react-hot-toast";

import {
  FaCloudUploadAlt,
  FaSpinner
} from "react-icons/fa";

export default function Home() {

  const [file, setFile] =
    useState<File | null>(null);

  const [text, setText] =
    useState("");

  const [audioUrl, setAudioUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [speed, setSpeed] =
    useState(1.2);

  const [generationTime, setGenerationTime] =
    useState<number | null>(null);

  const handleGenerate = async () => {

    if (!file || !text) {

      toast.error(
        "Please upload a file and enter text."
      );

      return;
    }

    try {

      setLoading(true);

      const start = performance.now();

      toast.loading(
        "Generating AI voice...",
        {
          id: "generate"
        }
      );

      // Upload File
      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      const filename =
        uploadResponse.data.filename;

      // Generate Voice
      const generateResponse =
        await API.post(
          "/generate",
          {
            text,
            filename,
            speed
          }
        );

      const generatedFile =
        generateResponse.data.audio_file;

      const finalAudioUrl =
        `http://127.0.0.1:8000/audio/${generatedFile}`;

      setAudioUrl(finalAudioUrl);

      const end = performance.now();

      setGenerationTime(
        ((end - start) / 1000)
          .toFixed(2) as unknown as number
      );

      toast.success(
        "Voice generated successfully.",
        {
          id: "generate"
        }
      );

      // Auto Play
      const audio = new Audio(finalAudioUrl);

      audio.play();

    } catch (error) {

      console.error(error);

      toast.error(
        "Voice generation failed.",
        {
          id: "generate"
        }
      );

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

      <Toaster position="top-right" />

      <div className="
        w-full
        max-w-2xl
        bg-zinc-900
        rounded-3xl
        p-8
        shadow-2xl
        space-y-6
      ">

        {/* Title */}
        <div className="text-center space-y-2">

          <h1 className="
            text-5xl
            font-extrabold
            bg-gradient-to-r
            from-blue-400
            to-cyan-300
            bg-clip-text
            text-transparent
          ">
            AI Voice Cloning
          </h1>

          <p className="
            text-zinc-400
          ">
            Generate realistic cloned speech
            using XTTS v2
          </p>

        </div>

        {/* Upload Box */}
        <label
          htmlFor="audio-upload"
          className="
            flex
            flex-col
            items-center
            justify-center
            w-full
            h-52
            border-2
            border-dashed
            border-zinc-600
            rounded-3xl
            cursor-pointer
            hover:border-blue-500
            hover:bg-zinc-800/40
            transition
            text-zinc-300
          "
        >

          <FaCloudUploadAlt
            className="
              text-6xl
              mb-4
              text-blue-400
            "
          />

          <p className="
            text-xl
            font-semibold
          ">
            Upload Voice Sample
          </p>

          <p className="
            text-sm
            text-zinc-400
            mt-2
          ">
            WAV or MP3 • Single Speaker
          </p>

          {
            file && (
              <p className="
                mt-4
                text-green-400
                font-medium
              ">
                Selected: {file.name}
              </p>
            )
          }

        </label>

        <input
          id="audio-upload"
          type="file"
          accept=".wav,.mp3"
          className="hidden"
          onChange={(e) => {

            if (e.target.files) {

              setFile(
                e.target.files[0]
              );

              toast.success(
                "Audio uploaded."
              );
            }
          }}
        />

        {/* Text Area */}
        <div className="space-y-2">

          <textarea
            placeholder="
Enter text to generate...
            "
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            className="
              w-full
              h-40
              bg-zinc-800
              rounded-2xl
              p-4
              text-white
              outline-none
              resize-none
            "
          />

          <div className="
            flex
            justify-between
            text-sm
            text-zinc-400
          ">

            <span>
              {text.length} characters
            </span>

            <span>
              Speed: {speed.toFixed(1)}x
            </span>

          </div>

        </div>

        {/* Speed Slider */}
        <div className="space-y-2">

          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) =>
              setSpeed(
                parseFloat(e.target.value)
              )
            }
            className="w-full"
          />

        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            transition
            rounded-2xl
            py-4
            font-bold
            text-lg
            flex
            items-center
            justify-center
            gap-3
            disabled:opacity-60
          "
        >

          {
            loading ? (
              <>
                <FaSpinner
                  className="
                    animate-spin
                  "
                />
                Generating...
              </>
            ) : (
              "Generate Voice"
            )
          }

        </button>

        {/* Generation Time */}
        {
          generationTime && (
            <p className="
              text-center
              text-zinc-400
            ">
              Generated in
              {" "}
              {generationTime}s
            </p>
          )
        }

        {/* Audio Player */}
        {
          audioUrl && (
            <div className="
              space-y-4
              pt-4
            ">

              <audio
                controls
                autoPlay
                className="
                  w-full
                "
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
                  rounded-2xl
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