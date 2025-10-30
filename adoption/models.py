from django.db import models

# Create your models here.
class Cat(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)
    biography = models.TextField()
    image = models.ImageField(upload_to='cat_images/')

class CandidateList(models.Model):
    cat = models.ForeignKey(Cat, on_delete=models.CASCADE)
   