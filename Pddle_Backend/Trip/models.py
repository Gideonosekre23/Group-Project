from django.db import models
from django.contrib.auth.models import User
from customers.models import UserProfile  # Assuming you have a UserProfile model for customers
from Driver.models import DriverProfile  # Assuming you have a DriverProfile model for drivers
from Bike.models import Bike  # Assuming you have a Bike model

class Trip(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('waiting', 'Waiting'),
        ('started', 'Started'),
        ('canceled', 'Canceled'),
        ('ontrip', 'On Trip'),
        ('completed', 'Completed'),
    ]

    renter = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='trips_taken')
    bike_owner = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='trips_given')
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
    trip_date = models.DateTimeField(auto_now_add=True)
    origin_location = models.PointField(null=True, blank=True)  # GIS-enabled field for origin location
    destination_location = models.PointField(null=True, blank=True)  # GIS-enabled field for destination location
    origin_map = models.ImageField(upload_to='trip_maps/', null=True, blank=True)  # ImageField for origin map
    destination_map = models.ImageField(upload_to='trip_maps/', null=True, blank=True)  # ImageField for destination map
    distance = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=100)
    trip_canceled = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='accepted')

    def __str__(self):
        return f"Trip #{self.pk} from {self.origin_location} to {self.destination_location}"


# Create your models here.
