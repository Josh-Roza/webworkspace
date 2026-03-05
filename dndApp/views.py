from django.shortcuts import render
from django.http import HttpResponse

def homePage(request):
    return render(request, 'index.html')

def scenGen(request):
    return render(request, 'scenGen.html')

def scenViewer(request):
    return render(request, 'scenViewer.html')

def savedScenarios(request):
    return render(request, 'savedScenarios.html')

def popularScenarios(request):
    return render(request, 'popularScenarios.html')

