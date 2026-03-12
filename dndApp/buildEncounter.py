import math
import random
from dndApp.models import Monster
from django.db.models import IntegerField
from django.db.models.functions import Cast
import json

def buildSimpleEncounter(playerNumber, partyLvl, scenarioDifficulty):

    #XP amounts per player for each difficulty
    highCurve = [75,150,225,375,750,900,1100,1400,1600,1900,2400,3000,3400,3800,4300,4800,5900,6300,7300,8500]
    medCurve = [50,100,150,250,500,600,750,900,1100,1200,1600,2000,2200,2500,2800,3200,4200,5200,5900,6700]
    lowCurve = [25,50,75,125,250,300,350,450,550,600,800,1000,1100,1250,1400,1600,2000,2100,2400,2800]

    if scenarioDifficulty == "Easy":
        scenXP = playerNumber * lowCurve[partyLvl-1]
    elif scenarioDifficulty == "Medium":
        scenXP = playerNumber * medCurve[partyLvl-1]
    elif scenarioDifficulty == "Hard":
        scenXP = playerNumber * highCurve[partyLvl-1] * 1.5
    else:
        scenXP = playerNumber * highCurve[partyLvl-1]

    scenXP = int(scenXP)

    currentXP = 0
    selected = []
#Adds one monster between 1/4 and 3/4 of the XP budget.
    Selection = (
        Monster.objects
        .annotate(xp_int=Cast('XP', IntegerField()))
        .filter(xp_int__isnull=False, xp_int__gt=int(scenXP * 0.25), xp_int__lt=int(scenXP * 0.75))
    )
    if Selection.exists():
        choice = random.randrange(Selection.count())
        m = Selection[choice]
        selected.append(m)
        currentXP += int(getattr(m, 'xp_int', 0) or 0)

#adds monsters until XP budget is full or slightly over
    while currentXP < scenXP:
        Selection = (
            Monster.objects
            .annotate(xp_int=Cast('XP', IntegerField()))
            .filter(xp_int__isnull=False, xp_int__lt=((scenXP - currentXP) * 1.25), xp_int__gt=int(scenXP * 0.1))
        )
        if not Selection.exists():
            break
        choice = random.randrange(Selection.count())
        m = Selection[choice]
        selected.append(m)
        currentXP += int(getattr(m, 'xp_int', 0) or 0)


    # build monster objects
    out = []
    for m in selected:
        xp_val = getattr(m, 'xp_int', None)
        if xp_val is None:
            try:
                xp_val = int(''.join(ch for ch in str(m.XP) if ch.isdigit()))
            except Exception:
                xp_val = None
        out.append({
            "id": m.id,
            "name": m.name,
            "HP": m.HP,
            "AC": m.AC,
            "CR": m.CR,
            "XP": xp_val,
            "speed": m.speed,
            "stats": m.stats,
            "skills": m.skills,
            "attributes": m.attributes,
            "actions": m.actions,
            "legendaryActions": m.legendaryActions,
            "rangedAttack": m.rangedAttack,
            "pack": m.pack,
        })

    return out


def buildAdvancedEncounter(playerNumber, partyLvl, scenarioDifficulty, monsterPacks, monsterAbundance, rangeMelee):
    pass
