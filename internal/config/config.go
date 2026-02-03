package config

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type Config struct {
	Editor string `json:"editor"`
	Root   string `json:"root"`
}

func GetVaultPath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(home, "Public", ".vault"), nil
}

func Init() error {
	vaultPath, err := GetVaultPath()
	if err != nil {
		return err
	}

	if err := os.MkdirAll(vaultPath, 0755); err != nil {
		return err
	}

	cfg := Config{
		Editor: "vim",
		Root:   vaultPath,
	}

	data, _ := json.MarshalIndent(cfg, "", "  ")
	configPath := filepath.Join(vaultPath, "config.json")
	return os.WriteFile(configPath, data, 0644)
}
