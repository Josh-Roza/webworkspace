from django.urls import path
from . import views   # imports myapp/views.py

urlpatterns = [
    path("", views.homePage, name="homePage"),
    path("scenGen/", views.scenGen, name="scenGen"),
    path("savedScenarios/", views.savedScenarios, name="savedScenarios"),
    path("popularScenarios/", views.popularScenarios, name="popularScenarios"),
]