from django.db import models

# Create your models here.
class Cat(models.Model):
    name = models.CharField(max_length=100, default="CatName")
    age = models.IntegerField(default=1)
    breed = models.CharField(max_length=100, default="CatBreed")
    speciality = models.CharField(max_length=100, default="CatSpecial")
    biography = models.TextField(max_length=400, default="CatBio")
    image = models.ImageField(upload_to='cat_images/')

class CandidateList(models.Model):
    cat = models.ForeignKey(Cat, on_delete=models.CASCADE)
   