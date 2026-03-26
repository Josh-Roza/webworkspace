from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.shortcuts import render
from django.db.models import Q
from dndApp import buildEncounter
from dndApp.models import Monster, Scenario

def homePage(request):
    return redirect('scenGen')

@ensure_csrf_cookie
def scenGen(request):
    return render(request, 'scenGen.html')

def scenViewer(request):
    return render(request, 'scenViewer.html')

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def savedScenarios(request):
    # list saved scenarios ordered by newest with pagination
    query = (request.GET.get('q') or '').strip()

    all_scenarios = Scenario.objects.order_by('-created_at')
    if query:
        filters = Q(name__icontains=query)
        if query.isdigit():
            filters = filters | Q(id=int(query))
        all_scenarios = all_scenarios.filter(filters)

    paginator = Paginator(all_scenarios, 10)  # 10 per page
    page = request.GET.get('page', 1)
    try:
        scenarios = paginator.page(page)
    except PageNotAnInteger:
        scenarios = paginator.page(1)
    except EmptyPage:
        scenarios = paginator.page(paginator.num_pages)
    return render(
        request,
        'savedScenarios.html',
        {
            'scenarios': scenarios,
            'paginator': paginator,
            'q': query,
        },
    )

def savedScenarioDetail(request, scen_id):
    try:
        scen = Scenario.objects.get(id=scen_id)
    except Scenario.DoesNotExist:
        return HttpResponseBadRequest('Scenario not found')
    return render(request, 'savedScenarioDetail.html', {'scenario': scen})

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
    # optional selected monsters from the client: list of {id, name, count}
    selected_from_client = data.get('selectedMonsters')

    # buildSimpleEncounter returns a list of serializable dicts
    try:
        monsters = buildEncounter.buildSimpleEncounter(playerNumber, partyLvl, difficulty, initial_selected=selected_from_client)
    except Exception as e:
        return HttpResponseBadRequest(f'Error building encounter: {e}')

    total_xp = sum((m.get('XP') or 0) for m in monsters)
    return JsonResponse({'monsters': monsters, 'total_xp': total_xp})

def search(request):
    query = request.GET.get('monsterSearch')
    if query:
        matches = Monster.objects.filter(name__icontains=query)
    else:
        matches = Monster.objects.none()

    return render(request, 'scenGen.html', {'matches': matches})

def saveScen(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')

    try:
        data = json.loads(request.body)
    except Exception:
        return HttpResponseBadRequest('Invalid JSON')

    # Expect the full scenario payload (monsters, total_xp, etc.)
    monsters = data.get('monsters', [])
    total_xp = data.get('total_xp')
    name = data.get('name') or ''

    scen = Scenario.objects.create(name=name, XP=total_xp or None, data=data)

    # link known Monster records by name (case-insensitive)
    for m in monsters:
        mname = (m.get('name') or '').strip()
        if not mname:
            continue
        try:
            mon = Monster.objects.filter(name__iexact=mname).first()
            if mon:
                scen.Monsters.add(mon)
        except Exception:
            continue

    return JsonResponse({'status': 'ok', 'scenario_id': scen.id})

