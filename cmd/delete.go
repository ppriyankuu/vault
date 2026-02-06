package cmd

import (
	"fmt"
	"os"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/ppriyankuu/vault/internal/notes"
	"github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
	Use:     "delete <relative path> [relative path ...]",
	Example: "\tdelete dbms/normalization\n\tdelete dbms/normalization AI/RAG",
	Short:   "Delete one or more notes",
	Args:    cobra.MinimumNArgs(1),
	RunE:    deleteCommand,
}

func deleteCommand(cmd *cobra.Command, args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	var hadError bool

	for _, arg := range args {
		path := notes.NotePath(cfg.Root, arg)

		if _, err := os.Stat(path); err != nil {
			fmt.Printf("✗ not found: %s\n", arg)
			hadError = true
			continue
		}

		if err := os.Remove(path); err != nil {
			fmt.Printf("✗ failed to delete: %s (%v)\n", arg, err)
			hadError = true
			continue
		}

		fmt.Printf("✓ deleted: %s\n", arg)
	}

	if hadError {
		return fmt.Errorf("some notes could not be deleted")
	}

	return nil
}

func init() {
	rootCmd.AddCommand(deleteCmd)
}
