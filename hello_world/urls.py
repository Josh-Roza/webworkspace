from django.urls import path
from hello_world import views

urlpatterns = [

    path('', views.score_view, name='home'),  # Root URL pattern
    # path('score', views.score_view, name='score_view'),

    path('score/edit/<int:score_id>/', views.edit_score, name='edit_score'),

    path('score/delete/<int:score_id>/', views.delete_score, name='delete_score'),
]