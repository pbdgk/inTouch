import json


from .repository_errors import (
    RepositoryError,
    UserRepositoryError,
    ContactRepositoryError
    )

from api.serializers import (
    ContactSerializer,
    RoomSerializer,
    MessageSerializer,
    ProfileSerializer
    )

from django.contrib.auth.models import User

from chat.models import Room, Message, Contact

STATUS_200 = 200
STATUS_400 = 400


class UserRepository:

    def get_user_by_id(self, id):
        try:
            return User.objects.get(pk=id)
        except User.DoesNotExist:
            raise UserRepositoryError({'message': 'Wrong id'})

    def get_user_by_username(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise UserRepositoryError({'message': 'Wrong username'})

    def _is_users_identical(self, user_1, user_2):
        return user_1.pk == user_2.pk


class ContactRepository(UserRepository):

    response_error = {'error': True, 'message': 'Wrong contact name'}

    def get_contacts(self, owner_id):
        try:
            user = self.get_user_by_id(id=owner_id)
        except UserRepositoryError:
            return None, STATUS_400
        contact = Contact.objects.filter(current_user=user).first()
        print(contact)
        response = ContactSerializer(contact).data
        return response, STATUS_200

    def connect(self, request, sender_id):
        contact_username = request.data.get('contact')
        try:
            owner = self.get_user_by_id(sender_id)
            contact = self.get_user_by_username(contact_username)
            self.connect_users(owner, contact)
        except (ContactRepositoryError, UserRepositoryError):
            response, status = self.response_error, STATUS_400
        else:
            response = ContactSerializer(contact).data
            status = STATUS_200
        return response, status

    def connect_users(self, *users):
        if self._is_users_identical(*users):
            raise UserRepositoryError
        Contact.add_contact(*users)


class RoomRepository:

    response_error = {'error': True, 'message': 'Wrong request parametr'}

    def __init__(self, user_repository=None):
        if user_repository is None:
            self.user_repository = UserRepository()
        else:
            self.user_repository = user_repository()

    def get_room_by_id(self, id):
        try:
            Room.objects.get(pk=id)
        except Room.DoesNotExist:
            raise RepositoryError

    def get_rooms(self, request, pk):
        try:
            owner = self.user_repository.get_user_by_id(id=pk)
        except UserRepositoryError:
            response, status = self.response_error, STATUS_400
        else:
            rooms = owner.room_set.all()
            serialized = RoomSerializer(rooms,
                                        many=True,
                                        context={'owner': owner}
                                        )
            response, status = serialized.data, STATUS_200
        return response, status

    def create_room(self, request, pk):
        receiver_id = request.data.get('receiver')
        try:
            owner, receiver = self._get_users(receiver_id, owner_id=pk)
        except UserRepositoryError:
            response, status = None, STATUS_400
        else:
            room_name = self._generate_room_name(owner, receiver)
            room = self._create_room(room_name, (owner, receiver))
            serialized = RoomSerializer(room, context={'owner': owner})
            response, status = serialized.data, STATUS_200
        return response, status

    def _get_users(self, receiver_id, owner_id):
        receiver = self.user_repository.get_user_by_id(receiver_id)
        owner = self.user_repository.get_user_by_id(owner_id)
        if self.user_repository._is_users_identical(owner, receiver):
            raise UserRepositoryError
        return owner, receiver

    def _generate_room_name(self, *args):
        usernames = [user.username for user in args]
        usernames.sort()
        return '_'.join(usernames)

    def _create_room(self, room_name, users):
        room, created = self.room_model.objects.get_or_create(
            room_name='{}'.format(room_name)
            )
        if created:
            room.users.add(*users)
        return room


class MessageRepository:

    def __init__(self, room_repository=None):
        if room_repository is None:
            self.room_repository = RoomRepository()
        else:
            self.room_repository = room_repository()

    def save(self, message, user, room):
        msg = Message(msg=message, sender=user, room=room)
        msg.save()
        return msg

    def get_messages(self, room_id):
        messages = self._get_messages_by_room_id(room_id)
        response = self.serialize(messages, many=True)
        return response, STATUS_200

    def serialize(self, message, many=False):
        serialized_messages = MessageSerializer(message, many=many)
        return serialized_messages.data

    def get_ws_message(self, text_data, scope):
        text_message, room_id, user = self.parse_data(text_data, scope)
        try:
            room = self.room_repository.get_room_by_id(room_id)
        except RepositoryError as e:
            data = {'type': 'error', 'message': e}
        if text_message:
            message = self.save(text_message, user, room)
            json_message = self.serialize(message)
            data = {'type': 'chat_message', 'message': json_message}
        return data

    def parse_data(self, data, scope):
        data = json.loads(data)
        message = data.get('message')
        room_id = data.get('id')
        user = scope.get('user')
        return message, room_id, user

    def _get_messages_by_room_id(self, room_id):
        return Message.objects.filter(room_id=room_id)


class ProfileRepository:

    def __init__(self, user_repository=None):
        if user_repository is None:
            self.user_repository = UserRepository()
        else:
            self.user_repository = user_repository()

    def get(self, pk):
        try:
            user = self.user_repository.get_user_by_id(pk)
        except UserRepositoryError:
            response, status = None, STATUS_400
        else:
            profile = ProfileSerializer(user.profile)
            response, status = profile.data, STATUS_200
        return response, status

    def save(self, profile, data=None):
        profile = ProfileSerializer(profile, data=data)
        if profile.is_valid():
            profile.save()
            response, status = profile.data, STATUS_200
        else:
            response, status = profile.errors, STATUS_400
        return response, status

    def update(self, request, id):
        try:
            user = self.user_repository.get_user_by_id(id)
        except UserRepositoryError as e:
            response, status = e, STATUS_400
        else:
            response, status = self.save(user.profile, data=request.data)
        return response, status
