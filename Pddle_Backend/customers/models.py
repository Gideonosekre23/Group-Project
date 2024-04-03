from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cpn = models.CharField(max_length=13, validators=[MinLengthValidator(13), MaxLengthValidator(13)])
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    is_subscribed_to_newsletter = models.BooleanField(default=False)
    is_bike_owner = models.BooleanField(default=False)


# class Trip(models.Model):
#     renter = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='trips_taken')
#     bike_owner= models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='trips_given')
#     bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
#     trip_date = models.DateField()
#     origin = models.CharField(max_length=100)
#     destination = models.CharField(max_length=100)
#     distance = models.DecimalField(max_digits=10, decimal_places=2)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     payment_type = models.CharField(max_length=100)  # Assuming payment type can be a string
#     trip_canceled = models.BooleanField(default=False)


# class TripHistory(models.Model):
#     renter = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='trips_taken')
#     bike_owner= models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='trips_given')
#     bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
#     trip_date = models.DateField()
#     origin = models.CharField(max_length=100)
#     destination = models.CharField(max_length=100)
#     distance = models.DecimalField(max_digits=10, decimal_places=2)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     payment_type = models.DecimalField(max_digits=10, decimal_places=2)
#     # image every trip was not cancelled 
#     trip_canceled = models.BooleanField(default=False)                        
    
    

# class Bike(models.Model):
#     owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='bikes_owned')
#     brand = models.CharField(max_length=100)
#     model = models.CharField(max_length=100)
#     color = models.CharField(max_length=50)
#     size = models.CharField(max_length=20)
#     year = models.PositiveIntegerField()
#     description = models.TextField(blank=True)
#     is_available = models.BooleanField(default=True)