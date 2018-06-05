from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView


from base.models import Profile
from chat.models import Message, Contact, Room
from .serializers import (
    MessageSerializer,
    UserSerializer,
    ContactSerializer,
    RoomSerializer,
    ProfileSerializer,
)


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def add_contact(request):
    if request.method == 'POST':
        data = request.data
        contact_username = data.get('contact')
        contact = User.objects.filter(username=contact_username)
        if contact.exists():
            current_user_id = data.get('currentUser')
            current_user = User.objects.get(pk=current_user_id)
            Contact.add_contact(current_user, contact.first())
            return Response({'created': True}, status=status.HTTP_201_CREATED)
        return Response({'created': False}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def room_list(request, pk):
    owner = User.objects.get(pk=pk)
    rooms = owner.room_set.all()
    serialized = RoomSerializer(rooms, many=True, context={'owner': owner})
    return Response(serialized.data)


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def create_room(request, receiver_pk, sender_pk):
    sender = User.objects.get(pk=sender_pk)
    receiver = User.objects.get(pk=receiver_pk)
    sender_name, receiver_name = sender.username, receiver.username
    room, created = Room.objects.get_or_create(
        room_name='{}_{}'.format(sender_name, receiver_name)
    )
    if not created:
        room.users.add(sender, receiver)
    print(room)
    return Response({'good': 'ok'})


class UploadView(APIView):
    def get_queryset(self):
        queryset = Profile.objects.all()
        return queryset

    def post(self, request, format=None):
        print(dir(request))
        print(request.data)
        return Response({'hello': 'post'})


def get_last_message(receiver_pk, sender):
    return Message.objects.filter(Q(room__room_name=receiver_pk) & Q(room__sender=sender))


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def contact(request, pk):
    user = User.objects.get(pk=pk)
    contact = Contact.objects.filter(current_user=user).first()
    if request.method == 'GET':
        contact_s = ContactSerializer(contact)
        data = contact_s.data
        return Response(data)


@api_view(['GET', 'PUT'])
@permission_classes((permissions.AllowAny,))
def profile(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        profile = ProfileSerializer(user.profile)
        return Response(profile.data)

    elif request.method == 'PUT':
        profile = ProfileSerializer(user.profile, data=request.data)
        if profile.is_valid():
            profile.save()
            return Response(profile.data)
        else:
            return Response(profile.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def messages(request, room_name):
    if request.method == 'GET':
        messages = Message.objects.filter(room__room_name=room_name)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)
