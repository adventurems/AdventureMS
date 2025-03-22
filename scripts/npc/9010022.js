// AdventureMS Gatekeeper Omnar

var status;

// Start the conversation
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

        else if (status == 0)
        {
            // Create empty string to store locations available
            var selStr = "";

            // Check that they've at least cleared zone 1
            if (cm.getZoneProgress() > 0)
            {
                // Get ZoneProgress and create the available warps
                switch (cm.getZoneProgress())
                {
                    case 3:
                        selStr += "#0# Kora Garden";
                        selStr += "#1# Kerning City";
                        selStr += "#2# Stoneweaver Village";
                        break;

                    case 2:
                        selStr += "#0# Kora Garden";
                        selStr += "#1# Kerning City";;
                        break;

                    case 1:
                        selStr += "#0# Kora Garden";;
                        break;
                }

                // Send the completed string for the dimensional mirror to handle
                cm.sendDimensionalMirror(selStr);
            }

            // They haven't cleared zone 1
            else
            {
                cm.sendOk("You've not unlocked any warps! Get after it!");
                cm.dispose();
            }
        }

        // They've chosen a map to warp to
        else if (status == 1)
        {
            switch (selection)
            {
                case 2:
                    cm.warp(101040002, 0);
                    break;
                case 1:
                    cm.warp(103000000, 0);
                    break;
                case 0:
                    cm.warp(104040000, 0);
                    break;
            }

            // Kill the convo
            cm.dispose();
        }
    }