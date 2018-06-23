from django.shortcuts import render


def test_app_view(request):
    return render(request, 'frontend/testIndex.html')
