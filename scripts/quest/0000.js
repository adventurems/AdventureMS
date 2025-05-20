// Standard Status Code
var status = -1;
function start() {status = -1; action(1,0,0);}
function end(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {qm.dispose();}

    // Start
    else if (status === 0)
    {

    }

    // After pressing yes/next
    else if (status === 1)
    {

    }

    // After Advancing one further
    else if (status === 2)
    {

    }
}