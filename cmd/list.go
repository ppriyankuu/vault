package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all notes",
	RunE:  listCommand,
}

func listCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	// Map to store directory structure
	dirMap := make(map[string][]string)

	// Collect all .txt files
	err = filepath.Walk(cfg.Root, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		if strings.HasSuffix(path, ".txt") {
			rel, _ := filepath.Rel(cfg.Root, path)
			rel = strings.TrimSuffix(rel, ".txt")

			// Split path into components
			dir := filepath.Dir(rel)
			file := filepath.Base(rel)

			// Store in map
			dirMap[dir] = append(dirMap[dir], file)
		}
		return nil
	})

	if err != nil {
		return err
	}

	if len(dirMap) == 0 {
		fmt.Println("No notes found. Run `vault new` to create one.")
		return nil
	}

	// Get and sort directory names
	var dirs []string
	for dir := range dirMap {
		dirs = append(dirs, dir)
	}
	sort.Strings(dirs)

	// Print tree structure
	for _, dir := range dirs {
		files := dirMap[dir]
		sort.Strings(files)

		if dir == "." {
			// Files in root directory
			for _, file := range files {
				fmt.Println("📄 " + file)
			}
		} else {
			// Directory with its files
			fmt.Println("📁 " + dir)
			for _, file := range files {
				fmt.Println("   └── 📄 " + file)
			}
		}
	}

	return nil
}

func init() {
	rootCmd.AddCommand(listCmd)
}
