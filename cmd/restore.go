package cmd

import (
	"os"
	"os/exec"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var restoreCmd = &cobra.Command{
	Use:   "restore",
	Short: "View git history to restore notes",
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Load()
		if err != nil {
			return err
		}

		c := exec.Command("git", "log", "--oneline", "--decorate")
		c.Dir = cfg.Root
		c.Stdout = os.Stdout
		c.Stderr = os.Stderr
		return c.Run()
	},
}

func init() {
	rootCmd.AddCommand(restoreCmd)
}
