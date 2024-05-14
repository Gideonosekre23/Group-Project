from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.contrib.gis.db.models import PointField


# Create your models here.``
class DriverProfile(models.Model):

    user = models.OneToOneField(User, related_name='driver_profile', on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to="driver/profile/")
    cpn = models.CharField(max_length=13, validators=[MinLengthValidator(13), MaxLengthValidator(13)])
    phone_number = models.CharField(max_length=15)
    created_on = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    current_location = PointField(null=True, blank=True)