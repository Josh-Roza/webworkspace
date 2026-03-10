import re
import os
import sys
from pathlib import Path
import textwrap

textWidth = 40

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoproject.settings")

try:
    import django
    django.setup()
except Exception:
    # If Django is already set up (e.g., running via manage.py shell), ignore.
    pass

from dndApp.models import Monster

try:
    _SCRIPT_DIR = Path(__file__).resolve().parent
except NameError:
    # When executed via `exec(open(...).read())` (e.g., inside `manage.py shell`),
    # `__file__` is not defined. Fall back to the current working directory.
    cwd = Path.cwd()
    _SCRIPT_DIR = cwd / "dndApp" if (cwd / "dndApp").is_dir() else cwd

MONSTERS_TXT_PATH = _SCRIPT_DIR / "monstersTest.txt"

with MONSTERS_TXT_PATH.open("r", encoding="utf-8") as monsters:
    lines = monsters.readlines()
    newMonsters = []
    i = 0

    while 1 > 0:
        name = ""
        HP = ""
        AC = ""
        speed = ""
        CR = ""
        XP = ""
        pack = ""
        statsList = []
        stats = ""
        skills = ""
        attributes= ""
        actions = ""
        legendaryActions = ""
        rangedAttack = False

        name = lines[i].strip()
        pack = lines[i+1].strip()

        while lines[i].strip().split()[0] != "Armor":
            i += 1
        AC = lines[i].split()[2]

        while lines[i].split()[0] != "Hit":
            i += 1
        HP = lines[i].split()[2]

        i += 1
        if lines[i].split()[0] == "Speed":
            speed = lines[i]

    #adds all of the stats to an array
        i += 1
        if lines[i].split()[0] == "STR":
            statsList = []
            for j in range(6):
                i += 1
                statsList.append(lines[i].split()[0])
        stats = f'STR: {statsList[0]}, DEX: {statsList[1]}, CON: {statsList[2]}, INT: {statsList[3]}, WIX: {statsList[4]}, CHA: {statsList[5]}'
        i += 1

    #adds all the lines in the skills category into an array
        skills = ""
        while lines[i].split()[0] != "Challenge":
            skills += lines[i]
            i += 1
        
        if lines[i].split()[0] == "Challenge":
            CR = lines[i].split()[1]
            XP = ''.join(n for n in lines[i].split()[2] if n.isdigit())
        i += 1

    #Adds all the lines from the attributes category into an array
        attributes = ""
        while lines[i].strip() != "Actions":
            if lines[i].strip() != "":
                attributes += lines[i] + "\n"
            i += 1
        i += 1
        attributes = textwrap.fill(attributes, width = textWidth)

        actions = ""
        while lines[i].strip() != "Legendary actions" and not(lines[i].strip() == "" and i+1 < len(lines) and lines[i+1].strip() == ""):
            if lines[i].strip() != "":
                actions += lines[i]
            i += 1
        actions = textwrap.fill(actions, width = textWidth)

        legendaryActions = ""
        if i < len(lines) and lines[i].strip() == "Legendary actions":
            while i < len(lines) and not(lines[i].strip() == "" and i+1 < len(lines) and lines[i+1].strip() == ""):
                if lines[i].strip() != "":
                    legendaryActions += lines[i]
                i += 1
        legendaryActions = textwrap.fill(legendaryActions, width = textWidth)
        
        if re.search("range", actions) or re.search("range", legendaryActions):
            rangedAttack = True
        if re.search("within.*feet", actions) or re.search("within.*feet", actions):
            actionsList = (actions + legendaryActions).strip().split()
            n = 0
            while actionsList[n] != "within":
                n += 1
            n += 1
            if actionsList[n].isdigit():
                if int(actionsList[n]) > 25:
                    rangedAttack = True
                

        #newMonster = [name, pack, HP, AC, CR, rangedAttack, speed, stats, skills, attributes, actions]
        #if legendaryActions != "":
        #    newMonster.append(legendaryActions)
        #newMonsters.append(newMonster)

        
        Monster.objects.create(name = name, HP = int(HP), AC = int(AC), CR = CR, XP = XP,   speed = speed, stats = stats, skills = skills, attributes = attributes, actions = actions, legendaryActions = legendaryActions, rangedAttack = rangedAttack, pack = pack)

        print(f'name: {name}')
        print(f'HP: {HP}')
        print(f'AC: {AC}')
        print(f'CR {CR}')
        print(f'XP: {XP}')
        print(f'speed: {speed}')
        print(f'pack: {pack}')
        print(f'Range: {rangedAttack}')
        print(f'stats: {stats}')
        print(f'skills: {skills}')
        print(f'attributes: {attributes}')
        print(f'actions: {actions}')
        print(f'legendaryActions: {legendaryActions}')

        if i + 2 >= len(lines):
            print('finished')
            break
        else: 
            i += 2
    
    #print(newMonsters)
        


