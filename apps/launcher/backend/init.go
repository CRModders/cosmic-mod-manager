package backend

import (
	"errors"
	"launcher/backend/utils"
)

type GameVersionFile struct {
	Url    string `json:"url"`
	Sha256 string `json:"sha256"`
	Size   int    `json:"size"`
}

type GameVersion struct {
	Id          string          `json:"id"`
	Type        string          `json:"type"`
	ReleaseTime int             `json:"releaseTime"`
	Client      GameVersionFile `json:"client"`
	Server      GameVersionFile `json:"server"`
}

func GetGameVersions() ([]GameVersion, error) {
	const sourceUrl = "https://raw.githubusercontent.com/CRModders/CosmicArchive/refs/heads/main/versions.json"
	res, err := utils.Fetch(sourceUrl)
	if err != nil {
		return nil, errors.New("failed to fetch game versions")
	}

	data, err := utils.JSONFromBytes(res)
	if err != nil {
		return nil, errors.New("failed to parse versions JSON")
	}

	if data["versions"] == nil {
		return nil, errors.New("either the JSON parse or the network request failed")
	}

	VersionsList := []GameVersion{}
	for _, version := range data["versions"].([]any) {
		ListItem := GameVersion{
			Id:          version.(map[string]any)["id"].(string),
			Type:        version.(map[string]any)["type"].(string),
			ReleaseTime: int(version.(map[string]any)["releaseTime"].(float64)),
		}

		if version.(map[string]any)["client"] != nil {
			ListItem.Client = GameVersionFile{
				Url:    version.(map[string]any)["client"].(map[string]any)["url"].(string),
				Sha256: version.(map[string]any)["client"].(map[string]any)["sha256"].(string),
				Size:   int(version.(map[string]any)["client"].(map[string]any)["size"].(float64)),
			}
		}

		if version.(map[string]any)["server"] != nil {
			ListItem.Server = GameVersionFile{
				Url:    version.(map[string]any)["server"].(map[string]any)["url"].(string),
				Sha256: version.(map[string]any)["server"].(map[string]any)["sha256"].(string),
				Size:   int(version.(map[string]any)["server"].(map[string]any)["size"].(float64)),
			}
		}

		VersionsList = append(VersionsList, ListItem)
	}

	return VersionsList, nil
}
