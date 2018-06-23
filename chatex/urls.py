from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include


urlpatterns = [
    path('', include('base.urls')),
    path('chat/', include('chat.urls')),
    path('api/v1/', include('api.urls')),
    path('test/', include('frontend.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
