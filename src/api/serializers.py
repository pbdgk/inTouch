from django.contrib.auth.models import User

from rest_framework import serializers

from chat.models import Message, Contact, Room
from base.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    def get_email(self, obj):
        return obj.user.email

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Profile
        fields = ['bio', 'location', 'birthdate', 'image', 'email', 'username',]


class UserSerializer(serializers.ModelSerializer):

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
        fields = ['msg', 'sender', 'send_time']


class RoomSerializer(serializers.ModelSerializer):
    msg = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()

    def get_msg(self, obj):
        last_message = obj.message_set.last()
        if not last_message:
            return None
        return MessageSerializer(last_message).data

    def get_contact(self, obj):
        owner = self.context.get('owner')
        contact = obj.users.all().exclude(pk=owner.pk).first()
        return UserSerializer(contact).data

    class Meta:
        model = Room
        fields = ['id', 'room_name', 'msg', 'contact']


class ContactSerializer(serializers.ModelSerializer):
    contacts = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = ['contacts']
