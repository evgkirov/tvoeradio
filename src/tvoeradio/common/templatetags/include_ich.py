# based on http://djangosnippets.org/snippets/1684/

from django import template
from django.template.loaders.app_directories import _loader
from os.path import basename

register = template.Library()


def do_include_ich(parser, token):
    bits = token.split_contents()
    template_name = bits[1]
    if template_name[0] in ('"', "'") and template_name[-1] == template_name[0]:
        template_name = template_name[1:-1]

    block_name, block_type = basename(template_name).rsplit('.', 1)
    source, path = _loader.load_template_source(template_name)

    render = '<script id="tpl_%s" type="text/%s">\n%s\n</script>' % (block_name, block_type, source)

    if 'partial' in bits:
        render += '<script id="tpl_partial_%s" type="text/%s" class="partial">\n%s\n</script>' % (block_name, block_type, source)

    return template.TextNode(render)
register.tag("include_ich", do_include_ich)
