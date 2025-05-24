// Author: Pepa

// AdventureMS Heracle
var status;
var createGuild = false;
var disbandGuild = false;
var increaseGuildCapacity = false;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

        // Start the conversation
        if (status == 0)
        {
            cm.sendSimple("What would you like to do?\r\n#b#L0#Create a Guild#l\r\n#L1#Disband your Guild#l\r\n#L2#Increase your Guild's capacity#l#k");
        }

        // They made a selection
        else if (status == 1)
        {
            // They want to create a guild
            if (selection == 0)
            {
                // Check if they are in a guild
                if (cm.getPlayer().getGuildId() > 0)
                {
                    cm.sendOk("You're already in one! Stay loyal or cut ties. Don't be so sneaky...");
                    cm.dispose();
                }

                // They aren't in one, ask to create
                else
                {
                    cm.sendYesNo("Creating a Guild costs #r1,500,000#k mesos, are you sure you want to continue?");
                    createGuild = true;
                }
            }

            // They chose to disband their guild
            else if (selection == 1)
            {
                // Check if they are in a guild and that t hey are the leader
                if (cm.getPlayer().getGuildId() < 1 || cm.getPlayer().getGuildRank() != 1)
                {
                    cm.sendOk("You must be in a guild and you must be the guild leader in order to do so. Talk to your leader...");
                    cm.dispose();
                }

                // They are in a guild and they are the leader
                else
                {
                    cm.sendYesNo("Are you sure you want to disband your Guild?\r\n\r\nAll your legacy will be lost and you will not be able to recover it.\r\n\r\nThis decision is final...");
                    disbandGuild = true;
                }
            }

            // They want to increase guild capacity
            else if (selection == 2)
            {
                // Check that they are in a guild and that they are the leader
                if (cm.getPlayer().getGuildId() < 1 || cm.getPlayer().getGuildRank() != 1)
                {
                    cm.sendOk("You can only increase your Guild's capacity if you are the leader.");
                    cm.dispose();
                }

                // They are in a guild and they are the leader
                else
                {
                    var Guild = Java.type("net.server.guild.Guild");  // thanks Conrad for noticing an issue due to call on a static method here
                    cm.sendYesNo("Increasing your Guild capacity by #r5#k costs #r " + Guild.getIncreaseGuildCost(cm.getPlayer().getGuild().getCapacity()) + " mesos#k, are you sure you want to continue?");
                    increaseGuildCapacity = true;
                }
            }

        }

        // They chose yes on something
        else if (status == 2)
        {
            // Create a guild
            if (createGuild && cm.getPlayer().getGuildId() <= 0)
            {
                cm.getPlayer().genericGuildMessage(1);
                cm.dispose();
            }

            // They chose yes to disbanding or to increasing capacity
            else if (cm.getPlayer().getGuildId() > 0 && cm.getPlayer().getGuildRank() == 1)
            {
                // Disband Guild
                if (disbandGuild)
                {
                    cm.getPlayer().disbandGuild();
                    cm.dispose();
                }

                // Increase guild capacity
                else if (increaseGuildCapacity)
                {
                    cm.getPlayer().increaseGuildCapacity();
                    cm.dispose();
                }
            }
        }
    }