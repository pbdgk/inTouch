from django.shortcuts import render, redirect
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .forms import RegisterForm, ProfileForm
from .models import Profile


def profile_view(request, pk):
    print(request.method)
    context = {'success': 'error'}
    template_name = 'base/profile.html'
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid:
            form.save()
            print(form.data)
            print('valid')
            context['success'] = 'success'
        else:
            print(form.errors)
    form = ProfileForm(instance=request.user.profile)
    context['form'] = form
    return render(request, template_name, context)


def index(request):
    return render(request, 'base/index.html')


# def profile_view(request, user_id):
#     if request.method == 'GET':
#         profile = get_object_or_404(Profile, pk=user_id)


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            password1 = form.cleaned_data.get('password1')
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            login(request, user)
            return redirect('base:index')
    else:
        form = RegisterForm()
    return render(request, 'base/register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        raise Http404
    context = {}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('base:index')
        else:
            context = {'error_message': 'Wrong credentials'}
    return render(request, 'base/login.html', context)


def logout_view(request):
    logout(request)
    return redirect('base:index')
