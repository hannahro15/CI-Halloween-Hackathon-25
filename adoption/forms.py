from django import forms
from .models import ContactMessage

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']
        labels = {
            'name': 'Your Witchy Name',
            'email': 'Spirit Channel (Email)',
            'message': 'Message to the Coven',
        }
        widgets = {
            'message': forms.Textarea(attrs={'rows': 5}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name, field in self.fields.items():
            field.widget.attrs.update({
                'class': 'form-control',
                'placeholder': f'Enter your {field_name}...',
            })

        self.fields['message'].widget.attrs.update({
            'placeholder': 'Type your mystical message here...',
        })