package cmd

import (
	"fmt"

	"github.com/ppriyankuu/vault/internal/config"
	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize a vault",
	RunE:  initialCommand,
}

func initialCommand(cmd *cobra.Command, args []string) error {

	if err := config.Init(); err != nil {
		return err
	}

	vaultPath, _ := config.GetVaultPath()
	fmt.Println("Vault initialized at", vaultPath)
	return nil
}

func init() {
	rootCmd.AddCommand(initCmd)
}
