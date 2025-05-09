// Author: Pepa
// AdventureMS - Vault Chest

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // First prompt when clicking the NPC
    else if (status == 0)
    {
        // Check if they got back in somehow
        if (cm.getZoneProgress >= 3)
        {
            cm.sendOk("You aren't supposed to be here!");
            cm.warp(100000203, 0);
            cm.getPlayer().setSavedLocation("FREE_MARKET", 198000000); // Update saved location
            cm.dispose();
        }

        else
        {
            // Find job ID and return string
            switch (cm.getJobId())
            {
                // Warrior Prompt
                case 100:
                {
                    cm.sendSimple("(you unlock the chest with the Vault Key, reach inside, and find...)" +
                        "\r\n\r\n#rA choice of one of the following:#k" +
                        "\r\n#L1##v1302004# #t1302004##l\r\n#L2##v1402006# #t1402006##l\r\n#L3##v1322008# #t1322008##l\r\n#L4##v1422004# #t1422004##l\r\n#L5##v1432016# #t1432016##l" +
                        "\r\n\r\n\r\n#rAdditionally, you find:#k" +
                        "\r\n\r\n#v4031012# #t4031012#" +
                        "\r\n#v1122900# #t1122900#" +
                        "\r\n#v1142201# #t1142201#" +
                        "\r\n#v5200002# 500,000 Mesos" +
                        "\r\n#v4310000# #t4310000# x 20");
                    break;
                }

                // Mage Prompt
                case 200:
                {
                    // Rewards / Actions
                    if (cm.canHoldAll([4031012, 1372001, 1122900, 4310000, 1142201]))
                    {
                        cm.gainItem(3997002, -1); // Remove the Black Key
                        cm.gainItem(3997003, -1); // Remove the Mountain Pass Key
                        cm.gainItem(4031012, 1); // Gain Proof of a Hero
                        cm.gainItem(1372001, 1); // Gain Weapon
                        cm.gainItem(1122900, 1); // Gain Black Pendant
                        cm.gainItem(1142201, 1); // Gain Medal
                        cm.gainItem(4310000, 20); // Gain Ancient Coins
                        cm.gainMeso(500000); // Gain Mesos
                        cm.getPlayer().updateZoneProgress(); // Update Zone Progress
                        cm.completeQuest(1005); // Make sure the Adonis Quest is closed
                        cm.warp(100000203, 0); // Warp to Home
                        cm.getPlayer().setSavedLocation("FREE_MARKET", 198000000); // Update saved location
                        cm.sendOk("(as you turn the key, the chest whisks you back home...but not without your plunder...)" +
                            "\r\n\r\n#eYou have completed #bZone 3#k!#n Use your #rProof of a Hero#k to job advance and unlock #bZone 4#k!" +
                            "\r\n\r\n#v4031012# #t4031012#" +
                            "\r\n#v1372001# #t1372001#" +
                            "\r\n#v1122900# #t1122900#" +
                            "\r\n#v1142201# #t1142201#" +
                            "\r\n#v5200002# 500,000 Mesos" +
                            "\r\n#v4310000# #t4310000# x 20");
                        cm.dispose();
                    }

                    // Not enough room for rewards, send exit message
                    else
                    {
                        cm.sendOk("You don't have enough space to hold your rewards!\r\n\r\nYou need 3 EQUIP slots, 1 ETC slot and must either already have Ancient coins, or have 1 slot available for them.");
                        cm.dispose();
                    }
                    break;
                }

                // Archer Prompt
                case 300:
                {
                    cm.sendSimple("(you unlock the chest with the Vault Key, reach inside, and find...)" +
                        "\r\n\r\n#rA choice of one of the following:#k" +
                        "\r\n#L1##v1452006# #t1452006##l\r\n#L2##v1462005# #t1462005##l" +
                        "\r\n\r\n\r\n#rAdditionally, you find:#k" +
                        "\r\n\r\n#v4031012# #t4031012#" +
                        "\r\n#v1122900# #t1122900#" +
                        "\r\n#v1142201# #t1142201#" +
                        "\r\n#v5200002# 500,000 Mesos" +
                        "\r\n#v4310000# #t4310000# x 20");
                    break;
                }

                // Thief Prompt
                case 400:
                {
                    cm.sendSimple("(you unlock the chest with the Vault Key, reach inside, and find...)" +
                        "\r\n\r\n#rA choice of one of the following:#k" +
                        "\r\n#L1##v1472013# #t1472013##l\r\n#L2##v1332020# #t1332020##l" +
                        "\r\n\r\n\r\n#rAdditionally, you find:#k" +
                        "\r\n\r\n#v4031012# #t4031012#" +
                        "\r\n#v1122900# #t1122900#" +
                        "\r\n#v1142201# #t1142201#" +
                        "\r\n#v5200002# 500,000 Mesos" +
                        "\r\n#v4310000# #t4310000# x 20");
                    break;
                }

                // Pirate Prompt
                case 500:
                {
                    cm.sendSimple("(you unlock the chest with the Vault Key, reach inside, and find...)" +
                        "\r\n\r\n#rA choice of one of the following:#k" +
                        "\r\n#L1##v1492005# #t1492005##l\r\n#L2##v1482005# #t1482005##l" +
                        "\r\n\r\n\r\n#rAdditionally, you find:#k" +
                        "\r\n\r\n#v4031012# #t4031012#" +
                        "\r\n#v1122900# #t1122900#" +
                        "\r\n#v1142201# #t1142201#" +
                        "\r\n#v5200002# 500,000 Mesos" +
                        "\r\n#v4310000# #t4310000# x 20");
                    break;
                }

                // Aran Prompt
                case 2100:
                {
                    // Rewards / Actions
                    if (cm.canHoldAll([4031012, 1442050, 1122900, 4310000, 1142201]))
                    {
                        cm.gainItem(3997002, -1); // Remove the Black Key
                        cm.gainItem(3997003, -1); // Remove the Mountain Pass Key
                        cm.gainItem(4031012, 1); // Gain Proof of a Hero
                        cm.gainItem(1442050, 1); // Gain Weapon
                        cm.gainItem(1122900, 1); // Gain Black Pendant
                        cm.gainItem(1142201, 1); // Gain Medal
                        cm.gainItem(4310000, 20); // Gain Ancient Coins
                        cm.gainMeso(500000); // Gain Mesos
                        cm.getPlayer().updateZoneProgress(); // Update Zone Progress
                        cm.completeQuest(1005); // Make sure the Adonis Quest is closed
                        cm.warp(100000203, 0); // Warp to Home
                        cm.getPlayer().setSavedLocation("FREE_MARKET", 198000000); // Update saved location
                        cm.sendOk("(as you turn the key, the chest whisks you back home...but not without your plunder...)" +
                            "\r\n\r\n#eYou have completed #bZone 3#k!#n Use your #rProof of a Hero#k to job advance and unlock #bZone 4#k!" +
                            "\r\n\r\n#v4031012# #t4031012#" +
                            "\r\n#v1442050# #t1442050#" +
                            "\r\n#v1122900# #t1122900#" +
                            "\r\n#v1142201# #t1142201#" +
                            "\r\n#v5200002# 500,000 Mesos" +
                            "\r\n#v4310000# #t4310000# x 20");
                        cm.dispose();
                    }

                    // Not enough room for rewards, send exit message
                    else
                    {
                        cm.sendOk("You don't have enough space to hold your rewards!\r\n\r\nYou need 3 EQUIP slots, 1 ETC slot and must either already have Ancient coins, or have 1 slot available for them.");
                        cm.dispose();
                    }
                    break;
                }

                default: break;
            }
        }
    }

    // They've either chosen a weapon or advanced the prompt
    else
    {
        // Declare local var for Weapon
        var weapon;

        // Find the Job and return the appropriate reward based on selection
        switch (cm.getJobId())
        {
            // Warrior Rewards
            case 100:
            {
                // Cutlass
                if (selection == 1)
                {
                    weapon = 1302004;

                // Lionheart
                } else if (selection == 2)
                {
                    weapon = 1402006;

                // Hard Briefcase
                } else if (selection == 3)
                {
                    weapon = 1322008;

                // Monkey Wrench
                } else if (selection == 4)
                {
                    weapon = 1422004;

                // Orange Ski
                } else if (selection == 5)
                {
                    weapon = 1432016;
                }

                break;
            }

            // Archer Rewards
            case 300:
            {
                // Red Viper
                if (selection == 1)
                {
                    weapon = 1452006;

                // Heckler
                } else if (selection == 2)
                {
                    weapon = 1462005;
                }

                break;
            }

            // Thief Rewards
            case 400:
            {
                // Dark Guardian
                if (selection == 1)
                {
                    weapon = 1472013;

                // Korean Dagger
                } else if (selection == 2)
                {
                    weapon = 1332020;
                }

                break;
            }

            // Pirate Rewards
            case 500:
            {
                // Shooting Star
                if (selection == 1)
                {
                    weapon = 1492005;

                // Silver Maiden
                } else if (selection == 2)
                {
                    weapon = 1482005;
                }

                break;
            }

            // Not one of the 6 classes?
            default: break;
        }

        // Rewards / Actions
        if (cm.canHoldAll([4031012, weapon, 1122900, 4310000, 1142201]))
        {
            cm.gainItem(3997002, -1); // Remove the Black Key
            cm.gainItem(3997003, -1); // Remove the Mountain Pass Key
            cm.gainItem(4031012, 1); // Gain Proof of a Hero
            cm.gainItem(weapon, 1); // Gain Weapon
            cm.gainItem(1122900, 1); // Gain Black Pendant
            cm.gainItem(1142201, 1); // Gain Medal
            cm.gainItem(4310000, 20); // Gain Ancient Coins
            cm.gainMeso(500000); // Gain Mesos
            cm.getPlayer().updateZoneProgress(); // Update Zone Progress
            cm.completeQuest(1005); // Make sure the Adonis Quest is closed
            cm.warp(100000203, 0); // Warp to Home
            cm.getPlayer().setSavedLocation("FREE_MARKET", 198000000); // Update saved location
            cm.sendOk("After choosing your reward, the chest whisks you back home!\r\n\r\n#eYou have completed #bZone 3#k!#n\r\n\r\nUse your #rProof of a Hero#k to job advance and unlock #bZone 4#k!");
            cm.dispose();
        }

        // Not enough room for rewards, send exit message
        else
        {
            cm.sendOk("You don't have enough space to hold your rewards!\r\n\r\nYou need 3 EQUIP slots, 1 ETC slot and must either already have Ancient coins, or have 1 slot available for them.");
            cm.dispose();
        }
    }
}