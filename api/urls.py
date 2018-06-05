from django.urls import path

from .views import (
    messages,
    profile,
    UploadView,
    contact,
    room_list,
    create_room,
    add_contact
)


urlpatterns = [
    path('profile/<int:pk>/', profile),
    path('profile/upload-data/', UploadView.as_view()),
    path('contact/<int:pk>/', contact),
    path('addcontact/', add_contact),
    path('room_list/<int:pk>/', room_list),
    path('createroom/<int:receiver_pk>/<int:sender_pk>', create_room),
    path('messages/<str:room_name>/', messages),
]
