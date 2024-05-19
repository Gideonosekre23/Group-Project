# Paddleplus/urls.py
from django.contrib import admin
from django.urls import path, include
import debug_toolbar

from customers import views as customer_views
from Driver import views as driver_views
from Bike import views as bike_views
from Riderequest import views as riderequest_views
from Trip import views as trip_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    
    path('customer/', customer_views.customer_list),
    path('token_valid/', customer_views.check_token_validity),
    path('Register/', customer_views.register_user),
    path('Login/', customer_views.Login_user),
    path('Logout/', customer_views.Logout_user),
    path('Search/<str:username>/', customer_views.search_user_profile),
    path('Remove/', customer_views.delete_user_profile),
    path('Update/', customer_views.update_user_profile),
    
    path('LoginDriver/', driver_views.Login_driver),
    path('LogoutDriver/', driver_views.Logout_driver),
    path('UpdateDriver/', driver_views.update_driver_profile),
    path('DeleteDriver/', driver_views.delete_driver_profile),
    path('SearchDriver/<str:username>/', driver_views.search_driver_profile),
    
    path('AcceptRideRequest/<int:request_id>/', riderequest_views.accept_ride_request),
    path('RequestRide/', riderequest_views.request_ride),
    path('DeclineRideRequest/<int:request_id>/', riderequest_views.decline_ride_request),
    # path('UpdateLocation/', riderequest_views.update_location),
    
    path('AddBike/', bike_views.add_bike),
    path('MakeBikeAvailable/<int:bike_id>/', bike_views.make_bike_available),
    path('GetAvailableBikes/', bike_views.get_available_bikes),
    
    path('SearchForRide/', bike_views.search_for_ride),
]
