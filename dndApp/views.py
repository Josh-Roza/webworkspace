from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.shortcuts import render
from dndApp import buildEncounter

def homePage(request):
    return redirect('scenGen')

@ensure_csrf_cookie
def scenGen(request):
    return render(request, 'scenGen.html')

def scenViewer(request):
    return render(request, 'scenViewer.html')

def savedScenarios(request):
    return render(request, 'savedScenarios.html')

def popularScenarios(request):
    return render(request, 'popularScenarios.html')

def sendJson(request):
    monsterList = []
    context = {
        'monsterList': monsterList
    }
    return render(request, 'scenViewer.html', context)

def generateEncounter(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')

    try:
        data = json.loads(request.body)
    except Exception:
        return HttpResponseBadRequest("Invalid JSON data")

    playerNumber = data.get('playerNumber', 5)
    partyLvl = data.get('partyLvl', 5)
    difficulty = data.get('scenarioDifficulty', 'Medium')

    # buildSimpleEncounter returns a list of serializable dicts
    try:
        monsters = buildEncounter.buildSimpleEncounter(playerNumber, partyLvl, difficulty)
    except Exception as e:
        return HttpResponseBadRequest(f'Error building encounter: {e}')

    total_xp = sum((m.get('XP') or 0) for m in monsters)
    return JsonResponse({'monsters': monsters, 'total_xp': total_xp})

    