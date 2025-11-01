from django.urls import path
from . import views

urlpatterns = [
    #path('', views.cat_adoption, name='cat-adoption'),
    path('', views.CatAdoption.as_view(), name='cat-adoption'),
    path('index/', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('tips/', views.tips, name='tips'),
    path('contact/', views.contact, name='contact'),
]
