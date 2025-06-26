
from django.urls import path
from . import views
from .views import scrape_view


urlpatterns = [
    path("api/scrape/", scrape_view, name="scrape-view"),
]
