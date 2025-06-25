
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('wildapp.urls')),
    path('admin/', admin.site.urls),
]
