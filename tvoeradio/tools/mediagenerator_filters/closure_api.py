from django.conf import settings
from mediagenerator.generators.bundles.base import Filter

COMPILATION_LEVEL = getattr(settings, 'CLOSURE_COMPILATION_LEVEL',
                            'SIMPLE_OPTIMIZATIONS')

class ClosureAPI(Filter):
    def __init__(self, **kwargs):
        self.config(kwargs, compilation_level=COMPILATION_LEVEL)
        super(ClosureAPI, self).__init__(**kwargs)
        assert self.filetype == 'js', (
            'Closure only supports compilation to js. '
            'The parent filter expects "%s".' % self.filetype)

    def get_output(self, variation):
        # We import this here, so App Engine Helper users don't get import
        # errors.
        #from subprocess import Popen, PIPE

        import urllib
        import urllib2
        url = 'http://closure-compiler.appspot.com/compile'
        for input in self.get_input(variation):
            values = {
                'js_code': input,
                'compilation_level': COMPILATION_LEVEL,
                'output_format': 'text',
                'output_info': 'compiled_code'
            }
            #response = urllib2.urlopen('http://closure-compiler.appspot.com/compile')
            data = urllib.urlencode(values)
            req = urllib2.Request(url, data)
            response = urllib2.urlopen(req)
            yield response.read()
            

