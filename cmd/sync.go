package cmd

import (
	"os"
	"os/exec"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "Sync vault using git",
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Load()
		if err != nil {
			return err
		}

		commands := [][]string{
			{"git", "add", "."},
			{"git", "commit", "-m", "vault sync"},
			{"git", "push"},
		}

		for _, c := range commands {
			cmd := exec.Command(c[0], c[1:]...)
			cmd.Dir = cfg.Root
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			_ = cmd.Run()
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
}
