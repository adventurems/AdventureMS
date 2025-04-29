// AdventureMS The Farm

var baseid = 106010117;
var dungeonid = 100000007;
var dungeons = 3;

function enter(pi) {
    // Check if we are on the correct map
    if (pi.getMapId() == baseid) {
        // Make sure the player has the key to the sewers
        if (pi.getPlayer().getQuestStatus(1021) < 2) {
            // Ensure the player is alone
            if (pi.getParty() != null) {
                pi.playerMessage(5, "You may only challenge the test alone!");
                return false;
            }
            // They've passed all checks and they are ready to enter
            else {
                // Loop through and find an open room
                for (var i = 0; i < dungeons; i++) {
                    // If open, start the event
                    if(pi.startDungeonInstance(dungeonid + i)) {
                        // Start the event
                        var em = pi.getEventManager("TheFarmEvent");
                        if (em == null) {
                            pi.playerMessage(5, "The event could not be started. Please contact an administrator.");
                            return false;
                        }

                        var eim = em.getInstance("TheFarm" + i);
                        if (eim == null) {
                            eim = em.startInstance(pi.getPlayer());
                        }

                        pi.playPortalSound();
                        return true;
                    }
                }

                // All maps are taken
                pi.playerMessage(5, "All instances of the test are occupied, wait a few moments and try again.");
                return false;
            }
        }
        // They don't have the keys to the sewer
        else {
            pi.playerMessage(5, "You've already completed Utah's chicken chores!")
            return false;
        }
    }
    // Leaving the dungeon
    else {
        var map = pi.getMapId();
        pi.resetMapObjects(map);
        pi.getMap().clearDrops();
        pi.playPortalSound();
        pi.warp(baseid, "MD00");
        return true;
    }
}