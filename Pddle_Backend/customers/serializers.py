# this is to take the model from an abject to json
from rest_framework import serializers
from .models import UserProfile
class UserProfileSerializer(serializers.ModelSerializer) :
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model= UserProfile
        fields =  ['username', 'email', 'address', 'phone_number']
