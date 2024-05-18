from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.gis.geos import Point
from Driver.models import DriverProfile
from customers.models import UserProfile
from Trip.models import Trip
from asgiref.sync import sync_to_async

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
    

# real time chat this will between the costumer and the driver of a trip 


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.trip_id = self.scope['url_route']['kwargs']['trip_id']
        self.room_group_name = f'chat_{self.trip_id}'

        # Check if the user is associated with the trip
        is_valid_user = await self.is_valid_user_for_trip(self.user, self.trip_id)
        if not is_valid_user:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': self.user.username
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user']
        }))

    @sync_to_async
    def is_valid_user_for_trip(self, user, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
            # Check if the user is the renter or bike_owner in the trip
            if trip.renter.user == user or trip.bike_owner.user == user:
                return True
        except Trip.DoesNotExist:
            return False
        return False