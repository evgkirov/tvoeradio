from django import forms

from .models import RecentStation


class RecentStationForm(forms.ModelForm):

    class Meta:
        fields = ('type', 'name')
        model = RecentStation
