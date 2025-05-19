// AdventureMS - Ancient Domains

function enter(pi)
{
    var curMap = pi.getPlayer().getMap().getId();

    if (pi.getPlayer().checkQuestGear(1032))
    {
        if (curMap === 106010105)
        {
            pi.warp(106010121, "out00");
        }

        else
        {
            pi.warp(106010122, "out00");
        }
    }

    else
    {
        if (curMap === 106010105)
        {
            pi.warp(106010103, "out00");
        }

        else
        {
            pi.warp(106010104, "out00");
        }
    }

    pi.playPortalSound();
    return true;
}