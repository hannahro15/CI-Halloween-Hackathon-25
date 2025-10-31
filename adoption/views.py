from django.shortcuts import render

def cat_adoption(request):
    """List all available cats for adoption"""
    return render(request, 'main-app.html')

def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def team_page(request):
    return render(request, 'team-page.html')