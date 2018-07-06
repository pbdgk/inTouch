from .base import *

DEBUG = True



"""
# WARNING: next class used for development purposes.
    If You know better way I will be very glad to know it too!.
    Please, leave it in comments.
"""
class DevelopmentValidator:
    """
        Used to disable allauth PASSWORD_MIN_LENGTH
        https://github.com/pennersr/django-allauth/blob/master/allauth/account/app_settings.py#L140
    """
    def validate(*args, **kwargs):
        return True

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": 'intouch.settings.development.DevelopmentValidator',
    }
]
