# this is to take the model from an abject to json
from rest_framework import serializers
from .models import UserProfile
from Riderequest.models import Ride_Request
from Driver.models import DriverProfile
from Bike.models import Bike
from django.contrib.gis.geos import Point

class UserProfileSerializer(serializers.ModelSerializer) :
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model= UserProfile
        fields =  ['username', 'email', 'address', 'phone_number']

    class RideRequestSerializer(serializers.ModelSerializer):
        class Meta:
         model = Ride_Request
        fields = ['id', 'customer', 'pickup_location', 'destination','Price', 'requested_time', 'is_accepted', 'driver']
# 


class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['id', 'username', 'phone_number', 'profile_picture'] 

class BikeSerializer(serializers.ModelSerializer):
    current_location = serializers.SerializerMethodField()

    class Meta:
        model = Bike
        fields = ['owner', 'brand', 'model', 'color', 'size', 'year', 'description', 'is_available', 'current_location']

    def get_current_location(self, obj):
        # Serialize the PointField to a dictionary with 'latitude' and 'longitude' keys
        if obj.current_location:
            return {'latitude': obj.current_location.y, 'longitude': obj.current_location.x}
        else:
            return None

    def create(self, validated_data):
        # Get the authenticated user (driver) creating the bike
        user = self.context['request'].user

        # Retrieve the driver profile associated with the authenticated user
        driver_profile = DriverProfile.objects.get(user=user)  

        validated_data['owner'] = driver_profile
        validated_data['is_available'] = False

        # Get the GPS location of the driver
        driver_gps_location = driver_profile.gps_location

        # Set the GPS location of the driver as the current location of the bike
        validated_data['current_location'] = driver_gps_location

        # Create a new bike object with the provided data
        bike = Bike.objects.create(**validated_data)
        return bike
