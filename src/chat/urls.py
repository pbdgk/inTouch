from django.urls import path, re_path

from . import views


app_name = 'chatapp'

urlpatterns = [
    re_path(r'^.*[/]*$', views.chat, name='chat_page'),
    path('index', views.index, name='index'),
    re_path(r'^(?P<room_name>[^/]+)/$', views.room, name='room'),
]
