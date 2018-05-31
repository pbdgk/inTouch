from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView

from django.contrib.auth.models import User

from base.models import Profile
from chat.models import Message
from .serializers import MessageSerializer, UserSerializer


class UploadView(APIView):
    def get_queryset(self):
        queryset = Profile.objects.all()
        return queryset

    def post(self, request, format=None):
        print(dir(request))
        print(request.data)
        return Response({'hello': 'post'})


@api_view(['GET', 'PUT'])
@permission_classes((permissions.AllowAny,))
def profile(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        profile = UserSerializer(user)
        return Response(profile.data)

    elif request.method == 'PUT':
        profile = UserSerializer(user, data=request.data)
        if profile.is_valid():
            profile.save()
            return Response(profile.data)
        else:
            return Response(profile.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def messages(request, room_name):
    if request.method == 'GET':
        messages = Message.objects.filter(room__room_name=room_name)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)
