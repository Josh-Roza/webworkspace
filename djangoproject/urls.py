from django.urls import path, include
# from .views import front_page
# from .views import add_contact
# from .views import search_contact
# from .views import edit_contact
# from .views import delete_contact

urlpatterns = [
    # path("", front_page, name="front_page"),
    # path("add/", add_contact, name="add_contact"),
    # path("search/", search_contact, name="search_contact"),
    # path(
    #     "edit_contact/<int:contact_id>/<int:page_number>/",
    #     edit_contact,
    #     name="edit_contact",
    # ),
    # path(
    #     "delete_contact/<int:contact_id>/<int:page_number>/",
    #     delete_contact,
    #     name="delete_contact",
    # ),
    path("", include("dndApp.urls")),
    # path("", index, name="index"),
    # path("Scenario_Generator/", scenGen, name="scenGen"),
    # path("Saved_Scenarios", savedScenarios, name="savedScenarios"),
    # path("Popular_Scenarios", popularScenarios, name="popularScenarios"),
]
