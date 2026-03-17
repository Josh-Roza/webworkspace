from django.urls import path
from . import views   

urlpatterns = [
    path("", views.homePage, name="homePage"),
    path("scenGen/", views.scenGen, name="scenGen"),
    path("scenViewer/", views.scenViewer, name="scenViewer"),
    path("savedScenarios/", views.savedScenarios, name="savedScenarios"),
    path("savedScenarios/<int:scen_id>/", views.savedScenarioDetail, name="savedScenarioDetail"),
    path("popularScenarios/", views.popularScenarios, name="popularScenarios"),
    path("api/generateEncounter/", views.generateEncounter, name="generateEncounter"),
    path("search/", views.search, name="search"),
    path("api/saveScenario/", views.saveScen, name="saveScen"),
]