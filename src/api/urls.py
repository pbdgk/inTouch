from django.urls import path, include

# from .views import (
#     Messages,
#     Rooms,
#     RoomsCreate,
#     Contacts,
#     ContactsConnect,
#     Profile,
#     ProfileTemp,
# )


urlpatterns = [
    path('v1/', include('api.v1.urls')),
    # path('messages/<str:room_id>/', Messages.as_view()),
    # path('rooms/<int:pk>/', Rooms.as_view()),
    # path('rooms/create/<int:pk>/', RoomsCreate.as_view()),
    # path('contacts/<int:pk>/', Contacts.as_view()),
    # path('contacts/add/<int:pk>/', ContactsConnect.as_view()),
    # path('profiles/<int:pk>/', Profile.as_view()),
    # path('profiles/upload_image/<int:pk>/', ProfileTemp.as_view())
]
