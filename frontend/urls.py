from django.urls import path

from . import views


urlpatterns = [
    path('', views.test_app_view, name='testapp'),
]
