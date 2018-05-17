from rest_framework import serializers

from chat.models import Message


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['id', 'msg', 'room', 'sender', 'send_time']
