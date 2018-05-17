from django.urls import path

from .views import messages

urlpatterns = [
    path('messages/<str:room_name>/', messages),
]
