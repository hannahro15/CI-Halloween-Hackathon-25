from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.cat_adoption, name='cat-adoption'),
    path('', include('adoptioncats.urls'))
]