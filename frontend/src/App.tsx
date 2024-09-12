import { useState, useRef } from "react";
import "./App.css";
import { DownloadVideo } from "../wailsjs/go/main/App";
import fs from "fs";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const urlRef = useRef<HTMLInputElement | null>(null);

  async function downloadVideo() {
    const done = await DownloadVideo(urlRef.current!.value);

    console.log(done);
  }

  function readVideo() {
    const filePath = "./src/assets/maori-activism.mp4";

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

        // Example: Create a video element and play it
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        document.body.appendChild(video);
      })
      .catch((error) => {
        console.error("Error reading video:", error);
      });
  }
  return (
    <div id="App">
      {/* <img src={logo} id="logo" alt="logo" /> */}
      <div id="input" className="input-box">
        <input
          id="name"
          className="input"
          ref={urlRef}
          autoComplete="off"
          name="input"
          type="text"
        />
        <button onClick={downloadVideo}>Video ID</button>
        <button onClick={readVideo}>Read</button>
      </div>
    </div>
  );
}

export default App;
