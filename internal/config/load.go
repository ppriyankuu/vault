package config

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
)

func Load() (*Config, error) {
	dir, err := GetVaultPath()
	if err != nil {
		return nil, err
	}

	cfgPath := filepath.Join(dir, "config.json")
	if _, err := os.Stat(cfgPath); err != nil {
		return nil, errors.New("not inside a vault")
	}

	data, err := os.ReadFile(cfgPath)
	if err != nil {
		return nil, err
	}

	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
