from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from .models import Cat, CandidateList, UserProfile, ContactMessage
# Register your models here.
@admin.register(Cat)
class CatAdmin(SummernoteModelAdmin):
    """
    Lists fields for display in admin, filled for search.
    Field filters, fields to prepopulate and rich-text editor
    """
    list_display = (
        'id',
        'name',
        'age',
        'speciality',
    )
    search_fields = ['name', 'speciality',]
    list_filter = ('id', 'age',)
    summernote_fields = ('biography',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')

admin.site.register(CandidateList)
admin.site.register(UserProfile)