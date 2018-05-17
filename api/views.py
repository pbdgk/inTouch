from rest_framework.decorators import api_view, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from chat.models import Message
from .serializers import MessageSerializer


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def messages(request, room_name):
    if request.method == 'GET':
        messages = Message.objects.filter(room__room_name=room_name)
        serializer = MessageSerializer(messages, many=True)
        json_messages = JSONRenderer().render(serializer.data)
        return Response(json_messages)
    return Response(status=status.HTTP_400_BAD_REQUEST)
