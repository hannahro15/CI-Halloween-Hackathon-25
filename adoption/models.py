from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def get_adopted_cats(self):
        rreturn Cat.objects.filter(candidate_lists__user=self.user)# Returns all adopted cats

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
    # one CandidateList owned by a single User
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="candidate_list"
    )

    # the list of cats in this user's candidate list
    cat = models.ManyToManyField(Cat, related_name="candidate_lists", blank=True)

    def __str__(self):
        return f"{self.user.username} | Cat Count: {self.cat.count()}"
   