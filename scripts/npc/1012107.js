// AdventureMS Utah's First Test
var em = null;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    if (status == 0)
    {
        if (cm.getQuestStatus(1021) < 2)
        {
            // Set the Event
            em = cm.getEventManager("TheFarmEvent");

            // Error Checking
            if (em == null)
            {
                cm.sendOk("The Farm has encountered an error. Please report this in the bugs section of discord!");
                cm.dispose();
                return;
            }

            // Send first message
            cm.sendSimple("Hey #h #!\r\n\r\n My grandma and I think you are ready to get your first pet skill! I can teach your pet to be super fast my like hedgehog, Sonic." +
                "All you gotta do is bonk those chickens as fast as you can and get the #rgolden egg#k before time runs out. You think you can do that?\r\n\r\n" +
                "#L0#I'm ready to give it a go!#l\r\n#L1#Hmmm, not quite yet, I'll be back!#l");
        }

        // No active quests right now
        else
        {
            cm.sendOk("Doesn't seem like there is anything I can teach your right now! Get back out there and start training!");
            cm.dispose();
        }
    }

    // They made a choice
    else if (status == 1)
    {
        // They chose to start the test
        if (selection == 0)
        {
            if (cm.getParty() == null)
            {
                if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1))
                {
                    cm.sendOk("Someone else is already attempting the test on this channel, just a moment!");
                    cm.dispose();
                }
            }

            // They are in a party
            else
            {
                cm.sendOk("You must take on the test alone!");
                cm.dispose();
            }
        }

        // They chose not to attempt it
        else if (selection == 1)
        {
            cm.dispose();
        }
    }
}