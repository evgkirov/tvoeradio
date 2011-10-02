import os
here = lambda * x: os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)

show_as_revision = True


def get_version():
    try:
        from mercurial import ui, hg
        repo = hg.repository(ui.ui(), here('..'))
        rev = repo.filectx(repo.root, 'tip').rev()
        if show_as_revision:
            return 'r%s' % rev
        return '%s.%s' % (rev / 10, rev % 10)
    except:
        return 'unknown version'

VERSION = get_version()
