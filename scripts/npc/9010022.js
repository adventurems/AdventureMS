// AdventureMS Omnar

var status;

// Start the conversation
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

        else if (status == 0)
        {
            // Check if they have a token
            if (cm.haveItem(3997006) || cm.haveItem(3997007) || cm.haveItem(3997008))
            {
                // Check if they've already turned in at least one token
                if (cm.getQuestStatus(1007) == 2 || cm.getQuestStatus(1008) == 2 || cm.getQuestStatus(1009) == 2)
                {
                    // They've turned in at least one token
                    cm.sendOk("Ah! Another one! Yes, it looks delicious. Quick throw it in!\r\n\r\n(Om nom nom 'crunch', 'munch'...)\r\n\r\nThat WAS delicious! I suppose I could open up another passage for you...");
                    cm.dispose();
                }

                // This is their first token to turn in
                else
                {
                    cm.sendOk("Ooooooo, a #rWarp Token#k!\r\n\r\nWell, that's what your lot call 'em anyway. Us wardens call 'em super-tasty, incredibly-delicious, interdimensional biscuits! #rS.T.I.D.I.B#k\r\n\r\nAnyway, here's how it works. You toss it in my mouth, yes, the portal is my mouth. I munch and crunch it up. Voila, you get a new fast warp! Throw it in there!\r\n\r\n(Om nom nom 'crunch', 'munch'...)\r\n\r\nDelicious! Just like that, you get a new warp! Thanks!");
                }
            }

            // Check that they've at least cleared zone 1
            else if (cm.getQuestStatus(1007) == 2 || cm.getQuestStatus(1008) == 2 || cm.getQuestStatus(1009) == 2)
            {
                // Create empty string to store locations available
                var selStr = "";

                // Kora Check
                if (cm.getQuestStatus(1007) == 2)
                {
                    selStr += "#0# Kora Garden";
                }

                // Kerning Check
                if (cm.getQuestStatus(1008) == 2)
                {
                    selStr += "#1# Kerning City";
                }

                // Check Quests, one by one
                if (cm.getQuestStatus(1009) == 2)
                {
                    selStr += "#2# Stoneweaver Village";
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