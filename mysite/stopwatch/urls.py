from django.urls import path

from . import views

app_name = 'stopwatch'

urlpatterns = [
    # ex: /stopwatch/
    path('', views.index, name='index'),
    # ex: /stopwatch/records/
    path('records/', views.records, name='records'),
    path('records/create/', views.create, name='create'),
    path('records/delete/', views.delete, name='delete'),
]