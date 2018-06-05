from django.contrib.auth.models import User

from rest_framework import serializers

from chat.models import Message, Contact, Room
from base.models import Profile




class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'location', 'birthdate']


class UserSerializer(serializers.ModelSerializer):

    # profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        profile = Profile.objects.get(user__pk=instance.id)
        serialized = ProfileSerializer(profile, data=validated_data['profile'])
        if serialized.is_valid():
            serialized.save()
        else:
            return serialized.errors
        instance.save()
        return instance


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'msg', 'room', 'sender', 'send_time']


class LastMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ['sender', 'msg', 'send_time']


class RoomSerializer(serializers.ModelSerializer):
    # users = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()

    def get_last_message(self, obj):
        last_message = obj.message_set.last()
        if not last_message:
            return None
        return LastMessageSerializer(last_message).data

    def get_contact(self, obj):
        owner = self.context.get('owner')
        print('owner', owner)
        users = list(obj.users.all())
        print('USERS'*10, users)
        users.remove(owner)
        contact = users[0]
        print(contact)
        return UserSerializer(contact).data

    class Meta:
        model = Room
        fields = ['id', 'room_name', 'mode', 'last_message', 'contact']


class ContactSerializer(serializers.ModelSerializer):
    contacts = UserSerializer(many=True, read_only=True)
    current_user = UserSerializer()

    class Meta:
        model = Contact
        fields = ['contacts', 'current_user']
