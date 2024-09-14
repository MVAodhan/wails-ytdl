package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os/exec"

	"os"

	"strings"

	"github.com/kkdai/youtube/v2"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) DownloadVideo(videoUrl string) string {

	client := youtube.Client{}

	_, ID, _ := strings.Cut(videoUrl, "=")

	video, err := client.GetVideo(ID)
	if err != nil {
		panic(err)
	}

	formats := video.Formats.WithAudioChannels() // only get videos with audio
	stream, _, err := client.GetStream(video, &formats[0])
	if err != nil {
		panic(err)
	}
	defer stream.Close()

	file, err := os.Create(fmt.Sprintf("./frontend/src/assets/%s.mp4", video.Title))
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = io.Copy(file, stream)
	if err != nil {
		panic(err)
	}

	return fmt.Sprint(true)
}

func (a *App) OpenFile() string {
	options := runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "All Files (*.*)",
				Pattern:     "*.*",
			},
		},
	}

	filePath, err := runtime.OpenFileDialog(a.ctx, options)
	if err != nil {
		fmt.Printf("Error opening file dialog: %v\n", err)
		return ""
	}

	if filePath == "" {
		fmt.Println("User cancelled file selection")
		return ""
	}

	_, second, _ := strings.Cut(filePath, "src")
	newPath := strings.ReplaceAll(second, "\\", "/")
	// fmt.Printf("Selected file: %s\n", newPath)
	return newPath
}

func (a *App) ClipVideo() {

	ffmpegPath := "assets/bin/ffmpeg.exe"
	// inputPath := "assets/maori-activism.mp4"

	// Use the embedded FFmpeg binary
	// cmd := exec.Command(ffmpegPath, "-i", inputPath, "-ss", "18:19:00", "-to", "19:01:00", "clip.mp4")
	cmd := exec.Command(ffmpegPath, "-version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatal(err)
	}
	log.Println(string(output))

}
