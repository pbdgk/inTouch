
from .repository_errors import UserRepositoryError, ContactsRepositoryError
from api.serializers import ContactSerializer, RoomSerializer

STATUS_200 = 200
STATUS_400 = 400


class UserRepository:

    def __init__(self, user_model):
        self.user_model = user_model

    def get_user_by_id(self, id):
        try:
            return self.user_model.objects.get(pk=id)
        except self.user_model.DoesNotExist:
            raise UserRepositoryError({'message': 'Wrong id'})

    def get_user_by_username(self, username):
        try:
            return self.user_model.objects.get(username=username)
        except self.user_model.DoesNotExist:
            raise UserRepositoryError({'message': 'Wrong username'})

    def _is_users_identical(self, user_1, user_2):
        return user_1.pk == user_2.pk


class ContactsRepository(UserRepository):

    response_error = {'error': True, 'message': 'Wrong contact name'}

    def __init__(self, contact_model, *args):
        super().__init__(*args)
        self.contact_model = contact_model

    def handle(self, request, sender_id):
        contact_username = request.data.get('contact')
        try:
            owner = self.get_user_by_id(sender_id)
            contact = self.get_user_by_username(contact_username)
            self.connects_users(owner, contact)
        except (ContactsRepositoryError, UserRepositoryError):
            response, status = self.response_error, STATUS_400
        else:
            response = ContactSerializer(contact).data
            status = STATUS_200
        return response, status

    def connects_users(self, *users):
        if self._is_users_identical(*users):
            raise UserRepositoryError
        self.contact_model.add_contact(*users)


class RoomRepository:

    response_error = {'error': True, 'message': 'Wrong request parametr'}

    def __init__(self, room_model, user_model):
        self.room_model = room_model
        self.user_repository = UserRepository(user_model)

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
        try:
            receiver_id = request.data.get('receiver')
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
