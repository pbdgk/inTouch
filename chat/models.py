from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

# Create your models here.


def get_sentinet_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]


class Message(models.Model):

    msg = models.TextField()
    room = models.ForeignKey(
        to='Room',
        on_delete=models.CASCADE
    )
    sender = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_sentinet_user),
    )
    send_time = models.DateTimeField(auto_now_add=True)


class Room(models.Model):
    room_name = models.CharField(max_length=120)
    users = models.ManyToManyField(User)
    mode = models.BooleanField(default=False)
