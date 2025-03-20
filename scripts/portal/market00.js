// Author - Pepa

function enter(pi)
{
    // Store the target map
    var toMap = pi.getPlayer().getSavedLocation("FREE_MARKET");

    // Make sure it's not empty
    if (toMap === -1)
    {
       pi.playerMessage(5, "You do not have a stored map to return to... Press the home button from another map.");
       return false;
    }

    // They have a valid map
    else
    {
        pi.playPortalSound();
        pi.warp(toMap, "out00");
        return true;
    }
}