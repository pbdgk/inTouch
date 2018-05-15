from django.urls import path

from .views import index, register, login_view, logout_view

app_name = 'base'
urlpatterns = [
    path('', index, name='index'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
]
