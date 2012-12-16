from django import template
from os.path import basename

register = template.Library()


@register.inclusion_tag('include_ich.html')
def include_ich(tpl, partial=False):
    return {
        "template_name": basename(tpl).rsplit('.', 1)[0],
        "template": tpl,
        "partial": partial
    }
