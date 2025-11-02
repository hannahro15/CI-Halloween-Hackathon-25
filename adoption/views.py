import json

from django.contrib.auth.decorators import login_required
from .models import Cat, CandidateList, UserProfile
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views import generic
from .forms import ContactForm

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

def team_page(request):
    return render(request, 'team-page.html')

def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save() 
            return redirect('thank-you')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})

def thank_you(request):
    return render(request, 'thank_you.html')

def tips(request):
    """Render the Tips & Spells page"""
    return render(request, 'tips.html')

@login_required
def profile_view(request):
    """ Distpaly user profile with adopted cats"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)

    adopted_cats = candidate_list.cat.all()

    # Get JSON for JS cards that display cats
    adopted_cats_json = json.dumps([
        {
            "id": c.id,
            "name": c.name,
            "age": c.age,
            "breed": c.breed,
            "speciality": c.speciality,
            "biography": c.biography,
            "image_url": c.image.url if getattr(c, "image", None) else "/static/images/placeholder.png"
        }
        for c in adopted_cats
    ])

    context = {
        'profile': profile,
        'adopted_cats':adopted_cats,
        'adopted_cats_json': adopted_cats_json,
    }
    return render(request, 'user-profile.html', context)



def add_to_list(request, cat_id):
    """
    add a cat to the user's candidatelist — called by static/js/cardscript.js
    POST to /add_to_list/<cat_id>/ (no JSON body required)
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "authentication required"}, status=403)

    cat = get_object_or_404(Cat, pk=cat_id)

    # Get or create the CandidateList for this user, then add the cat to the M2M
    candidate_list, created = CandidateList.objects.get_or_create(user=request.user)

    # avoid duplicates: only add if not already present
    added = False
    if not candidate_list.cat.filter(pk=cat.pk).exists():
        candidate_list.cat.add(cat)
        added = True

    return JsonResponse({
        "ok": True,
        "candidate_list_created": created,
        "cat_added": added,
        "cat_id": cat_id,
    })

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

def page_404(request):
    return render(request, '404.html')

def page_500(request):
    return render(request, '500.html')