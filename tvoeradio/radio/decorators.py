import httpagentparser
from django.shortcuts import render_to_response
from django.template import RequestContext


def noie7(view):
    def _wrap(request, *args, **kwargs):
        ua = request.META.get('HTTP_USER_AGENT')
        no_ua_check = request.GET.get('no_ua_check', False)
        if ua and not no_ua_check:
            info = httpagentparser.detect(ua)
            browser = info.get('browser', {})
            if browser.get('name') == 'Microsoft Internet Explorer':
                try:
                    version = int(browser.get('version').split('.')[0])
                except:
                    version = 8
                if version < 8:
                    cd = {}
                    cd['version'] = version
                    cd['ignore_url'] = ''.join([
                        request.get_full_path(),
                        '&' if '?' in request.get_full_path() else '?',
                        'no_ua_check=1'
                    ])
                    return render_to_response('radio/badbrowser.html', cd, context_instance=RequestContext(request))
        return view(request, *args, **kwargs)
    return _wrap
