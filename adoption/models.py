from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.
class Cat(models.Model):
    name = models.CharField(max_length=100, default="CatName")
    age = models.IntegerField(default=1)
    breed = models.CharField(max_length=100, default="CatBreed")
    speciality = models.CharField(max_length=100, default="CatSpecial")
    biography = models.TextField(max_length=400, default="CatBio")
    image = CloudinaryField('image', default='placeholder')
    distance = models.IntegerField(default=0)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}"

class CandidateList(models.Model):
    cat = models.ForeignKey(Cat, on_delete=models.CASCADE, related_name="candidatecat")
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.cat.id}"
   