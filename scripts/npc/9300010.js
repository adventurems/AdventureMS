// Author: Pepa

// AdventureMS Mr Moneybags

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Get the list of buyback items
        var buybackItems = cm.getPlayer().getBuyback();

        // Make sure it is not empty
        if (buybackItems.size() > 0)
        {
            cm.sendOk("You have items in your buyback list!");
            cm.dispose();
        }

        // They've never sold anything
        else
        {
            cm.sendOk("You've never sold a single item, you must be broke!");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status == 1)
    {

    }

    // After Advancing one further
    else if (status == 2)
    {

    }
}