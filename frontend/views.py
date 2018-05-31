from django.shortcuts import render

# Create your views here.


def test_app_view(request):
    return render(request, 'frontend/testIndex.html')
