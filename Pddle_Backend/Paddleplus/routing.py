from django.urls import re_path
from .consumer import GPSConsumer

websocket_urlpatterns = [
    re_path(r'ws/gps/', GPSConsumer.as_asgi()),
]
