from bs4 import BeautifulSoup
from urllib.parse import urljoin
from pathlib import Path
import re,json
root=Path(__file__).parent
s=BeautifulSoup((root/'reference/original.html').read_text(),'html.parser')
# Keep server-rendered content and metadata; private preview does not impersonate the Next.js backend.
for t in s.find_all('script'): t.decompose()
for t in s.select('link[as="script"]'): t.decompose()
for t in s.find_all('style'):
 if 'visibility: hidden' in t.text:t.decompose()
for t in s.select('link[rel="stylesheet"]'): t['href']='assets/original.css'
for t in s.find_all(True):
 for attr in ['src','href']:
  if t.has_attr(attr) and t[attr].startswith('/'):
   t[attr]=urljoin('https://vtechno.ca',t[attr])
for img in s.find_all('img'):
 if img.get('src','').endswith('/api/images/logo.png'):img['src']='assets/logo.png'
 if img.get('src','').endswith('/api/images/side-logo.png'):img['src']='assets/hero-original.png'
 img['decoding']='async'
 if img.get('alt')!='Logo':img['loading']='lazy'
# Match Cloudflare's client-side decoding, preserving the published email.
for t in s.select('[data-cfemail]'):
 b=bytes.fromhex(t['data-cfemail']);email=''.join(chr(x^b[0]) for x in b[1:]);t.string=email
 a=t.find_parent('a')
 if a:a['href']='mailto:'+email
sections=s.find_all('section')
for t,name in zip(sections,['hero','partners','services','projects','stats','process','advantage','testimonials','faq','contact-cta']):t['id']=name;t['class'].append('vt-section')
hero=sections[0]; rows=hero.find_all('div',recursive=False); row=rows[1];row['class'].append('hero-layout')
copy,visual=row.find_all('div',recursive=False);copy['class'].append('hero-copy');visual['class']=['hero-visual'];visual['id']='hero-visual'
img=visual.find('img');img['class']=['hero-fallback'];img['alt']='Versatile Techno globe held in a hand';img['width']='560';img['height']='560'
canvas=s.new_tag('canvas',id='spline-canvas');canvas['aria-label']='Interactive Versatile Techno 3D scene';canvas['role']='img';visual.append(canvas)
control=s.new_tag('button',id='scene-toggle');control['class']=['scene-toggle'];control['type']='button';control['aria-label']='Load interactive 3D scene';control.string='View in 3D';visual.append(control)
status=s.new_tag('span',id='scene-status');status['class']=['sr-only'];status['role']='status';status['aria-live']='polite';visual.append(status)
rows[2]['class'].append('original-screen')
# Semantic hooks leave the original service variants and all original copy intact.
services=sections[2]
for t in services.find_all('div',recursive=False)[1:]:t['class'].append('service-layout')
for layout in services.select('.service-layout'):
 for card in layout.find_all('div',recursive=False):card['class'].append('service-card')
# Make preview navigation work without retaining opaque compiled application bundles.
nav=s.select_one('header nav');nav['class'].append('vt-nav')
for b in nav.select('button'):
 name=b.get_text(' ',strip=True)
 if name not in ['Services','Company']:continue
 detail=s.new_tag('details');detail['class']=['nav-dropdown'];summary=s.new_tag('summary');summary.string=name
 detail.append(summary);panel=s.new_tag('div');panel['class']=['nav-panel']
 if name=='Services':
  items=[('Smart Home / Office','/services/automation','Automate and secure your living & workspaces'),('App Development','/services/software','Bespoke web, mobile, and API solutions'),('CCTV Installations','/services/security','Advanced surveillance and security systems'),('Cloud Services','/services/it-support','Scalable cloud infrastructure and hosting'),('Website Hosting','/services/hosting','Reliable and secure website hosting'),('And Many More....','/contact','Contact Us to figure out a custom solution for you')]
 else:items=[('About Us','/about','Learn more about our story and team'),('Customer Stories','/customer-stories','See how we’ve helped our clients succeed'),('Partnerships','/partnerships','Collaborate with us for mutual growth'),('Careers','/careers',''),('Contact Us','/contact','')]
 for title,href,desc in items:
  a=s.new_tag('a',href='https://vtechno.ca'+href);strong=s.new_tag('strong');strong.string=title;a.append(strong)
  if desc:p=s.new_tag('span');p.string=desc;a.append(p)
  panel.append(a)
 if name=='Services':
  foot=s.new_tag('div');foot['class']=['nav-panel-footer'];foot.string='Interested? ';a=s.new_tag('a',href='https://vtechno.ca/contact');a.string='Schedule a call';foot.append(a);panel.append(foot)
 detail.append(panel);b.replace_with(detail)
# Remove the original empty mobile menu trigger in favor of the accessible disclosure.
for b in nav.select('button'):b.decompose()
mainnav=nav.select_one('[aria-label="Main"]')
if mainnav:
 mainnav['id']='main-nav';mainnav['class'].append('main-nav')
 toggle=s.new_tag('button',type='button',id='menu-toggle');toggle['aria-label']='Open navigation';toggle['aria-controls']='main-nav';toggle['aria-expanded']='false';toggle.append(BeautifulSoup('<span></span><span></span>','html.parser'));nav.append(toggle)
# Existing FAQ copy, native disclosure state.
for i,b in enumerate(sections[8].find_all('button')):
 b['aria-expanded']='true' if i==0 else 'false';b['aria-controls']=f'faq-answer-{i}'
 answer=b.find_next_sibling('div');answer['id']=f'faq-answer-{i}';answer['class'].append('faq-answer')
 answer['hidden']=True if i else False
 if i==0: del answer['hidden']
# Published counter values observed after scrolling the live homepage.
for el,val in zip(s.select('#stats .tabular-nums'),['150','99.9','24','50']):el.contents[0].replace_with(val)
# Keep source SEO untouched; preview remains owner-private.
css=s.new_tag('link',rel='stylesheet',href='assets/redesign.css');s.head.append(css)
js=s.new_tag('script',src='assets/redesign.js',type='module');s.body.append(js)
# HTMLParser lowercases SVG attribute names; restore their required case.
html=str(s).replace('viewbox=','viewBox=').replace('preserveaspectratio=','preserveAspectRatio=')
(root/'dist/index.html').write_text(html)
c=(root/'dist/assets/original.css').read_text();c=re.sub(r'url\(\.\./media/([^\)]+)\)',r'url(https://vtechno.ca/_next/static/media/\1)',c)
(root/'dist/assets/original.css').write_text(c)

# Apply the requested immersive layout changes after regenerating the baseline.
exec((root/'upgrade.py').read_text())
