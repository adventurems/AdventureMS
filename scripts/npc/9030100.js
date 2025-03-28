// AdventureMS Storage System

// On click
// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        cm.sendSimple("#L0#Normal Storage#l\r\n#L1#Cash Storage#l");
    }

    else if (status == 1)
    {
        switch (selection)
        {
            // They chose normal storage
            case 0:
            cm.getPlayer().getStorage().sendStorage(cm.getClient(), 9030100);
            cm.dispose();
            break;

            // They chose cash storage
            case 1:
            cm.getPlayer().getStorage().sendStorage(cm.getClient(), 9030101);
            cm.dispose();
            break;
        }
    }