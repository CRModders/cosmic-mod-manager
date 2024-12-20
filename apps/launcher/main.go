package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
)

//go:embed all:frontend/build/client
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "CRMM",
		Width:            1280,
		Height:           800,
		MinWidth:         960,
		MinHeight:        720,
		BackgroundColour: &options.RGBA{R: 228, G: 232, B: 236, A: 1},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Frameless: true,
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
		Linux: &linux.Options{
			WindowIsTranslucent: true,
			ProgramName:         "CRMM",
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
