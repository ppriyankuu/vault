package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var cleanupCmd = &cobra.Command{
	Use:   "cleanup",
	Short: "Remove empty directories in vault",
	RunE:  cleanupCommand,
}

func cleanupCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

  if cfg.Root != "/home/ppriyankuu/Public/.vault" {
    return fmt.Errorf("refusing to run cleanup on filesystem root")
  }

	var dirs []string

	// Collect all directories
	err = filepath.Walk(cfg.Root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() && path != cfg.Root {
			dirs = append(dirs, path)
		}
		return nil
	})
	if err != nil {
		return err
	}

	// Sort deepest paths first
	sort.Slice(dirs, func(i, j int) bool {
		return len(dirs[i]) > len(dirs[j])
	})

	removed := 0

	for _, dir := range dirs {
		entries, err := os.ReadDir(dir)
		if err != nil {
			continue
		}
		if len(entries) == 0 {
			if err := os.Remove(dir); err == nil {
				removed++
			}
		}
	}

	if removed == 0 {
		fmt.Println("✓ no empty directories found")
	} else {
		fmt.Printf("✓ removed %d empty directories\n", removed)
	}

	return nil
}

func init() {
	rootCmd.AddCommand(cleanupCmd)
}

