from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.safestring import mark_safe

import json

from .models import Message, Room

# Create your views here.


@login_required(login_url='/base/login')
def chat(request):
    room, created = Room.objects.get_or_create(
        room_name='main'
    )
    if request.method == 'POST':
        msg = request.POST.get('user_message').strip()
        if msg:
            user = request.user
            message = Message(msg=msg, sender=user)
            message.save()
            return HttpResponseRedirect(reverse('chatapp:chat_page'))
    messages = Message.objects.filter(room__room_name=room.room_name)
    context = {'messages': messages}
    return render(request, 'chat/chat.html', context)


def index(request):
    return render(request, 'chat/index.html', {})


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name)),
    })
