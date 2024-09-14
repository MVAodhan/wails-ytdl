import { useState, useRef } from "react";
import "./index.css";
import { DownloadVideo, OpenFile, ClipVideo } from "../wailsjs/go/main/App";
import DropDown from "./components/DropDown";

function App() {
  const [videoPath, setVideoPath] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const urlRef = useRef<HTMLInputElement | null>(null);

  const options = [
    {
      id: 1,
      name: "Open File",
    },
  ];

  async function downloadVideo() {
    const done = await DownloadVideo(urlRef.current!.value);

    console.log(done);
  }

  async function openFile() {
    try {
      const filePath = await OpenFile();

      console.log(filePath);
      if (filePath === "") {
        console.log("no file selected");
        return;
      }
      const path = `src${filePath}`;
      setVideoPath(path);
      readVideo(path);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  }

  function execFfmpeg() {
    ClipVideo();
  }

  function readVideo(filePath: string) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        console.log("Video file loaded successfully");
        // You can now use arrayBuffer to create a Blob or URL
        const blob = new Blob([arrayBuffer], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        setVideoURL(url);
      })
      .catch((error) => {
        console.error("Error reading video:", error);
      });
  }

  return (
    <div id="App">
      <nav>
        <DropDown openFile={openFile} options={options} />
        <div className="input-box">
          <input
            className="input"
            ref={urlRef}
            autoComplete="off"
            type="text"
          />
          <button id="dl-btn" onClick={downloadVideo}>
            Download by URL
          </button>
          <button id="dl-btn" onClick={execFfmpeg}>
            Exec Ffmpeg
          </button>
        </div>
      </nav>
      <main id="main">
        <div id="layout">
          <video id="video" src={videoURL} controls />
        </div>
      </main>
    </div>
  );
}

export default App;
