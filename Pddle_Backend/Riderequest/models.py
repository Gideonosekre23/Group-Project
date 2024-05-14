from django.db import models
from django.db import models
from django.contrib.auth.models import User

class Ride_Request(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    requested_time = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    accepted_by = models.ForeignKey('DriverProfile', on_delete=models.SET_NULL, null=True, blank=True)

