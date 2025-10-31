from django.shortcuts import render
from django.views import generic
from .models import Cat

class CatAdoption(generic.ListView):
    """
    Displays a basic list of all cats.
    """
    queryset = Cat.objects.all()
    template_name = 'main-app.html'

def cat_adoption(request):
    """List all available cats for adoption"""
    return render(request, 'main-app.html')

def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')