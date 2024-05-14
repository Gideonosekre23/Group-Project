from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import RideRequest
from customers.serializers import UserProfileSerializer
from Bike.models import Bike
from Driver.models import DriverProfile
from customers.serializers import RideRequestSerializer
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from push_notifications.models import PushNotification
from rest_framework.response import Response
from rest_framework import status
from Trip.models import Trip
from datetime import datetime


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_ride_request(request, request_id):
    try:
        ride_request = RideRequest.objects.get(pk=request_id, is_accepted=False)
    except RideRequest.DoesNotExist:
        return Response({'error': 'Ride request not found or already accepted'}, status=status.HTTP_404_NOT_FOUND)
    
    if ride_request.driver is not None:
        return Response({'error': 'Ride request already accepted by another driver'}, status=status.HTTP_400_BAD_REQUEST)

    if ride_request.customer != request.user:
        return Response({'error': 'You are not authorized to accept this ride request'}, status=status.HTTP_403_FORBIDDEN)

    # Assign the current user (driver) as the accepted_by
    ride_request.accepted_by = request.user
    ride_request.is_accepted = True
    ride_request.save()
    
    # Get the current location of the bike
    bike_current_location = ride_request.bike.current_location
    
    # Create a trip when the ride request is accepted
    trip = Trip.objects.create(
        renter=ride_request.customer.userprofile,
        bike_owner=request.user.driverprofile,
        bike=ride_request.bike,
        origin_location=ride_request.pickup_location,
        destination_location=ride_request.destination,
        distance=ride_request.distance,
        price=ride_request.price,
        duration=ride_request.duration
    )
    
    response_data = {
        'trip_id': trip.id,
        'pickup_location': trip.origin_location,
        'destination': trip.destination_location,
        'bike_current_location': bike_current_location,
        'price': ride_request.price,
        'duration': ride_request.duration,
        'message': 'Ride request accepted successfully'
    }

    return Response(response_data, status=status.HTTP_200_OK)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_ride_request(request, request_id):
    try:
        ride_request = RideRequest.objects.get(pk=request_id, is_accepted=False)
    except RideRequest.DoesNotExist:
        return JsonResponse({'error': 'Ride request not found or already accepted'}, status=404)
    
    if ride_request.driver != None:
        return JsonResponse({'error': 'Ride request already accepted by another driver'}, status=400)

    if ride_request.customer != request.user:
        return JsonResponse({'error': ' not authorized '}, status=403)

    # Send notification to the customer that the ride request is declined
    push_notification = PushNotification(
        recipient=ride_request.customer,  
        title='Ride Request Declined',
        message='Your ride request has been declined by the driver. Please make a new request.',
    )
    push_notification.save()
    
    ride_request.delete()
    return JsonResponse({'message': 'Ride request declined successfully'})







@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_ride(request):
    # Extract data from the request
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    pickup_location = Point(latitude, longitude)
    destination = Point(request.data.get('destination')['latitude'], request.data.get('destination')['longitude'])
    requested_time = request.data.get('requested_time')
    distance_km = request.data.get('distance_km')
    duration_hours = request.data.get('duration_hours')
    price = request.data.get('price')

    # Find available bikes and their distances from the user
    available_bikes = Bike.objects.filter(is_available=True)
    nearby_bikes = available_bikes.annotate(distance=Distance('current_location', pickup_location)).order_by('distance')

    if not nearby_bikes.exists():
        return Response({'error': 'No available bikes nearby'}, status=status.HTTP_400_BAD_REQUEST)

    # Get the nearest bike
    nearest_bike = nearby_bikes.first()

    # Get the owner (driver) of the nearest bike
    bike_owner = nearest_bike.owner

    # Send a push notification to the bike owner (driver)
    push_notification = PushNotification(
        recipient=bike_owner.user,  
        title='New Ride Request',
        message=f'New ride request received from {pickup_location} to {destination}. Do you want to accept or decline?',
    )
    push_notification.save()

    # Create a ride request
    ride_request_data = {
        'customer': request.user.id,
        'pickup_location': pickup_location,
        'destination': destination,
        'requested_time': requested_time,
        'driver': bike_owner.id,
        'price': price,
    }
    ride_request_serializer = RideRequestSerializer(data=ride_request_data)
    if ride_request_serializer.is_valid():
        ride_request_serializer.save()

        # Include a message in the response for the driver
        response_data = {
            'message': 'Ride request created successfully',
            'action_required': 'Please check your notifications to accept or decline the ride request.'
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    else:
        return Response(ride_request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
