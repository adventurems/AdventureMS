/*
This file is part of the OdinMS Maple Story Server
Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License version 3
as published by the Free Software Foundation. You may not use, modify
or distribute this program under any other version of the
GNU Affero General Public License.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package server.life;

public class OverrideMonsterStats {

    public int oHP, oMP, oEXP;

    // Default stats are set to provided monster stats
    public OverrideMonsterStats(MonsterStats stats)
    {
        this.oHP = stats.getHp();
        this.oMP = stats.getMp();
        this.oEXP = stats.getExp();
    }

    // Updates only HP / MP / EXP
    public void basicDifficultyUpdate(int difficulty)
    {
        oHP = oHP * difficulty;
        oMP = oMP * difficulty;
        oEXP = (int) (oEXP * (difficulty * .75));
    }

    // Public getter methods
    public int getoHP()     {return oHP;}
    public int getoMP()     {return oMP;}
    public int getoEXP()    {return oEXP;}

    // Public setter methods
    public void setoHP(int oHP)         {this.oHP = oHP;}
    public void setoMP(int oMP)         {this.oMP = oMP;}
    public void setoEXP(int oEXP)       {this.oEXP = oEXP;}
}
