from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from Driver.models import DriverProfile  
from customers.serializers import BikeSerializer
from .models import Bike
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from .models import Trip
from .pricing import calculate_price

@api_view(['POST'])
def add_bike(request):
    # Check if the user is authenticated and is a driver
    if request.user.is_authenticated and hasattr(request.user, 'driver_profile'):
        if request.method == 'POST':
            # Serialize the request data
            serializer = BikeSerializer(data=request.data, context={'request': request})

            if serializer.is_valid():
                # Create the bike
                bike = serializer.save()
                bike.current_location = request.user.driver_profile.current_location
                bike.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Only authenticated drivers can add bikes.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
def make_bike_available(request, bike_id):
    # Check if the user is authenticated and is a driver
    if request.user.is_authenticated and hasattr(request.user, 'driver_profile'):
        try:
            # Retrieve the bike associated with the provided bike_id
            bike = Bike.objects.get(pk=bike_id, owner=request.user.driver_profile)
        except Bike.DoesNotExist:
            return Response({'error': 'Bike not found or you are not the owner'}, status=status.HTTP_404_NOT_FOUND)

        # Update the is_available field to True
        bike.is_available = True
        bike.save()

        return Response({'message': 'Bike is now available'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Only authenticated drivers can make bikes available'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_available_bikes(request):
    # Get the latitude and longitude from the request parameters
    latitude = request.query_params.get('latitude')
    longitude = request.query_params.get('longitude')

    if not (latitude and longitude):
        return Response({'error': 'Latitude and longitude parameters are required'}, status=400)

    # Convert latitude and longitude to Point object
    location = Point(float(longitude), float(latitude), srid=4326)

    # Define the search radius (in meters)
    search_radius = 5000  

    # Query all available bikes within the search radius of the provided location
    available_bikes = Bike.objects.filter(is_available=True, current_location__distance_lte=(location, search_radius)).annotate(distance=Distance('current_location', location)).order_by('distance')

    # Serialize the queryset of available bikes
    serializer = BikeSerializer(available_bikes, many=True)

    return Response(serializer.data)
    return Response(serializer.data)
    return Response(serializer.data)


# views.py




@api_view(['POST'])
def search_for_ride(request):
    # Get customer's location from the request data
    customer_location = request.data.get('customer_location')
    
    # Query for completely available bikes
    available_bikes = Bike.objects.filter(trip=None, current_location=customer_location)
    
    if not available_bikes:
        # If no completely available bikes, check for partially available bikes
        partially_available_trips = Trip.objects.filter(
            status='ontrip', 
            destination_location=customer_location
        )
        
        if partially_available_trips.exists():
            return Response({'message': 'Bike available soon (90% done trip)'})
        else:
            return Response({'message': 'No available bikes at the moment'})
    else:
        # Calculate price for the ride
        # For simplicity, let's assume the distance and duration are provided in the request data
        distance_km = request.data.get('distance_km')
        duration_hours = request.data.get('duration_hours')
        base_fare = 5  # Define your base fare
        rate_per_km = 2  # Define your rate per kilometer
        rate_per_hour = 1.5  # Define your rate per hour
        
        # Call the calculate_price function to get the total fare
        price = calculate_price(distance_km, duration_hours, base_fare, rate_per_km, rate_per_hour)
        
        # Serialize the data and return available bikes along with price
        serializer = BikeSerializer(available_bikes, many=True)
        return Response({'available_bikes': serializer.data, 'price': price})
