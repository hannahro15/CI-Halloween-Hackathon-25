from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views import generic

from .models import Cat, CandidateList

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

def tips(request):
    """Render the Tips & Spells page"""
    return render(request, 'tips.html')

def team_page(request):
    return render(request, 'team-page.html')

def api_cats(request):
    """
    GET /api/cats/ — return a JSON list of cats for the frontend JS to render.
    """
    cats = Cat.objects.all().order_by('name')
    data = []
    for c in cats:
        data.append({
            "id": c.id,
            "name": c.name,
            "age": c.age,
            "breed": c.breed,
            "speciality": c.speciality,
            "biography": c.biography,
            "image_url": c.image.url if getattr(c, "image", None) else None,
            "distance": c.distance,
        })
    return JsonResponse({"cats": data})