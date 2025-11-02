from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import UserProfile, CandidateList

@receiver(user_signed_up)
def create_profile_on_signed_up(request, user, **kwargs):
    UserProfile.objects.get_or_create(user=user)
    CandidateList.objects.get_or_create(user=user)
