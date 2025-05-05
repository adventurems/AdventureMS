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
    
    public int oHP, oMP, oEXP, oPAD, oMAD, oPDD, oMDD, oLEVEL;

    // Default stats are set to provided monster stats
    public OverrideMonsterStats(MonsterStats stats)
    {
        this.oHP = stats.getHp();
        this.oMP = stats.getMp();
        this.oEXP = stats.getExp();
        this.oPAD = stats.getPADamage();
        this.oMAD = stats.getMADamage();
        this.oPDD = stats.getPDDamage();
        this.oMDD = stats.getMDDamage();
        this.oLEVEL = stats.getLevel();
    }

    // Updates only HP / MP / EXP
    public void basicDifficultyUpdate(int difficulty)
    {
        oHP = oHP * difficulty;
        oMP = oMP * difficulty;
        oEXP = (int) (oEXP * .8);
    }

    // Public getter methods
    public int getoHP()     {return oHP;}
    public int getoMP()     {return oMP;}
    public int getoEXP()    {return oEXP;}
    public int getoPAD()    {return oPAD;}
    public int getoMAD()    {return oMAD;}
    public int getoPDD()    {return oPDD;}
    public int getoMDD()    {return oMDD;}
    public int getoLEVEL()  {return oLEVEL;}

    // Public setter methods
    public void setoHP(int oHP)         {this.oHP = oHP;}
    public void setoMP(int oMP)         {this.oMP = oMP;}
    public void setoEXP(int oEXP)       {this.oEXP = oEXP;}
    public void setoPAD(int oPAD)       {this.oPAD = oPAD;}
    public void setoMAD(int oMAD)       {this.oMAD = oMAD;}
    public void setoPDD(int oPDD)       {this.oPDD = oPDD;}
    public void setoMDD(int oMDD)       {this.oMDD = oMDD;}
    public void setoLEVEL(int oLEVEL)   {this.oLEVEL = oLEVEL;}
}