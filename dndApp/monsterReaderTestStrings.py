import re
import os
import sys
from pathlib import Path
import textwrap

textWidth = 60

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

def seperateAttributes(string):
    # Normalize short headings (one or two words) so they appear on their own line.
    # 1) When a period precedes the heading: ". Word." or ". Word Word." -> ".\nWord.\n"
    # 2) When a colon/newline precedes the heading (e.g. "Attributes:\nIllumination.") -> keep prefix, add trailing newline.
    # 3) When a heading starts a line ("^Illumination.") ensure it ends with a newline after the period.
    # Use function-based replacements to avoid backreference expansion issues.

    # Normalize multiple spaces after a period to a single space (fix ".  Word" cases)
    string = re.sub(r"\.\s{2,}", ". ", string)

    # 1) period-before pattern — place heading on its own line and add a blank line after it
    string = re.sub(r"\.\s+((?:\S+)(?:\s+\S+)?)\.", lambda m: ".\n\n" + m.group(1) + ".\n\n", string)

    # 2) colon/newline before pattern — keep prefix, add blank line after heading
    string = re.sub(r"(\:\s*\n\s*)([A-Za-z]+(?:\s+[A-Za-z]+)?)\.", lambda m: m.group(1) + m.group(2) + ".\n\n", string)

    # 3) heading at start of a line (ensure trailing blank line). Use multiline mode.
    string = re.sub(r"(?m)^(\s*)([A-Za-z]+(?:\s+[A-Za-z]+)?)\.(?=\s)", lambda m: m.group(1) + m.group(2) + ".\n\n", string)

    # Remove any leading spaces at the start of lines introduced by replacements
    string = re.sub(r"(?m)\n[ \t]+", "\n", string)

    # Collapse excessive blank lines to at most one blank line (i.e., two newlines)
    string = re.sub(r"\n{3,}", "\n\n", string)

    print(string)
    return string


def wrap_paragraphs(text, width=textWidth):
    # Split into paragraphs on blank lines, preserve simple 1-2 word headings
    parts = re.split(r"\n\s*\n", text.strip()) if text and text.strip() else []
    out = []
    for p in parts:
        s = p.strip()
        # treat a short heading (one or two words + period) as a paragraph to keep
        if re.match(r'^[A-Za-z]+(?:\s+[A-Za-z]+)?\.$', s):
            out.append(s)
        elif s:
            # collapse internal whitespace then wrap
            collapsed = ' '.join(s.split())
            out.append(textwrap.fill(collapsed, width=width))
    # Join paragraphs with a single newline (no extra blank line)
    return "\n".join(out)

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

        
        # Ensure we don't create duplicates: remove any existing monsters with the same name,
        # then create a fresh record. Use the original CR/XP strings to avoid int() errors.
        Monster.objects.filter(name=name).delete()
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

        if i + 2 >= len(lines):
            print('finished')
            break
        else: 
            i += 2
    

        


