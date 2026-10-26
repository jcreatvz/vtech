from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
import json,re
root=Path(__file__).parent
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.sections=[];self.current=None;self.stack=[];self.meta={};self.title='';self.in_title=False;self.links=set();self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='section':self.current=[]
  if tag=='meta' and (a.get('name') or a.get('property')):self.meta[a.get('name') or a.get('property')]=a.get('content')
  if tag=='title':self.in_title=True
  if tag=='a' and a.get('href'):self.links.add(a['href'])
  suppressed=bool(a.get('data-ui') is not None or a.get('id')=='scene-status' or (self.stack and self.stack[-1][1]))
  if tag not in VOID:self.stack.append((tag,suppressed))
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:del self.stack[i:];break
  if tag=='section' and self.current is not None:
   self.sections.append(' '.join(' '.join(self.current).split()));self.current=None
 def handle_data(self,data):
  if self.in_title:self.title+=data
  if self.current is not None and not any(s for _,s in self.stack):self.current.append(data)
def read(path):
 p=Page();p.feed(Path(path).read_text());return p
before=read(root/'reference/original.html');after=read(root/'dist/index.html')
assert len(before.sections)==len(after.sections)==10
expected=list(before.sections)
for i,(a,b) in enumerate(zip(expected,after.sections)):
 if i==4:
  for value in ('150','99.9','24','50'):assert value in b,f'Missing live stats value {value}'
 else:assert a==b,f'Content mismatch in section {i}: {a[:100]!r} != {b[:100]!r}'
assert before.title==after.title
assert before.meta==after.meta
for href in before.links:
 if '/cdn-cgi/l/email-protection' in href:continue
 assert urljoin('https://vtechno.ca',href) in after.links,f'Missing link {href}'
assert 'mailto:contact@vtechno.ca' in after.links
html=Path(root/'dist/index.html').read_text()
assert 'original-screen' not in html and 'hero-fallback' not in html
assert {'mobile-menu','review-dialog'} <= after.ids
assert html.count('class="review-shell"')==5
assert html.count('review-card')==10
print('PASS: homepage copy, metadata, contact/link destinations, full-screen dialogs, fallback/strip removal, and review cards.')
