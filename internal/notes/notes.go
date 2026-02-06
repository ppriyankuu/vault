package notes

import (
	"os"
	"path/filepath"
)

func NotePath(root, name string) string {
	return filepath.Join(root, name) + ".md"
}

func Create(root, name string) (string, error) {
	path := NotePath(root, name)
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return "", err
	}

	file, err := os.OpenFile(path, os.O_CREATE, 0644)
	if err != nil {
		return "", err
	}

	file.Close()
	return path, nil
}
