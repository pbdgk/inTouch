from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Room, Message, Contact


admin.site.register(Room)
admin.site.register(Message)
admin.site.register(Contact)


# class CustomUserAdmin(UserAdmin):
    # def __init__(self, *args, **kwargs):
        # super(UserAdmin,self).__init__(*args, **kwargs)
        # UserAdmin.list_display = list(UserAdmin.list_display) + ['contact_set',]
# UserAdmin.list_display = ('email', 'username', 'date_joined', 'is_staff', 'contact_set')

# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)
