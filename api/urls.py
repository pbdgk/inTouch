from django.urls import path

from .views import messages, profile, UploadView


urlpatterns = [
    path('profile/<int:pk>/', profile),
    path('profile/upload-data/', UploadView.as_view()),
    path('messages/<str:room_name>/', messages),
]
