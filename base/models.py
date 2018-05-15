from django.contrib.auth.models import User
from django.contrib.auth.validators import ASCIIUsernameValidator


class MyUser(User):

    username_validator = ASCIIUsernameValidator()

    class Meta():
        proxy = True
