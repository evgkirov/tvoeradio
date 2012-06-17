import os
here = lambda * x: os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)


def get_version():
    try:
        from mercurial import ui, hg
        repo = hg.repository(ui.ui(), here('..'))
        rev = repo.filectx(repo.root, 'tip').rev()
        return 'r%s' % rev
    except:
        return 'unknown'

VERSION = get_version()
