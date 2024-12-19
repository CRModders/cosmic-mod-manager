package main

import (
	"context"
	"log"
	"os"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// List directory files
// Just a test function
func (a *App) ListFiles() []string {
	files, err := os.ReadDir("./")
	if err != nil {
		log.Fatal(err)
	}

	var fileNames []string
	for _, file := range files {
		fileNames = append(fileNames, file.Name())
	}
	return fileNames
}
