from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import Message
from base.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'location', 'birthdate']


class UserSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile']

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
