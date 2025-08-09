from django.urls import path, include

app_name = 'api'

urlpatterns = [
    path('auth/', include('users.urls')),
    path('', include('transfers.urls')),
]
