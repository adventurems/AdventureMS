// Standard Status Code
function start() {status = -1; action(1,0,0);}
function end(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {qm.dispose();}

    // Start
    else if (status === 0)
    {
        qm.sendNext("Do you have the heart? I can take it from there.");
    }

    // After pressing yes/next
    else if (status === 1)
    {
        // Heart check
        if (qm.haveItem(4007030))
        {
            qm.sendNext("The heart! You have it. Let me see it, quick!\\n\\n(#bMoki#k holds it against the black heart, pulls back his arm, hammer in hand and gently taps the heart with his eyes closed. He and the heart begin to glow. Nothing happens, but then... you hear a feint noise...)\\n\\n(It starts slow and quiet................ thump............... thump........... thump...... thump.. thump)\\n\\n(It builds up and the room begins to swirl! The heart breaks free from it's black casing. The glass shards shatter all around you. As you open your eyes, you are greeted with a beautiful blue shine. The heart lives on and the #Manaforge#k lives once more!!!)");
        }

        else
        {
            qm.sendOk("You don't have the heart yet, we don't have much time left.")
            qm.dispose();
        }
    }

    // After Advancing one further
    else if (status === 2)
    {
        qm.warp(106010116, "in00");
        qm.sendOk("You did it! You solved the mysteries of the ruins. You crafted the #rHeart of the Forge#k, proved your worth as an aspiring forge master and conquered #bZone 4#k!");
        qm.dispose();
    }
}