import re
import os
import sys
from pathlib import Path
import textwrap

#how much text will go on each line
textWidth = 60

#make it so this file can be run as a module
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoproject.settings")

try:
    import django
    django.setup()
except Exception:
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

#Different attacks or attributes follow the patter . word. or . word word. use that to make each one it's own line.
def seperateAttributes(string):
    string = re.sub(r"\.\s{2,}", ". ", string)

    string = re.sub(r"\.\s+((?:\S+)(?:\s+\S+)?)\.", lambda m: ".\n\n" + m.group(1) + ".\n\n", string)

    string = re.sub(r"(\:\s*\n\s*)([A-Za-z]+(?:\s+[A-Za-z]+)?)\.", lambda m: m.group(1) + m.group(2) + ".\n\n", string)

    string = re.sub(r"(?m)^(\s*)([A-Za-z]+(?:\s+[A-Za-z]+)?)\.(?=\s)", lambda m: m.group(1) + m.group(2) + ".\n\n", string)

    string = re.sub(r"(?m)\n[ \t]+", "\n", string)

    string = re.sub(r"\n{3,}", "\n\n", string)

    print(string)
    return string

#Make it so that description paragraphs only have textwidth characters per line
def wrap_paragraphs(text, width=textWidth):
    parts = re.split(r"\n\s*\n", text.strip()) if text and text.strip() else []
    out = []
    for p in parts:
        s = p.strip()
        if re.match(r'^[A-Za-z]+(?:\s+[A-Za-z]+)?\.$', s):
            out.append(s)
        elif s:
            collapsed = ' '.join(s.split())
            out.append(textwrap.fill(collapsed, width=width))
    return "\n".join(out)

#read monstersTest.txt and add all monsters with their respective abilites
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
        skills = seperateAttributes(skills)
        skills = "Skills:\n" + wrap_paragraphs(skills, width=textWidth) + "\n"

    #Adds all the lines from the attributes category into an array
        attributes = ""
        while lines[i].strip() != "Actions":
            if lines[i].strip() != "":
                attributes += lines[i] + "\n"
            i += 1
        i += 1
        if attributes != "":
            attributes = seperateAttributes(attributes)
            attributes = "Attributes:\n" + wrap_paragraphs(attributes, width=textWidth) + "\n"

        actions = ""
        while lines[i].strip() != "Legendary actions" and not(lines[i].strip() == "" and i+1 < len(lines) and lines[i+1].strip() == ""):
            if lines[i].strip() != "":
                actions += lines[i]
            i += 1
        actions = seperateAttributes(actions)
        actions = "Actions\n" + wrap_paragraphs(actions, width=textWidth) + "\n"

        legendaryActions = ""
        if i < len(lines) and lines[i].strip() == "Legendary actions":
            while i < len(lines) and not(lines[i].strip() == "" and i+1 < len(lines) and lines[i+1].strip() == ""):
                if lines[i].strip() != "":
                    legendaryActions += lines[i]
                i += 1
        if legendaryActions != "": 
            legendaryActions = seperateAttributes(legendaryActions)
            legendaryActions = "Legendary Actions:\n" + wrap_paragraphs(legendaryActions, width=textWidth) + "\n"
        
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

        
        #delete monsters with same name so there are no duplicates.
        Monster.objects.filter(name=name).delete()
        #add monster to the database
        Monster.objects.create(
            name=name,
            HP=int(HP),
            AC=int(AC),
            CR= CR,
            XP= int(XP),
            speed=speed,
            stats=stats,
            skills=skills,
            attributes=attributes,
            actions=actions,
            legendaryActions=legendaryActions,
            rangedAttack=rangedAttack,
            pack=pack,
        )
        #end if you are at the end of the file
        if i + 2 >= len(lines):
            print('finished')
            break
        else: 
            i += 2
    

        


