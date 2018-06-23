from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model


class Contact(models.Model):
    contacts = models.ManyToManyField(settings.AUTH_USER_MODEL)
    current_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='owner',
        null=True,
        on_delete=models.CASCADE,
        )

    @classmethod
    def add_contact(cls, current_user, new_contact):
        contact, created = cls.objects.get_or_create(
            current_user=current_user
        )
        contact.contacts.add(new_contact)

        contact, created = cls.objects.get_or_create(
            current_user=new_contact
        )
        contact.contacts.add(current_user)

    @classmethod
    def remove_contact(cls, current_user, new_contact):
        contact, created = cls.objects.get_or_create(
            current_user=current_user
        )
        contact.contacts.remove(new_contact)


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

    def __str__(self):
        return self.msg


class Room(models.Model):
    room_name = models.CharField(max_length=120, blank=True, default='')
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    mode = models.BooleanField(default=False)

    def __str__(self):
        return self.room_name
