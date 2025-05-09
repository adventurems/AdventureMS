// AdventureMS - The Peak Agility Test

var baseid = 101040002;
var dungeonid = 260020100;
var dungeons = 3;

function enter(pi)
{
    // Check if we are in Stoneweaver Village
    if (pi.getMapId() == baseid)
    {
        // Make sure they are not in a party
        if (pi.getParty() != null)
        {
            pi.playerMessage(5, "It's too hot to take others along! You must leave your party.");
            return false;
        }
        else
        {
            // Loop through and find an open dungeon
            for (var i = 0; i < dungeons; i++)
            {
                // Look for an open map
                if(pi.startDungeonInstance(dungeonid + i))
                {
                    // Cancel Buffs
                    pi.getPlayer().cancelAllBuffs(false);

                    // Get Disease enum
                    var Disease = Java.type('client.Disease');

                    // Clear any existing debuffs on the player
                    pi.getPlayer().dispelDebuffs();

                    // Get the disease for SEAL using the Disease enum
                    var sealDisease = Disease.getBySkill(Disease.SEAL.getMobSkillType());  // Correctly accessing the MobSkillType from Disease

                    // If a valid disease exists for SEAL
                    if (sealDisease != null) {
                        // Get the corresponding MobSkill for SEAL at level 1 using the new method
                        var sealMobSkill = pi.getMobSkillByType(sealDisease.getMobSkillType(), 1);

                        // Apply the SEAL debuff to the player using Disease (not MobSkillType)
                        pi.getPlayer().giveDebuff(sealDisease, sealMobSkill); // Pass Disease (not MobSkillType) to giveDebuff
                    }

                    // Warp the player
                    pi.playPortalSound();
                    pi.warp(dungeonid + i, "west00");
                    return true;
                }
            }

            // No open maps, tell the player it's occupied
            pi.playerMessage(5, "All instances of the test are occupied, wait just a few moments and try again!");
            return false;
        }
    }
    else
    {
        // Check if it's the east portal
        if (pi.getPlayer().getMap().findClosestPortal(pi.getPlayer().getPosition()).getName() == "east00")
        {
            // Gain key if they don't have it
            if (!pi.haveItem(3997003)) {pi.gainItem(3997003, 1);}

            // Warp
            pi.getPlayer().dispelDebuffs();
            pi.playPortalSound();
            pi.warp(101030100, "cross00");
            return true;
        }
        // Anything else, send back to Stoneweaver village
        else
        {
            // Warp
            pi.getPlayer().dispelDebuffs();
            pi.playPortalSound();
            pi.warp(baseid, "east00");
            return true;
        }
    }
}