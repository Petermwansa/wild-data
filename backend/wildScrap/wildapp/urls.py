
from django.urls import path
from . import views
from .views import scrape_view

# The endpoint of the api rthat will be accessed to render the data on the frontend in ReactJS 
urlpatterns = [
    path("api/scrape/", scrape_view, name="scrape-view"),
]
