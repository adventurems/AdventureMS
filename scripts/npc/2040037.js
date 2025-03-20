
/*
@	Author : Raz
@       Author : Ronan
@
@	NPC = Orange Balloon
@	Map = Hidden-Street <Stage 2>
@	NPC MapId = 922010200
@	Function = LPQ - 2nd Stage
@
*/

/*
// Standard

var status = 0;
var curMap, stage;

function start() {
    curMap = cm.getMapId();
    stage = Math.floor((curMap - 922010100) / 100) + 1;
    
    status = -1;
    action(1, 0, 0);
}

function clearStage(stage, eim, curMap) {
    eim.setProperty(stage + "stageclear", "true");
    eim.showClearEffect(true);
    
    eim.linkToNextStage(stage, "lpq", curMap);  //opens the portal to the next map
}

function action(mode, type, selection) {
            if (mode == -1) {
            cm.dispose();
        } else if (mode == 0){
            cm.dispose();
        } else {
                if (mode == 1)
                        status++;
                else
                        status--;
                    
                var eim = cm.getPlayer().getEventInstance();
                
                if(eim.getProperty(stage.toString() + "stageclear") != null) {
                        cm.sendNext("Hurry, goto the next stage, the portal is open!");
                }
                else {
                        if (eim.isEventLeader(cm.getPlayer())) {
                                var state = eim.getIntProperty("statusStg" + stage);

                                if(state == -1) {           // preamble
                                        cm.sendOk("Hi. Welcome to the #bstage " + stage + "#k. Collect 15 #t4001022#'s scattered across the map, then talk to me.");
                                        eim.setProperty("statusStg" + stage, 0);
                                }
                                else {       // check stage completion
                                        if (cm.haveItem(4001022, 15)) {
                                                cm.sendOk("Good job! You have collected all 15 #b#t4001022#'s.#k");
                                                cm.gainItem(4001022, -15);

                                                eim.setProperty("statusStg" + stage, 1);
                                                clearStage(stage, eim, curMap);
                                        } else {
                                                cm.sendNext("Sorry you don't have all 15 #b#t4001022#'s.#k");
                                        }
                                }
                        } else {
                                cm.sendNext("Please tell your #bParty-Leader#k to come talk to me.");
                        }
                }
                
                cm.dispose();
        }
}*/

// AdventureMS - Orange Balloon
function start()
{
	cm.sendOk("Oh wow, you found me!"); // Send Message
	if (!cm.haveItem(3996011)) { cm.gainItem(3996011, 1); } // Gain Balloon
	cm.dispose();
}