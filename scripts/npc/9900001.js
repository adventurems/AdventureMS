// AdventureMS Lime Balloon NPC Helper

function start() {
    if (cm.getPlayer().gmLevel() > 1) {
        cm.sendYesNo("Do you want to level up?");
    } else {
        cm.sendOk("Hey wassup?");
    }
}

function action(i, am, pro) {
    if (i > 0 && cm.getPlayer().gmLevel() > 1) {
        cm.getPlayer().levelUp(true);
    }
    cm.dispose();
}