// AdventureMS Credits

var status;

// All servers in a single string
var servers = "Cosmic, HeavenMS, MapleSolaxia, MoopleDEV, BubblesDEV, MetroMS, OdinMS";

// Major helpers
var majorHelpers = [
    "Crabo",
    "Teto",
    "Chronos",
    "Lily",
    "Davi",
    "Gwen"
];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            var sendStr = "Here are all the servers:\r\n\r\n";
            sendStr += "#b" + servers + "#k\r\n\r\n";
            sendStr += "Would you like to see the major helpers? #L0#Yes#l";

            cm.sendSimple(sendStr);
        } else if (status == 1) {
            var sendStr = "Major Helpers:\r\n\r\n";

            for (var i = 0; i < majorHelpers.length; i++) {
                sendStr += "  #L" + i + "# " + majorHelpers[i] + "#l\r\n";
            }

            cm.sendPrev(sendStr);
        } else {
            cm.dispose();
        }
    }
}
