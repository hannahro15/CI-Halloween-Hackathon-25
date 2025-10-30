from django.shortcuts import render

def cat_adoption(request):
    """List all available cats for adoption"""
    return render(request, 'main-app.html')

