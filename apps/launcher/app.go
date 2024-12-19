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
	return GetDirFiles("./")
}

func GetDirFiles(dir string) []string {
	files, err := os.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
	}

	filesList := []string{}
	for _, file := range files {
		fileName := file.Name()
		if IsExcludedDir(&fileName) {
			continue
		}

		if file.IsDir() {
			nestedFiles := GetDirFiles(dir + fileName + "/")
			filesList = append(filesList, nestedFiles...)
		} else {
			filesList = append(filesList, dir+fileName)
		}
	}

	return filesList
}

func IsExcludedDir(dirName *string) bool {
	excludedDirs := []string{"node_modules", ".git", "dist", "build", "wailsjs", ".react-router"}

	for _, excludedDir := range excludedDirs {
		if *dirName == excludedDir {
			return true
		}
	}

	return false
}
