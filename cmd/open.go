package cmd

import (
	"fmt"
	"os"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/ppriyankuu/vault/internal/editor"
	"github.com/ppriyankuu/vault/internal/notes"
	"github.com/spf13/cobra"
)

var openCmd = &cobra.Command{
	Use:     "open <relative path to your topic>",
	Example: "\topen dbms/normalization\n\topen system-desing/load-balancer",
	Short:   "Open an existing note",
	Args:    cobra.ExactArgs(1),
	RunE:    openCommand,
}

func openCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	path := notes.NotePath(cfg.Root, args[0])
	if _, err := os.Stat(path); err != nil {
		return fmt.Errorf("note does not exist")
	}

	return editor.Open(cfg.Editor, path)
}

func init() {
	rootCmd.AddCommand(openCmd)
}
