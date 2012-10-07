from fabric.api import *

env.hosts = ['lithium.locum.ru']
env.user = 'hosting_extractor'

project_dir = '/home/hosting_extractor/projects/tvoeradio'
repo_dir = '%s/app' % project_dir
python_path = '%s/venv/bin/python' % project_dir
pip_path = '%s/venv/bin/pip' % project_dir


def deploy():
    with cd(repo_dir):
        run('hg pull')
        run('hg update')
        run('%s install -r requirements.txt' % pip_path)
        run('%s manage.py syncdb' % python_path)
        run('%s manage.py migrate' % python_path)
        # run('%s manage.py update_top' % python_path)
        run('%s manage.py generatemedia' % python_path)
        run('cp %s/tvoeradio/static/js/3rdparty/jplayer/Jplayer.swf %s/static/gen/js/3rdparty/jplayer/ -v' % (repo_dir, project_dir))
    with cd(project_dir):
        run('touch django.wsgi')
