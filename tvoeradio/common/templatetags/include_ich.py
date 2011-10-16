# based on http://djangosnippets.org/snippets/1684/

from django import template
from django.template.loaders.app_directories import load_template_source
from os.path import basename

register = template.Library()


def do_include_ich(parser, token):
    bits = token.split_contents()
    if len(bits) != 2:
        raise TemplateSyntaxError, "%r tag takes one argument: the name of the template to be included" % bits[0]

    template_name = bits[1]
    if template_name[0] in ('"', "'") and template_name[-1] == template_name[0]:
        template_name = template_name[1:-1]

    block_name, block_type = basename(template_name).rsplit('.', 1)
    source, path = load_template_source(template_name)

    source = '<script id="tpl_%s" type="text/%s">%s</script>' % (block_name, block_type, source)

    return template.TextNode(source)
register.tag("include_ich", do_include_ich)