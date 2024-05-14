from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.gis.geos import Point
from Driver.models import DriverProfile
from customers.models import UserProfile

class GPSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        user_type = data_json.get('user_type')
        latitude = data_json['latitude']
        longitude = data_json['longitude']

        if user_type == 'driver':
            # Update driver's current location in the database
            self.update_driver_location(self.scope['user'], latitude, longitude)
        elif user_type == 'customer':
            # Update customer's current location in the database
            self.update_customer_location(self.scope['user'], latitude, longitude)

    async def update_driver_location(self, user, latitude, longitude):
        driver_profile = DriverProfile.objects.get(user=user)
        driver_profile.current_location = Point(float(longitude), float(latitude), srid=4326)
        driver_profile.save()

    async def update_customer_location(self, user, latitude, longitude):
        customer_profile = UserProfile.objects.get(user=user)
        customer_profile.current_location = Point(float(longitude), float(latitude), srid=4326)
        customer_profile.save()

    async def gps_location(self, event):
        latitude = event['latitude']
        longitude = event['longitude']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'latitude': latitude,
            'longitude': longitude
        }))
    