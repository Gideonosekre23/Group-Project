from django.urls import re_path
from .consumer import GPSConsumer
from .consumer import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/gps/', GPSConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<trip_id>\d+)/$', ChatConsumer.as_asgi()),
]
