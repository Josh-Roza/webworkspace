from django.urls import path
from . import views   

urlpatterns = [
    path("", views.homePage, name="homePage"),
    path("scenGen/", views.scenGen, name="scenGen"),
    path("scenViewer/", views.scenViewer, name="scenViewer"),
    path("savedScenarios/", views.savedScenarios, name="savedScenarios"),
    path("popularScenarios/", views.popularScenarios, name="popularScenarios"),
    path("api/generateEncounter/", views.generateEncounter, name="generateEncounter"),
]