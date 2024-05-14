"""
URL configuration for Paddleplus project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path ,include
import debug_toolbar
from customers import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("__debug__/", include("debug_toolbar.urls")),
    path('customer/',views.customer_list),
    path('Register/',views.register_user),
    path('Login/',views.Login_user),
    path('Logout/',views.Logout_user),
    path('Search/<str:username>/',views.search_user_profile),
    path('Remove/',views.delete_user_profile),
    path('Update/',views.update_user_profile),
    path('LoginDriver/',views.Login_driver),
    path('LogoutDriver/',views.Logout_driver),
    path('UpdateDriver/',views.update_driver_profile),
    path('DeleteDriver/',views.delete_driver_profile),
    path('SearchDriver/<str:username>/',views.search_driver_profile),
    path('AcceptRideRequest/<int:request_id>/',views.accept_ride_request),
    path('RequestRide/',views.request_ride),
    path('DeclineRideRequest/<int:request_id>/',views.decline_ride_request),
    path('UpdateLocation/',views.update_location),
    path('AddBike/',views.add_bike),
    path('MakeBikeAvailable/<int:bike_id>/',views.make_bike_available),
    path('GetAvailableBikes/',views.get_available_bikes),
    path('SearchForRide/',views.search_for_ride),
    

]
