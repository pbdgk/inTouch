from django.contrib.auth.models import User

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView


from .serializers import (
    MessageSerializer,
    ContactSerializer,
    ProfileSerializer,
    )
from base.models import Profile
from chat.models import Message, Contact, Room
from chat.repositories.repository import ContactsRepository, RoomRepository


class Messages(APIView):
    def get(self, request, room_id):
        messages = Message.objects.filter(room__id=room_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class ContactsConnect(APIView):
    def post(self, request, pk):
        repository = ContactsRepository(Contact, User)
        response, status = repository.handle(request, sender_id=pk)
        return Response(response, status=status)


class Rooms(APIView):
    def get(self, request, pk):
        room_repository = RoomRepository(Room, User)
        response, status = room_repository.get_rooms(request, pk)
        return Response(response, status=status)


class RoomsCreate(APIView):
    def post(self, request, pk):
        room_repository = RoomRepository(Room, User)
        response, status = room_repository.create_room(request, pk)
        return Response(response, status=status)


class Contacts(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        contact = Contact.objects.filter(current_user=user).first()
        serialized_contact = ContactSerializer(contact)
        data = serialized_contact.data
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


class UploadView(APIView):
    def get_queryset(self):
        queryset = Profile.objects.all()
        return queryset

    def post(self, request, format=None):
        print(dir(request))
        print(request.data)
        return Response({'hello': 'post'})
