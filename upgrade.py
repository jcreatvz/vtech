from bs4 import BeautifulSoup
from pathlib import Path
import copy
root=Path(__file__).parent
s=BeautifulSoup((root/'dist/index.html').read_text(),'html.parser')
for el in s.select('.original-screen,.hero-fallback'):el.decompose()
for l in s.select('link[rel="preload"][as="image"]'):
 if 'side-logo' in l.get('href','') or 'photo-1460925895917' in l.get('href',''):l.decompose()
visual=s.select_one('#hero-visual')
visual['data-state']='idle'
canvas=visual.select_one('canvas');canvas['aria-hidden']='true';canvas.attrs.pop('role',None)
status=visual.select_one('#scene-status');status['class']=['scene-status'];status.string='Interactive 3D'
bar=s.new_tag('div');bar['class']=['scene-toolbar'];bar['data-ui']='true'
bar.append(s.select_one('#scene-toggle').extract())
expand=s.new_tag('button',type='button',id='scene-expand');expand.string='Expand canvas';expand['aria-label']='Expand the Spline canvas';bar.append(expand)
a=s.new_tag('a',href='https://my.spline.design/vtechn-UQCPEEbEaNxbvrPfKkg2JdcY/',target='_blank',rel='noopener noreferrer');a.string='Open scene';bar.append(a)
visual.append(bar)
# Preserve the same canvas/runtime when entering the expanded view.
fullscreen=BeautifulSoup('<dialog id="scene-dialog" aria-label="Expanded Spline canvas"><button class="dialog-close" type="button" aria-label="Close expanded canvas"><span></span><span></span></button><div id="expanded-scene-mount"></div></dialog>','html.parser').dialog
s.body.append(fullscreen)
# Full-screen navigation uses the same original destinations and copy.
menu=BeautifulSoup('''<dialog id="mobile-menu" aria-labelledby="menu-title"><div class="menu-shell"><div class="menu-top"><div class="menu-brand"></div><span id="menu-title">Navigation</span><button type="button" class="dialog-close" aria-label="Close navigation"><span></span><span></span></button></div><div class="menu-body"><div class="menu-primary"><div role="tablist" aria-label="Navigation categories" aria-orientation="vertical"></div><a href="https://vtechno.ca/portfolio">Portfolio</a><a href="https://vtechno.ca/contact">Contact Us</a></div><div class="menu-secondary"></div></div><div class="menu-bottom"><a href="mailto:contact@vtechno.ca">contact@vtechno.ca</a><a href="tel:+1 (306) 999-2108">+1 (306) 999-2108</a><span>Versatile Techno</span></div></div></dialog>''','html.parser').dialog
logo=copy.deepcopy(s.select_one('header .vt-nav>div:first-child>a'));menu.select_one('.menu-brand').append(logo)
for i,d in enumerate(s.select('.nav-dropdown')):
 name=d.summary.get_text(strip=True)
 btn=s.new_tag('button',type='button',id=f'menu-tab-{i}',role='tab');btn['aria-controls']=f'menu-panel-{i}';btn['aria-selected']='true' if i==0 else 'false';btn['tabindex']='0' if i==0 else '-1';btn.string=name
 menu.select_one('[role="tablist"]').append(btn)
 panel=s.new_tag('div',id=f'menu-panel-{i}',role='tabpanel');panel['aria-labelledby']=f'menu-tab-{i}'
 if i:panel['hidden']=''
 for a in d.select('.nav-panel>a'):panel.append(copy.deepcopy(a))
 menu.select_one('.menu-secondary').append(panel)
s.body.append(menu)
s.select_one('#menu-toggle')['aria-controls']='mobile-menu'
s.select_one('#menu-toggle')['aria-haspopup']='dialog'
# Fixed cards, full reviews in a deliberate dialog, no hover reflow.
track=s.select_one('#testimonials .animate-marquee');track['id']='review-track';track['aria-label']='Client reviews';track['tabindex']='0'
for i,a in enumerate(list(track.find_all('a',recursive=False))):
 a['class'].append('review-card')
 if i>=5:
  a['aria-hidden']='true';a['tabindex']='-1'
  shell=s.new_tag('article');shell['class']=['review-shell'];shell['aria-hidden']='true';a.wrap(shell)
  continue
 shell=s.new_tag('article');shell['class']=['review-shell'];a.wrap(shell)
 button=s.new_tag('button',type='button');button['class']=['read-review'];button['data-review']=str(i);button['data-ui']='true';button.string='Read full review';button['aria-haspopup']='dialog';shell.append(button)
controls=BeautifulSoup('<div class="review-controls" data-ui="true"><button type="button" id="reviews-prev" aria-label="Previous reviews"><i></i></button><span>01 / 05</span><button type="button" id="reviews-next" aria-label="Next reviews"><i></i></button></div>','html.parser').div
s.select_one('#testimonials>div:first-child').append(controls)
review=BeautifulSoup('<dialog id="review-dialog" aria-labelledby="review-author"><div class="review-dialog-top"><h2 id="review-author"></h2><button class="dialog-close" type="button" aria-label="Close review"><span></span><span></span></button></div><p id="review-text"></p><a id="review-source" target="_blank" rel="noopener noreferrer">View on Google</a></dialog>','html.parser').dialog
s.body.append(review)
style=s.new_tag('link',rel='stylesheet',href='assets/immersive.css');s.head.append(style)
(root/'dist/index.html').write_text(str(s).replace('viewbox=','viewBox='))
