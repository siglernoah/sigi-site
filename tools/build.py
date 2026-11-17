# Generates the five HTML pages from shared parts (nav, footer, etc.). Run: python3 tools/build.py
import os, urllib.parse
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root

def mark(lg=False, cls=''):
    c = ('mark lg ' + cls).strip() if lg else ('mark ' + cls).strip()
    return (f'<svg class="{c}" viewBox="0 0 32 34" aria-hidden="true">'
            '<path class="band" fill-rule="evenodd" d="M16 10.4a10.6 10.6 0 1 1 0 21.2a10.6 10.6 0 1 1 0-21.2zM16 14.2a7.4 7.4 0 1 0 0 14.8a7.4 7.4 0 1 0 0-14.8z"/>'
            '<rect class="face" x="5.5" y="1.5" width="21" height="15.5" rx="4.6"/>'
            '<rect class="bevel" x="7.6" y="3.6" width="16.8" height="11.3" rx="3"/>'
            '<g class="cmdg"><path class="cmd" pathLength="1" d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" transform="translate(16 9.25) scale(.46) translate(-12 -12)"/></g></svg>')
MARK = mark()

FAV = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#13213C'/>"
       "<g transform='translate(4.8 3.1) scale(1.7)'>"
       "<path fill='#F3EDE2' fill-rule='evenodd' d='M16 10.4a10.6 10.6 0 1 1 0 21.2a10.6 10.6 0 1 1 0-21.2zM16 14.2a7.4 7.4 0 1 0 0 14.8a7.4 7.4 0 1 0 0-14.8z'/>"
       "<rect x='5.5' y='1.5' width='21' height='15.5' rx='4.6' fill='#F3EDE2' stroke='#13213C' stroke-width='2.2' paint-order='stroke'/>"
       "<path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' transform='translate(16 9.25) scale(.5) translate(-12 -12)' fill='none' stroke='#FF6F61' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></g></svg>")
FAV_URI = 'data:image/svg+xml,' + urllib.parse.quote(FAV, safe="/:=' ")

ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
EXT = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 8.5l5-5M4.5 3.5h4v4"/></svg>'
CHECK = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9.5l4 4 8-9"/></svg>'
PLUS = '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M11 3v16M3 11h16"/></svg>'

def btn(label, href, cls='', arrow=True, attrs=''):
    return (f'<a class="btn {cls}" href="{href}" data-magnetic{attrs}><span class="tw"><span class="t">{label}</span></span>'
            + (ARROW if arrow else '') + '</a>')

def head(title, desc, page):
    full = 'Signet Works — Professional websites for businesses' if page == 'home' else f'{title} — Signet Works'
    return f'''<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#13213C">
<link rel="icon" href="{FAV_URI}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,500&amp;family=Inter:wght@400..800&amp;display=swap" rel="stylesheet">
<script>
(function(d){{var r=d.documentElement,c=r.classList;c.add('js');
try{{var t=localStorage.getItem('sw-theme');if(t==='light'||t==='dark')r.setAttribute('data-theme',t)}}catch(e){{}}
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)c.add('rm');
try{{if(!rm&&!sessionStorage.getItem('sw-intro'))c.add('intro')}}catch(e){{}}}})(document);
</script>
<link rel="stylesheet" href="css/site.css">
</head>
<body data-page="{page}">
<a class="skip" href="#main">Skip to content</a>
<div id="intro" aria-hidden="true"><div class="lock"><span class="word"><span>Signet</span></span>{mark(lg=True)}<span class="word"><span>Works</span></span></div><div class="bar"></div></div>
<div id="progress" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><b>View</b></div>
'''

THEME_BTN = ('<button class="theme" type="button" aria-pressed="false" aria-label="Switch to light theme"><span class="knob"></span>'
             '<svg class="moon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7z"/></svg>'
             '<svg class="sun" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1"/></svg></button>')

def nav():
    return f'''<header class="nav" id="nav">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="Signet Works home"><span>Signet</span>{MARK}<span>Works</span></a>
    <nav class="links" aria-label="Primary">
      <span class="pill-ind"></span>
      <a class="l" href="services.html" data-nav="services">Services</a>
      <a class="l" href="work.html" data-nav="work">Work</a>
      <a class="l" href="about.html" data-nav="about">About</a>
    </nav>
    <div class="nav-r">
      {THEME_BTN}
      {btn('Start a project', 'start.html', arrow=False, attrs=' data-nav="start"')}
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><em>Menu</em><span class="lines" aria-hidden="true"></span><span class="skip">Open menu</span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <nav aria-label="Menu">
    <a href="index.html" data-nav="home">Home <small>01</small></a>
    <a href="services.html" data-nav="services">Services <small>02</small></a>
    <a href="work.html" data-nav="work">Work <small>03</small></a>
    <a href="about.html" data-nav="about">About <small>04</small></a>
    <a href="start.html" data-nav="start">Start a project <small>05</small></a>
  </nav>
  <div class="menu-foot"><a href="mailto:hello@sigi.com">hello@sigi.com</a><span>© <span class="year">2026</span> Signet Works</span></div>
</div>
'''

def band(title='Have a business that <em>needs a website?</em>'):
    return f'''<section class="band-cta">
  {mark(lg=True, cls='ghost-mark')}
  <div class="wrap inner">
    <h2 data-split>{title}</h2>
    {btn('Start a project', 'start.html', 'lg')}
  </div>
</section>
'''

def footer():
    return f'''<footer>
  <div class="wrap">
    <a class="big" href="index.html" aria-label="Signet Works home"><span class="word">Signet</span>{mark(lg=True)}<span class="word">Works</span></a>
    <div class="foot">
      <span>© <span class="year">2026</span> Signet Works</span>
      <nav aria-label="Footer"><a href="services.html">Services</a><a href="work.html">Work</a><a href="about.html">About</a><a href="start.html">Start a project</a></nav>
      <button class="top" type="button">Back to top <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 10V2M2.5 5.5L6 2l3.5 3.5"/></svg></button>
    </div>
  </div>
</footer>
<script src="js/lenis.min.js"></script>
<script src="js/site.js"></script>
</body>
</html>
'''

def page_head(kicker_no, kicker, title, lede, orb=True):
    return f'''<header class="page-head">
  {'<div class="orb a" aria-hidden="true"></div>' if orb else ''}
  <div class="wrap">
    <p class="kicker fade d0"><b>{kicker_no}</b>{kicker}</p>
    <h1 data-split data-hero>{title}</h1>
    <p class="lede fade d1">{lede}</p>
  </div>
</header>
'''

# ---------- shared content blocks ----------
SERVICES = [
  ('Design', 'A look that fits your business', 'A custom design built around your brand and your customers — not a template with your logo dropped in.',
   ['Layout &amp; visual design', 'Clear, persuasive page structure', 'Looks right on every screen']),
  ('Build', 'Fast, solid, easy to find', 'Clean code that loads quickly, works on phones, and gives search engines what they need to find you.',
   ['Responsive development', 'Search-engine basics built in', 'Contact forms, booking, maps']),
  ('Launch &amp; care', 'Live, and looked after', 'Domain, hosting and launch sorted for you — plus updates afterwards, so the site never goes stale.',
   ['Domain &amp; hosting setup', 'Redesigns of existing sites', 'Ongoing edits &amp; support']),
]

def svc_panels(link=False):
    out = []
    for i, (n, h, p, items) in enumerate(SERVICES):
        tag = 'a' if link else 'article'
        href = ' href="services.html"' if link else ''
        lis = ''.join(f'<li>{x}</li>' for x in items)
        out.append(f'<{tag} class="svc reveal"{href} style="--d:{i*120}ms"><span class="n">{n} {PLUS}</span><h3>{h}</h3><p>{p}</p><ul>{lis}</ul></{tag}>')
    return '<div class="services">' + ''.join(out) + '</div>'

FEATURE = f'''<a class="card feature reveal" href="https://medixisgroup.com" target="_blank" rel="noopener" data-cursor="Visit site">
        <div class="shot" data-tilt="2.5">
          <div class="bar"><i></i><i></i><i></i></div>
          <div class="view"><img src="img/medixis-full.jpg" alt="The medixisgroup.com website, from its homepage “Better equipment quotes. Free for clinics.” through its how-it-works section" width="1440" height="3600" decoding="async"></div>
          <span class="hint"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 2v8M2.5 6.5L6 10l3.5-3.5"/></svg>Hover to scroll</span>
        </div>
        <div class="meta">
          <div><h3>Medixis</h3><p>Medical equipment sourcing for private clinics and hospitals</p><span class="visit">medixisgroup.com {EXT}</span></div>
          <div class="tags"><span class="tag hot">Latest project</span><span class="tag">Live</span></div>
        </div>
      </a>'''

CONCEPTS = [
  ('Ember &amp; Oak', 'Restaurant · menu &amp; reservations', '#1D1A16', '#F3E9D8', '#E2733A', 'Wood-fired dinners, <em>nightly.</em>', 'Book a table'),
  ('Northside Dental', 'Clinic · services &amp; appointment requests', '#F2F7F6', '#12302D', '#1E8C7E', 'Gentle care, <em>close to home.</em>', 'Request a visit'),
  ('Harlow Builders', 'Contractor · project gallery &amp; quotes', '#F6C945', '#1B1B1B', '#1B1B1B', 'Built right, <em>the first time.</em>', 'Get a quote'),
  ('Lune Studio', 'Boutique · online store', '#EDE6F5', '#2A1F3D', '#7A4FD0', 'Handmade goods, <em>shipped with care.</em>', 'Shop the range'),
]
def concepts():
    out = []
    for i, (name, sub, bg, fg, ac, h, b) in enumerate(CONCEPTS):
        out.append(f'''<a class="card reveal" href="start.html" data-cursor="Concept" style="--d:{(i%2)*120}ms">
        <div class="shot" data-tilt="6" style="--sbg:{bg};--sfg:{fg};--ac:{ac}">
          <div class="bar"><i></i><i></i><i></i></div>
          <div class="body"><div class="snav"><b>{name}</b><span></span><span></span><span></span></div>
            <div class="shero"><h4>{h}</h4><span class="sbtn">{b}</span></div><div class="simg"></div></div>
        </div>
        <div class="meta"><div><h3>{name}</h3><p>{sub}</p></div><span class="tag">Concept</span></div>
      </a>''')
    return '\n      '.join(out)

STEPS = [('Talk', 'A short call about your business, your customers, and what the site needs to do for you.'),
         ('Design', 'You see the design before anything is built, and we refine it until it feels right.'),
         ('Build', 'The approved design becomes a real, fast website, tested on phones, tablets and desktops.'),
         ('Launch', 'The site goes live on your domain, and you get a walkthrough of how everything works.')]
def steps():
    return '<div class="steps">' + ''.join(f'<div class="step reveal" style="--d:{i*120}ms"><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(STEPS)) + '</div>'

QUOTE = 'Your website is often the first thing a customer sees. It should say, plainly and honestly, <em>“you’re in good hands.”</em>'
PROMISES = [('You work with one person', 'The person you talk to is the person building your site.'),
            ('Plain language', 'No jargon, no upsells — just what you need and why.'),
            ('A clear quote up front', 'You know the price and the scope before work begins.'),
            ('It’s yours', 'Your domain, your content, your site. No lock-in.')]
def promises():
    return '<ul class="promises reveal">' + ''.join(f'<li>{CHECK}<div><b>{b}</b><span>{s}</span></div></li>' for b, s in PROMISES) + '</ul>'

FAQ = [('How much does a website cost?', 'It depends on the size of the site and what it needs to do. After a short conversation you’ll get a fixed quote, so there are no surprises later.'),
       ('How long does it take?', 'That depends on scope and how quickly content and feedback come together. You’ll get a realistic timeline with your quote.'),
       ('I already have a website. Can you redesign it?', 'Yes. Redesigns keep what’s working, fix what isn’t, and move your existing content across.'),
       ('Do I need to write the text and supply photos?', 'Bring what you have. Signet Works can help shape the wording and advise on images so the site reads well and looks consistent.'),
       ('What happens after launch?', 'You get a walkthrough of the finished site, and ongoing updates and support are available whenever you need them.')]
def faq():
    return '<div class="faq reveal">' + ''.join(f'<details><summary>{q}<span class="pm" aria-hidden="true"></span></summary><div class="ans"><p>{a}</p></div></details>' for q, a in FAQ) + '</div>'

TRADES = ['Restaurants', 'Clinics', 'Contractors', 'Law firms', 'Shops', 'Studios', 'Churches &amp; nonprofits', 'Consultants']

def arrow_link(label, href):
    return f'<a class="arrow-link" href="{href}">{label} {ARROW}</a>'

# ---------- pages ----------
def home():
    return head('Home', 'Signet Works designs and builds fast, professional websites for businesses that need one. Design, build and launch, handled start to finish.', 'home') + nav() + f'''<main id="main">
<div class="hero" id="top">
  <div class="orb a" aria-hidden="true"></div><div class="orb b" aria-hidden="true"></div>
  <div class="wrap">
    <div class="fade d0"><span class="pill"><i></i>Booking new projects</span></div>
    <h1 data-split data-hero>Websites that make your business look <em>as good as it is.</em></h1>
    <div class="hero-row">
      <p class="fade d1">Signet Works designs and builds professional websites for businesses that need one — clear, fast, and made to turn visitors into customers.</p>
      <div class="cta fade d2">{btn('Start a project', 'start.html')}{btn('See the work', 'work.html', 'ghost', arrow=False)}</div>
    </div>
  </div>
  <a class="badge fade d2" href="start.html" aria-label="Start a project" data-magnetic>
    <svg class="ring" viewBox="0 0 132 132" aria-hidden="true"><defs><path id="circ" d="M66 66m-54 0a54 54 0 1 1 108 0a54 54 0 1 1-108 0"/></defs><text><textPath href="#circ">Start a project · Start a project · </textPath></text></svg>
    <span class="core"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg></span>
  </a>
</div>

<div class="marquee" aria-hidden="true"><div class="track">{''.join(f'<span>{t}</span>' for t in TRADES)}</div></div>

<section>
  <div class="wrap">
    <div class="head">
      <p class="kicker reveal"><b>01</b>Services</p>
      <h2 data-split>Everything your site needs, <em>handled.</em></h2>
    </div>
    {svc_panels(link=True)}
    <p class="reveal" style="margin-top:36px">{arrow_link('Explore services', 'services.html')}</p>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="head">
      <p class="kicker reveal"><b>02</b>Latest work</p>
      <h2 data-split>Built for real businesses, <em>not for awards.</em></h2>
    </div>
    <div class="grid">{FEATURE}</div>
    <p class="reveal" style="margin-top:40px">{arrow_link('See all work &amp; the process', 'work.html')}</p>
  </div>
</section>

<section>
  <div class="wrap about">
    <div>
      <p class="kicker reveal" style="margin-bottom:30px"><b>03</b>About</p>
      <blockquote class="quote" data-scrub>{QUOTE}</blockquote>
      <p class="reveal" style="margin-top:36px">{arrow_link('More about Signet Works', 'about.html')}</p>
    </div>
    {promises()}
  </div>
</section>
</main>
''' + band() + footer()

def services():
    rows = []
    long = ['Every site starts with how your customers think: what they need to find, and what you want them to do next. The design follows from that, shaped around your brand.',
            'The approved design is built as a fast, lightweight site that works on every screen size, with the search-engine groundwork done properly from the start.',
            'You are not left on your own after launch: updates and support are available whenever you need them, so the site keeps up with your business.']
    for i, ((n, h, p, items), lp) in enumerate(zip(SERVICES, long)):
        lis = ''.join(f'<li>{x}</li>' for x in items)
        rows.append(f'<div class="row reveal"><span class="num">0{i+1}</span><div><h3>{h}</h3><p>{p}</p><p style="margin-top:14px">{lp}</p></div><ul>{lis}</ul></div>')
    return head('Services', 'Design, build, launch and ongoing care for business websites, handled start to finish by Signet Works.', 'services') + nav() + '<main id="main">' + page_head(
        '01', 'Services', 'Everything your site needs, <em>handled.</em>',
        'From the first sketch to launch day and beyond: design, build, and care for websites that work as hard as you do.') + f'''
<section>
  <div class="wrap">
    <div class="rows">{''.join(rows)}</div>
  </div>
</section>

<section class="tight">
  <div class="wrap split2">
    <div>
      <p class="kicker reveal" style="margin-bottom:24px"><b>02</b>Good fit for</p>
      <h2 class="h2" data-split>Businesses of <em>every kind.</em></h2>
    </div>
    <div class="fit reveal">{''.join(f'<span>{t}</span>' for t in TRADES)}</div>
  </div>
</section>

<section class="alt">
  <div class="wrap split2">
    <div>
      <p class="kicker reveal" style="margin-bottom:24px"><b>03</b>Questions</p>
      <h2 class="h2" data-split>Before you <em>ask.</em></h2>
    </div>
    {faq()}
  </div>
</section>
</main>
''' + band() + footer()

def work():
    return head('Work', 'Selected website projects by Signet Works, and the four-step process behind every site.', 'work') + nav() + '<main id="main">' + page_head(
        '02', 'Work &amp; process', 'Built for real businesses, <em>not for awards.</em>',
        'Recent work, design concepts, and the simple process every project follows.') + f'''
<section>
  <div class="wrap">
    <div class="grid">
      {FEATURE}
      {concepts()}
    </div>
  </div>
</section>

<section class="alt" id="process">
  <div class="wrap">
    <div class="head">
      <p class="kicker reveal"><b>03</b>Process</p>
      <h2 data-split>Four steps. <em>No surprises.</em></h2>
    </div>
    {steps()}
  </div>
</section>
</main>
''' + band('Your business <em>could be next.</em>') + footer()

def about():
    return head('About', 'Signet Works builds professional websites for businesses — one person, plain language, a clear quote up front.', 'about') + nav() + '<main id="main">' + page_head(
        '04', 'About', 'Good websites, <em>made honestly.</em>',
        'Signet Works is a small studio for businesses that need a professional website without the agency runaround.') + f'''
<section>
  <div class="wrap about">
    <blockquote class="quote" data-scrub>{QUOTE}</blockquote>
    {promises()}
  </div>
</section>

<section class="alt">
  <div class="wrap split2">
    <div>
      <p class="kicker reveal" style="margin-bottom:24px"><b>05</b>The name</p>
      <h2 class="h2" data-split>Why a <em>signet?</em></h2>
    </div>
    <div class="prose reveal">
      <p>A signet ring was once used to seal a letter: a small, personal mark that said who it came from and that it could be trusted.</p>
      <p>That is the idea behind Signet Works. Every site carries the same care, whether it is a one-page site for a local shop or a full redesign, and it is built to earn your customers’ trust.</p>
    </div>
  </div>
</section>
</main>
''' + band() + footer()

def start():
    needs = ['A new website', 'A redesign', 'An online store', 'Updates to a site', 'Not sure yet']
    chips = ''.join(f'<label><input type="radio" name="need" value="{n}"{" checked" if i == 0 else ""}><span>{n}</span></label>' for i, n in enumerate(needs))
    return head('Start a project', 'Tell Signet Works about your business and the website you need. You will get a reply with next steps and a time to talk.', 'start') + nav() + '<main id="main">' + page_head(
        '05', 'Start a project', 'Let’s build your <em>website.</em>',
        'Tell me a little about your business and what you need. I’ll reply with next steps and a time to talk.') + f'''
<section>
  <div class="wrap contact">
    <div>
      <p class="kicker reveal"><b>—</b>What happens next</p>
      <ol class="next reveal">
        <li><div><b>You send the details</b><span>A few lines about your business and what you need is plenty.</span></div></li>
        <li><div><b>We talk</b><span>A short call to understand your customers and goals.</span></div></li>
        <li><div><b>You get a fixed quote</b><span>Clear scope and price before any work begins.</span></div></li>
      </ol>
      <p class="reveal" style="margin-top:34px;color:var(--muted)">Prefer email?</p>
      <a class="mail reveal" href="mailto:hello@sigi.com">hello@sigi.com</a>
    </div>
    <div class="formcard reveal" style="--d:120ms">
      <h2>Project details</h2>
      <form id="form" novalidate>
        <label class="field"><input name="name" autocomplete="name" placeholder=" " required><span>Your name</span></label>
        <label class="field"><input name="email" type="email" autocomplete="email" placeholder=" " required><span>Email</span></label>
        <label class="field"><input name="business" autocomplete="organization" placeholder=" "><span>Business name</span></label>
        <label class="field"><input name="site" type="url" inputmode="url" placeholder=" "><span>Current website (if any)</span></label>
        <fieldset class="choices"><legend>What do you need?</legend><div class="chips">{chips}</div></fieldset>
        <label class="field full"><textarea name="message" placeholder=" " required></textarea><span>About the project</span></label>
        {btn('Send enquiry', '#', 'lg').replace('<a ', '<button type="submit" ').replace(' href="#"', '').replace('</a>', '</button>')}
        <p class="note">Sending opens your email app with the message ready to go.</p>
        <p class="sent" role="status" aria-live="polite"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="8.5"/><path d="M6 10.5l2.8 2.8L14.5 7"/></svg><span>Your email app should open with the message ready. If it doesn’t, write to hello@sigi.com.</span></p>
      </form>
    </div>
  </div>
</section>
</main>
''' + footer()

for name, fn in [('index', home), ('services', services), ('work', work), ('about', about), ('start', start)]:
    with open(os.path.join(OUT, name + '.html'), 'w') as f:
        f.write(fn())
print('ok')
