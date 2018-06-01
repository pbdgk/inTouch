from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Room, Message
from api.serializers import MessageSerializer


import json


def save_message_model(msg, sender, room=None):
    if room is None:
        room = Room.objects.get(room_name='main')
    msg = Message(msg=msg, room=room, sender=sender)
    msg.save()
    return msg


class MainChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'main_room'
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if message:
            user = self.scope['user']
            msg = save_message_model(message, user)
            serialized = MessageSerializer(msg)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': serialized.data
                }
            )

    # Receive message from room group
    def chat_message(self, event):
            message = event['message']
            # Send message to WebSocket
            self.send(text_data=json.dumps({
                'message': message
            }))
