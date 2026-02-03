package cmd

import (
	"github.com/ppriyankuu/vault/internal/config"
	"github.com/ppriyankuu/vault/internal/editor"
	"github.com/ppriyankuu/vault/internal/notes"
	"github.com/spf13/cobra"
)

var newCmd = &cobra.Command{
	Use:     "new <relative path to your topic>",
	Example: "\tnew dbms/normalization\n\tnew system-desing/load-balancer",
	Short:   "Create a new note",
	Args:    cobra.ExactArgs(1),
	RunE:    newCommand,
}

func newCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	path, err := notes.Create(cfg.Root, args[0])
	if err != nil {
		return err
	}

	return editor.Open("vim", path)
}

func init() {
	rootCmd.AddCommand(newCmd)
}
