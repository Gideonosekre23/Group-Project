# Riderequest/models.py
from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db.models import PointField
from Driver.models import DriverProfile 

class Ride_Request(models.Model):
    customer = models.ForeignKey(User, related_name='ride_requests', on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, related_name='ride_requests', on_delete=models.SET_NULL, null=True, blank=True)
    accepted_by = models.ForeignKey(DriverProfile, related_name='accepted_ride_requests', on_delete=models.SET_NULL, null=True, blank=True)
    pickup_latitude = models.FloatField(default=0.0)
    pickup_longitude = models.FloatField(default=0.0)
    destination_latitude = models.FloatField(default=0.0)
    destination_longitude = models.FloatField(default=0.0)
    requested_time = models.DateTimeField()
    is_accepted = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    distance = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    duration = models.DurationField()

    def __str__(self):
        return f"Request by {self.customer.username} from ({self.pickup_latitude}, {self.pickup_longitude}) to ({self.destination_latitude}, {self.destination_longitude})"