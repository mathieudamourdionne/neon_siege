import glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
h = open('head.html').read(); js = '\n'.join(open(f).read() for f in sorted(glob.glob('src/*.js')))
open('dist/index.html', 'w').write(h.replace('/*__JS__*/', js)); print('built', len(js))
