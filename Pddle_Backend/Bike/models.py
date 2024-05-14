from django.db import models
from django.contrib.auth.models import User
from Driver.models import DriverProfile
from django.contrib.gis.db.models import PointField


# Create your models here.

class Bike(models.Model):
    owner = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='bikes_owned')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    size = models.CharField(max_length=20)
    year = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    current_location = PointField(null=True, blank=True)
