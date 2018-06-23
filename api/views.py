from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser

from chat.repositories.repository import (
    ContactRepository,
    RoomRepository,
    MessageRepository,
    ProfileRepository
    )

from .serializers import ProfileSerializer


class Messages(APIView):
    def get(self, request, room_id):
        repository = MessageRepository()
        response, status = repository.get_messages(room_id)
        return Response(response, status=status)


class Rooms(APIView):
    def get(self, request, pk):
        room_repository = RoomRepository()
        response, status = room_repository.get_rooms(request, pk)
        return Response(response, status=status)


class RoomsCreate(APIView):
    def post(self, request, pk):
        room_repository = RoomRepository()
        response, status = room_repository.create_room(request, pk)
        return Response(response, status=status)


class ContactsConnect(APIView):
    def post(self, request, pk):
        repository = ContactRepository()
        response, status = repository.connect(request, sender_id=pk)
        return Response(response, status=status)


class Contacts(APIView):
    def get(self, request, pk):
        repository = ContactRepository()
        response, status = repository.get_contacts(pk)
        return Response(response, status=status)


class Profile(APIView):
    def get(self, request, pk):
        repository = ProfileRepository()
        response, status = repository.get(pk)
        return Response(response, status=status)

    def put(self, request, pk):
        repository = ProfileRepository()
        response, status = repository.update(request, pk)
        return Response(response, status=status)


class ProfileTemp(APIView):

    parser_classes = (MultiPartParser,)
    serializer_class = ProfileSerializer

    def post(self, request, pk):
        print(request.FILES)
        return Response('good', status=200)

    def get(self, request, pk):
        return Response('bad', status=202)
