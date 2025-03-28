
package client.command.commands.gm0;

import client.Client;
import client.command.Command;

// AdventureMS Custom
public class BuyBackCommand extends Command {
    {
        setDescription("Opens the buyback system.");
    }

    @Override
    public void execute(Client c, String[] params)
    {
        c.getAbstractPlayerInteraction().openNpc(9800016);
    }
}