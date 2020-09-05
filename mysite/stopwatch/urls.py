from django.urls import path

from . import views

app_name = 'stopwatch'

urlpatterns = [
    # ex: /stopwatch/
    path('', views.index, name='index'),
    # ex: /stopwatch/5/
    path('<int:user_id>/', views.chart, name='chart'),
]