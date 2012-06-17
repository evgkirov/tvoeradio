from django import template


register = template.Library()


@register.filter
def reorder_letters(value):
    value2 = ''
    for i in xrange(0, len(value), 2):
        value2 += value[i + 1] + value[i]
    return value2
