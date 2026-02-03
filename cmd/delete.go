package cmd

import (
	"fmt"
	"os"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/ppriyankuu/vault/internal/notes"
	"github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
	Use:     "delete <relative path to your topic",
	Example: "\tdelete dbms/normalization\n\tdelete system-design/load-balancer",
	Short:   "Delete a note",
	Args:    cobra.ExactArgs(1),
	RunE:    deleteCommand,
}

func deleteCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	path := notes.NotePath(cfg.Root, args[0])

	if _, err := os.Stat(path); err != nil {
		return fmt.Errorf("note does not exist")
	}

	if err := os.Remove(path); err != nil {
		return err
	}

	fmt.Printf("✓ deleted: %s\n", args[0])
	return nil
}

func init() {
	rootCmd.AddCommand(deleteCmd)
}
