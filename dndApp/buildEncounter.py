import math
import random
from dndApp.models import Monster
from django.db.models import IntegerField
from django.db.models.functions import Cast
import json

playerNumber = 5
partyLvl = 5
scenarioDifficulty = "Medium"
monsterPacks = ["goblinPack", "orcPack", "trollPack"]
monsterAbundance = 6
rangeMelee = 6

def buildSimpleEncounter(playerNumber, partyLvl, scenarioDifficulty):

    highCurve = [100,200,400,500,1100,1400,1700,2100,2600,3100,4100,4700,5400,6200,7800,9800,11700,14200,17200,22000]
    medCurve = [75,150,225,375,750,1000,1300,1700,2000,2300,2900,3700,4200,4900,5400,6100,7200,8700,10700,13200]
    lowCurve = [50,100,150,250,500,600,750,1000,1300,1600,1900,2200,2600,2900,3300,3800,4500,5000,5500,6400]

    if scenarioDifficulty == "Easy":
        scenXP = playerNumber * lowCurve[partyLvl-1]
    elif scenarioDifficulty == "Medium":
        scenXP = playerNumber * medCurve[partyLvl-1]
    elif scenarioDifficulty == "Lethal":
        scenXP = playerNumber * highCurve[partyLvl-1] * 1.5
    else:
        scenXP = playerNumber * highCurve[partyLvl-1]

    scenXP = int(scenXP)

    currentXP = 0
    selected = []

    Selection = (
        Monster.objects
        .annotate(xp_int=Cast('XP', IntegerField()))
        .filter(xp_int__isnull=False, xp_int__gt=int(scenXP * 0.25), xp_int__lt=int(scenXP * 0.75))
    )
    if Selection.exists():
        idx = random.randrange(Selection.count())
        m = Selection[idx]
        selected.append(m)
        currentXP += int(getattr(m, 'xp_int', 0) or 0)

    while currentXP < scenXP:
        Selection = (
            Monster.objects
            .annotate(xp_int=Cast('XP', IntegerField()))
            .filter(xp_int__isnull=False, xp_int__lt=scenXP, xp_int__gt=int(scenXP * 0.1))
        )
        if not Selection.exists():
            break
        idx = random.randrange(Selection.count())
        m = Selection[idx]
        selected.append(m)
        currentXP += int(getattr(m, 'xp_int', 0) or 0)

    # build serializable dicts
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
