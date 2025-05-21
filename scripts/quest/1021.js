// Standard Status Code
var status = -1;
function start() {status = -1; action(1,0,0);}
function end(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {qm.dispose();}

    // Start
    else if (status === 0)
    {
        qm.sendNext("Is this your first time? I can't remember now. I been teaching so many pets how to run fast. It's a bit too much.\r\n\r\n" +
        "#eKeep in mind, your lead pet is the one that will receive the speed boost!#n");
    }

    // After pressing yes/next
    else if (status === 1)
    {
        // Apply the pet speed attribute
        var pet = qm.getPlayer().getPet(0);
        if (pet != null)
        {
            pet.addPetAttribute(qm.getPlayer(), Packages.client.inventory.Pet.PetAttribute.OWNER_SPEED);
            qm.sendOk("Lemme have that egg, should make a pretty good dinner! Your pet is zoomin now!");
            qm.gainItem(4031284, -1);
            qm.dispose();
        }

        else
        {
            qm.sendNext("You need to have a pet equipped to receive this reward!");
            qm.dispose();
        }
    }
}
