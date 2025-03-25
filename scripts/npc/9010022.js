// AdventureMS Omnar

var status;
var tokens = [4007015, 4007016, 4007017];
var quests = [1007, 1008, 1009];
var mesoCost = [0, 10000, 25000];
var questCounter = 0;
var tokenTurnIn = false;
var hasQuest = false;

// Start the conversation
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    else if (status == 0)
    {
        // Loop through tokens array
        for (var i = 0; i < tokens.length; i++)
        {
            // If we have a token in our possession, stop
            if (cm.haveItem(tokens[i]) && !tokenTurnIn)
            {
                // Loop through the quest array
                for (var j = 0; j < quests.length; j++)
                {
                    // If we have completed any quest, it's our 2nd time back
                    if (cm.getQuestStatus(quests[j]) == 2)
                    {
                        // Remove the item
                        cm.gainItem(tokens[i], -1);

                        // Complete the quest
                        cm.completeQuest(quests[i]);

                        // Mark this done so it can only execute once
                        tokenTurnIn = true;

                        // They've turned in at least one token
                        cm.sendOk("Ah! Another one! Yes, it looks delicious. Quick throw it in!\r\n\r\n(Om nom nom 'crunch', 'munch'...)\r\n\r\nThat WAS delicious! I suppose I could open up another passage for you...");
                        cm.dispose();
                        return;  // Exit the function immediately after disposing to prevent further logic
                    }
                }

                // Check if it's our first time here
                if (j >= quests.length)
                {
                    // Remove the item
                    cm.gainItem(tokens[i], -1);

                    // Complete the quest
                    cm.completeQuest(quests[i]);

                    // It's our first time here
                    cm.sendOk("Ooooooo, a #rWarp Token#k!\r\n\r\nWell, that's what your lot call 'em anyway. Us wardens call 'em super-tasty, incredibly-delicious, interdimensional biscuits! #r#eS.T.I.D.I.B#n#k's\r\n\r\nAnyway, here's how it works. You toss it in my mouth, yes, the portal is my mouth. I munch and crunch it up. Voila, you get a new fast warp!\r\n\r\nOh yeah, #e#rit costs mesos to warp#k#n! The cost goes up as you unlock more warps!\r\n\r\nThrow it in there! (Om nom nom 'crunch', 'munch'...)\r\n\r\nDelicious! Just like that, you get a new warp! Thanks!");
                    cm.dispose();
                    return;  // Exit here too to prevent further code execution
                }
            }
        }

        // We did not have a token
        if (i >= tokens.length)
        {
            // If we have completed any quest, open the warper
            for (var j = 0; j < quests.length; j++)
            {
                // If we have completed any quest, open the warper
                if (cm.getQuestStatus(quests[j]) == 2)
                {
                    // Set hasQuest to true
                    hasQuest = true;

                    // Create empty string to store locations available
                    var selStr = "";

                    // Kora Check
                    if (cm.getQuestStatus(1007) == 2)
                    {
                        selStr += "#0# Kora Garden";
                        questCounter++;
                    }

                    // Kerning Check
                    if (cm.getQuestStatus(1008) == 2)
                    {
                        selStr += "#1# Kerning City";
                        questCounter++;
                    }

                    // Check Quests, one by one
                    if (cm.getQuestStatus(1009) == 2)
                    {
                        selStr += "#2# Stoneweaver Village";
                        questCounter++;
                    }

                    // Ensure they can pay the fee
                    if (cm.getMeso() > mesoCost[questCounter])
                    {
                        // Send the completed string for the dimensional mirror to handle
                        cm.sendDimensionalMirror(selStr);
                        break;
                    }

                    // They can't afford the fee
                    else
                    {
                        // Send insufficient funds
                        cm.sendOk("Doesn't look like you can afford the fee... Go farm!");
                        cm.dispose();
                        return;
                    }
                }
            }

            // They have no tokens, and they haven't completed any quests
             if (!tokenTurnIn && !hasQuest)
            {
                cm.sendOk("Go find me some of those tasty #r#eS.T.I.D.I.B#n#k's!");
                cm.dispose();
            }
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

        // Pay the fee
        cm.gainMeso(-mesoCost[questCounter]);

        // Kill the convo
        cm.dispose();
    }
}