package backend

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx          context.Context
	GameVersions []GameVersion
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	versions, err := GetGameVersions()
	if err != nil {
		fmt.Println(err)
	}

	if len(versions) == 0 {
		a.GameVersions = []GameVersion{}
	} else {
		a.GameVersions = versions
	}
}

func (a *App) GetGameVersions() []GameVersion {
	return a.GameVersions
}
