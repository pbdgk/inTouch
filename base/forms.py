from django import forms
from django.contrib.auth.models import User

from .models import Profile


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio', 'location', 'birthdate', 'image']


class RegisterForm(forms.ModelForm):
    username = forms.CharField(
        label='',
        max_length=150,
        widget=forms.TextInput(attrs={'placeholder': 'Username'})
    )
    email = forms.CharField(
        label='',
        max_length=150,
        widget=forms.EmailInput(attrs={'placeholder': 'Email'})
    )
    password1 = forms.CharField(
        label='',
        max_length=150,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'})
    )
    password2 = forms.CharField(
        label='',
        max_length=150,
        widget=forms.PasswordInput(attrs={'placeholder': 'Repeat Password'})
    )

    def clean(self):
        cleaned_data = super().clean()
        psw1 = cleaned_data.get('password1')
        psw2 = cleaned_data.get('password2')
        if psw1 != psw2:
            self.add_error('password1', 'Passwords are not identical.')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        print(email * 10)
        if User.objects.filter(email=email).exists():
            self.add_error('email', 'Email is already used.')
        return email

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
