from django.urls import path
from . import views

urlpatterns = [
    #path('', views.cat_adoption, name='cat-adoption'),
    path('', views.CatAdoption.as_view(), name='cat-adoption'),
    path('index/', views.index, name='index'),
    path('team-page/', views.team_page, name='team-page'),
    path('tips/', views.tips, name='tips'),
    path('contact/', views.contact, name='contact'),
    path('add_to_list/<int:cat_id>/', views.add_to_list, name='add-to-list'),
    path('404/', views.page_404, name='404-page'),
    path('500/', views.page_500, name='500-page'),

    # API endpoint used by cardscript.js
    path('api/cats/', views.api_cats, name='api-cats'),
]
