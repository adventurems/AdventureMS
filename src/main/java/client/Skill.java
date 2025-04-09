/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
package client;

import provider.DataTool;
import server.StatEffect;
import server.life.Element;

import java.util.ArrayList;
import java.util.List;

public class Skill {
    private final int id;
    private final List<StatEffect> effects = new ArrayList<>();
    private Element element;
    private int animationTime;
    private final int job;
    private boolean action;

    public Skill(int id) {
        this.id = id;
        this.job = id / 10000;
    }

    public int getId() {
        return id;
    }

    public StatEffect getEffect(int level) {
        return effects.get(level - 1);
    }

    public int getMaxLevel() {
        return effects.size();
    }

    public boolean isFourthJob() {
        if (job == 2212) {
            return false;
        }
        if (id == 22170001 || id == 22171003 || id == 22171004 || id == 22181002 || id == 22181003) {
            return true;
        }
        return job % 10 == 2;
    }

    public void setElement(Element elem) {
        element = elem;
    }

    public Element getElement() {
        return element;
    }

    public int getAnimationTime() {
        return animationTime;
    }

    public void setAnimationTime(int time) {
        animationTime = time;
    }

    public void incAnimationTime(int time) {
        animationTime += time;
    }

    public boolean isBeginnerSkill() {
        return id % 10000000 < 10000;
    }

    public void setAction(boolean act) {
        action = act;
    }

    public boolean getAction() {
        return action;
    }

    public void addLevelEffect(StatEffect effect) {
        effects.add(effect);
    }

    public double getMastery(int skillLevel)
    {
        double mastery = 0.0;
        switch (id)
        {
            case 2101005:
            {
                switch (skillLevel)
                {
                    case 30: case 29: case 28: mastery = 0.6; break;
                    case 27: case 26: case 25: mastery = 0.54; break;
                    case 24: case 23: case 22: mastery = 0.48; break;
                    case 21: case 20: case 19: mastery = 0.42; break;
                    case 18: case 17: case 16: mastery = 0.36; break;
                    case 15: case 14: case 13: mastery = 0.3; break;
                    case 12: case 11: case 10: mastery = 0.24; break;
                    case 9: case 8: case 7: mastery = 0.18; break;
                    case 6: case 5: case 4: mastery = 0.12; break;
                    case 3: case 2: case 1: mastery = 0.06; break;
                }
            } break;
        }
        return mastery;
    }

    public int getSpellMAD(int skillLevel)
    {
        int spellMAD = 0;
        switch (id)
        {
            case 2101005:
            {
                switch (skillLevel)
                {
                    case 30: {spellMAD = 40;} break;
                    case 29: {spellMAD = 68;} break;
                    case 28: {spellMAD = 66;} break;
                    case 27: {spellMAD = 64;} break;
                    case 26: {spellMAD = 62;} break;
                    case 25: {spellMAD = 60;} break;
                    case 24: {spellMAD = 58;} break;
                    case 23: {spellMAD = 56;} break;
                    case 22: {spellMAD = 54;} break;
                    case 21: {spellMAD = 52;} break;
                    case 20: {spellMAD = 50;} break;
                    case 19: {spellMAD = 48;} break;
                    case 18: {spellMAD = 46;} break;
                    case 17: {spellMAD = 44;} break;
                    case 16: {spellMAD = 42;} break;
                    case 15: {spellMAD = 40;} break;
                    case 14: {spellMAD = 38;} break;
                    case 13: {spellMAD = 36;} break;
                    case 12: {spellMAD = 34;} break;
                    case 11: {spellMAD = 32;} break;
                    case 10: {spellMAD = 30;} break;
                    case 9: {spellMAD = 28;} break;
                    case 8: {spellMAD = 26;} break;
                    case 7: {spellMAD = 24;} break;
                    case 6: {spellMAD = 22;} break;
                    case 5: {spellMAD = 20;} break;
                    case 4: {spellMAD = 18;} break;
                    case 3: {spellMAD = 16;} break;
                    case 2: {spellMAD = 14;} break;
                    case 1: {spellMAD = 12;} break;
                } break;
            }
        }
        return spellMAD;
    }
}