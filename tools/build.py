# Generates the five HTML pages from shared parts (nav, footer, etc.). Run: python3 tools/build.py
import os, urllib.parse
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root

def mark(lg=False, cls=''):
    c = ('mark lg ' + cls).strip() if lg else ('mark ' + cls).strip()
    return f'<svg class="{c}" viewBox="0 0 1091 713" aria-hidden="true" focusable="false"><use href="#sw-ring"/></svg>'
MARK = mark()
# The signet ring: line art drawn from the 3D model in its resting pose. Defined once per page, reused via <use>.
RING_SYMBOL = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="sw-ring" viewBox="0 0 1091 713">'
    '<path fill="currentColor" fill-rule="evenodd" d="M345.0 653.0C279.7 649.6 222.4 640.2 184.5 626.5C135.9 609.0 109.6 585.7 88.4 541.4C63.2 489.0 59.3 475.7 60.3 447.0C61.0 428.5 63.4 418.4 70.9 402.6C111.1 317.3 254.8 219.1 436.0 153.0C542.6 114.1 689.9 78.5 762.9 73.9C770.9 73.4 782.5 72.6 788.5 72.1C820.7 69.4 831.0 68.8 841.3 69.1L852.5 69.5L901.0 94.9C927.7 108.8 951.0 121.3 952.7 122.6C954.5 124.0 957.1 127.0 958.5 129.4C959.9 131.9 975.1 175.1 992.1 225.7C1018.0 302.1 1023.3 318.7 1023.7 324.5C1024.1 330.2 1022.0 345.0 1013.0 401.5C1000.7 479.1 1001.2 476.7 997.2 483.0C993.5 488.7 864.2 620.6 858.7 624.2C851.5 629.0 846.9 629.4 822.7 627.7L801.0 626.2L760.7 612.6C738.6 605.1 719.4 599.0 718.0 599.0C714.3 599.1 703.5 602.2 683.8 608.9C618.2 631.4 538.0 646.2 451.0 652.0C429.7 653.4 365.1 654.0 345.0 653.0ZM443.5 612.0C521.3 607.0 593.4 594.5 655.5 575.0C671.2 570.1 674.7 568.6 675.4 566.3C675.8 565.1 664.4 534.3 643.9 481.4C602.6 374.7 605.0 381.5 605.0 372.7C605.0 368.3 607.2 353.4 610.6 334.3C613.7 317.1 615.9 302.3 615.6 301.4C614.6 298.8 612.5 300.0 594.5 313.2C473.3 402.3 359.7 466.4 271.1 495.7C224.1 511.2 174.9 518.8 145.0 515.0C125.5 512.5 124.0 512.5 124.0 515.0C124.0 521.9 140.8 549.7 150.6 559.0C179.7 586.5 233.1 603.0 317.5 610.5C356.6 614.0 403.7 614.5 443.5 612.0ZM837.4 605.4C839.6 604.6 839.4 603.3 836.8 601.9C835.7 601.3 819.4 595.4 800.6 588.8C763.5 575.8 760.1 574.3 755.8 568.9C753.7 566.3 742.7 538.3 718.3 473.9L683.7 382.5L683.2 372.5C682.8 363.1 683.6 358.0 695.5 290.0C705.0 235.6 708.7 216.4 710.4 213.0C712.2 209.3 723.7 199.1 778.0 153.0C822.0 115.7 843.6 96.8 843.8 95.3C844.4 91.4 841.1 90.7 826.5 91.5C812.7 92.3 809.4 93.1 807.6 96.5C802.0 107.0 796.8 111.1 786.2 113.0C782.5 113.7 778.6 114.8 777.4 115.4C773.4 117.6 657.1 214.2 656.6 215.9C654.2 223.4 649.9 252.1 650.6 256.5C652.3 268.9 651.8 273.3 647.7 279.2C644.0 284.7 643.9 284.8 636.4 326.6C631.7 352.8 629.0 370.0 629.3 372.5C629.9 377.7 698.7 555.9 701.2 558.7C702.3 559.8 704.8 561.1 706.8 561.5C712.6 562.6 716.1 564.8 721.5 570.6L726.5 576.0L768.0 590.1C804.5 602.5 810.6 604.3 818.5 605.0C831.0 606.0 835.6 606.1 837.4 605.4ZM891.2 546.2C974.1 462.5 979.8 456.5 980.5 452.6C980.9 450.6 980.9 448.2 980.5 447.3C979.9 445.8 979.4 446.0 977.2 449.0C970.6 457.6 870.4 557.1 866.2 559.2C858.1 563.1 854.8 562.4 818.0 549.0C782.6 536.1 778.5 534.2 775.1 528.7C773.9 526.8 760.1 490.9 744.4 448.9C716.7 374.9 715.8 372.2 715.3 364.0C714.9 356.5 716.0 348.9 724.4 300.5C729.7 270.2 734.7 243.9 735.6 241.9C736.5 239.9 739.5 236.0 742.3 233.2C752.5 223.3 848.6 140.8 852.2 138.9C855.0 137.5 858.0 137.0 863.8 137.0L871.7 137.0L902.6 152.6C919.6 161.3 935.3 169.6 937.4 171.1C939.6 172.7 941.8 174.0 942.2 174.0C944.7 174.0 940.5 159.2 936.8 155.3C934.3 152.6 863.9 116.0 861.3 116.0C860.3 116.0 858.5 116.7 857.3 117.5C850.6 122.2 733.3 222.6 732.3 224.5C730.3 228.1 705.9 368.7 706.7 371.8C708.7 380.4 774.4 551.8 776.3 553.7C778.4 555.8 850.2 581.8 854.1 581.9C855.0 582.0 871.7 565.9 891.2 546.2ZM905.7 487.8C943.1 450.4 954.4 438.6 955.5 435.5C957.2 431.0 971.1 344.7 971.2 338.5C971.2 335.8 963.6 312.3 948.7 268.5C922.1 190.5 922.6 191.9 919.7 189.3C918.5 188.2 905.7 181.3 891.2 174.0C868.9 162.7 864.6 160.8 862.5 161.6C859.7 162.7 760.6 248.2 758.5 251.3C757.1 253.5 739.0 354.8 739.0 360.5C739.0 364.0 794.2 512.6 796.3 514.7C798.3 516.7 850.9 535.9 854.5 536.0C857.1 536.0 863.4 530.1 905.7 487.8ZM153.2 478.6C153.6 478.0 154.0 475.1 154.0 472.2C154.0 464.6 159.8 454.8 174.6 436.9C248.7 347.9 428.0 254.5 572.9 229.4C595.2 225.6 604.7 225.2 610.3 227.9C615.8 230.6 619.0 236.2 619.0 243.2C619.0 248.7 620.9 249.9 624.4 246.7C626.5 244.8 627.3 242.1 630.0 226.6C633.4 207.3 634.0 205.2 637.1 200.8C638.2 199.3 659.3 181.3 683.9 161.0C708.6 140.7 729.3 123.4 730.0 122.5C731.0 121.3 731.0 120.6 730.2 119.8C728.7 118.3 721.0 119.5 687.0 126.2C489.8 164.8 315.0 235.6 197.2 324.4C160.8 351.9 138.7 373.8 121.0 400.0C109.4 417.3 104.4 430.2 103.3 446.5C102.6 457.1 103.4 459.4 110.3 465.7C121.0 475.6 149.6 484.2 153.2 478.6ZM210.5 460.4C287.8 446.9 386.5 393.6 511.7 297.8C543.1 273.7 550.4 267.7 550.8 265.6C551.3 263.1 547.1 263.7 529.5 268.5C403.3 303.1 270.4 375.9 207.4 445.0C197.2 456.1 195.6 458.5 196.4 460.5C197.1 462.4 199.3 462.4 210.5 460.4Z"/>'
    '<path style="fill:var(--ring-accent,var(--accent))" fill-rule="evenodd" d="M814.8 458.1C797.4 452.5 787.6 422.3 794.8 396.7C800.1 378.0 807.5 370.5 822.2 369.0C834.2 367.8 834.5 367.3 835.3 348.4C835.6 340.3 835.4 332.6 834.9 331.3C833.6 327.9 828.2 325.0 823.0 325.0C799.5 324.8 786.3 281.2 800.9 252.1C807.0 240.2 813.0 236.0 824.1 236.0C833.1 236.0 837.1 237.4 842.0 242.1C850.8 250.7 856.0 266.6 856.0 285.7C856.0 298.6 856.8 301.3 860.9 303.5C864.9 305.5 868.8 305.4 872.7 303.0C876.3 300.8 876.6 299.8 877.5 284.5C878.4 268.5 882.1 257.5 889.1 249.5C895.0 242.8 903.8 240.6 913.3 243.4C935.1 249.7 943.1 295.2 926.6 318.4C921.5 325.6 917.6 328.0 909.3 328.8C901.6 329.7 897.4 331.8 896.0 335.6C894.7 338.9 894.7 363.1 896.0 366.4C897.1 369.5 901.0 371.5 907.3 372.3C919.4 373.9 926.5 381.7 931.1 398.6C936.9 419.8 930.2 446.9 916.9 455.7C911.1 459.5 899.4 460.3 893.3 457.1C882.2 451.5 875.0 433.4 875.0 411.1C875.0 399.5 874.2 396.7 870.1 394.5C866.1 392.5 862.2 392.6 858.3 395.0C854.6 397.2 854.4 398.3 853.6 414.0C852.5 434.3 845.9 449.5 835.3 455.7C830.5 458.5 819.9 459.7 814.8 458.1ZM909.4 431.1C912.7 428.3 915.0 421.9 915.0 415.4C915.0 401.9 904.3 390.9 896.9 396.9C894.6 398.7 894.5 399.4 894.5 411.2C894.5 421.5 894.8 424.1 896.5 427.5C899.7 433.8 904.6 435.2 909.4 431.1ZM828.4 430.2C832.5 426.5 834.0 421.1 834.0 409.4C834.0 396.2 832.5 393.0 826.4 393.0C818.2 393.0 811.1 404.9 812.3 416.6C813.7 430.2 821.2 436.5 828.4 430.2ZM871.1 369.5C875.3 367.3 875.8 365.1 876.1 348.0L876.4 332.7L873.8 330.5C868.3 325.7 858.1 326.9 856.0 332.5C854.7 335.9 854.7 362.1 856.0 365.4C857.9 370.4 865.4 372.4 871.1 369.5ZM910.1 303.3C921.0 294.1 918.3 268.0 906.4 268.0C899.4 268.0 895.5 277.9 896.2 293.7C896.5 301.2 896.8 302.4 898.9 304.1C902.2 306.8 906.3 306.5 910.1 303.3ZM833.8 298.4C835.8 296.1 836.0 294.9 836.0 285.2C836.0 272.4 835.0 268.3 831.0 264.5C825.5 259.3 818.2 261.9 816.0 269.9C814.7 274.5 814.7 285.5 816.0 289.9C817.0 293.6 822.2 299.7 825.5 301.0C828.3 302.2 831.1 301.3 833.8 298.4Z"/></symbol></svg>')

import hashlib
def _v(rel):
    """Short content hash so browsers fetch a fresh copy whenever the file changes."""
    with open(os.path.join(OUT, rel), 'rb') as fh:
        return hashlib.sha1(fh.read()).hexdigest()[:8]


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
<meta name="theme-color" content="#0A0A0A">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,500&amp;family=Inter:wght@400..800&amp;family=Playfair+Display:wght@500..700&amp;display=swap" rel="stylesheet">
<script>
(function(d){{var r=d.documentElement,c=r.classList;c.add('js');
try{{var t=localStorage.getItem('sw-theme');if(t==='light'||t==='dark')r.setAttribute('data-theme',t)}}catch(e){{}}
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)c.add('rm');
try{{if(!rm&&!sessionStorage.getItem('sw-intro')){{c.add('intro');window.__swT0=performance.now();['js/vendor/three.module.min.js','js/ring3d.js?v=6'].forEach(function(h){{var l=d.createElement('link');l.rel='modulepreload';l.href=h;d.head.appendChild(l)}})}}}}catch(e){{}}}})(document);
</script>
<link rel="stylesheet" href="css/site.css?v={_v('css/site.css')}">
</head>
<body data-page="{page}">
<a class="skip" href="#main">Skip to content</a>
{RING_SYMBOL}
<div id="intro"><div class="intro-bg"></div><div class="aurora" aria-hidden="true"><span class="al a"><i></i></span><span class="al b"><i></i></span><span class="al c"><i></i></span></div><div class="lock" aria-hidden="true"><span class="word w-l">Signet</span><span class="spin">{mark(lg=True)}</span><span class="word w-r">Works</span></div><button class="skip-intro" type="button">Skip intro</button></div>
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
      <a class="l" href="rates.html" data-nav="rates">Rates</a>
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
    <a href="rates.html" data-nav="rates">Rates <small>04</small></a>
    <a href="about.html" data-nav="about">About <small>05</small></a>
    <a href="start.html" data-nav="start">Start a project <small>06</small></a>
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
      <nav aria-label="Footer"><a href="services.html">Services</a><a href="work.html">Work</a><a href="rates.html">Rates</a><a href="about.html">About</a><a href="start.html">Start a project</a></nav>
      <nav class="legal-links" aria-label="Legal"><a href="privacy.html">Privacy policy</a><a href="cookies.html">Cookie policy</a></nav>
      <button class="top" type="button">Back to top <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 10V2M2.5 5.5L6 2l3.5 3.5"/></svg></button>
    </div>
  </div>
</footer>
<script src="js/lenis.min.js"></script>
<script src="js/site.js?v={_v('js/site.js')}"></script>
</body>
</html>
'''

def page_head(kicker_no, kicker, title, lede, orb=True, cls=''):
    return f'''<header class="page-head {cls}">
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
  ('coffee', 'Kettle &amp; Crema', 'Coffee shop · menu, beans &amp; a hand-poured hero', '#24160F', '#F4EBDD', '#C98A4B', 'Slow coffee, <em>poured fresh.</em>', 'See the menu'),
  ('cleaning', 'Clearwell Cleaning', 'Cleaning company · instant quotes &amp; before/after', '#E8F7F4', '#0D3B40', '#19B5A5', 'A spotless home, <em>zero effort.</em>', 'Get a quote'),
  ('handyman', 'Plumb &amp; Level', 'Handyman services · jobs &amp; booking', '#FFC72C', '#1C1C1C', '#1C1C1C', 'No job <em>too small.</em>', 'Book a visit'),
  ('startup', 'Nebulo', 'Tech startup · product, pricing &amp; waitlist', '#170A3A', '#F6F5FB', '#FF77C8', 'Your team’s work, <em>above the clouds.</em>', 'Join the waitlist'),
]
def concepts():
    out = []
    for i, (slug, name, sub, bg, fg, ac, h, b) in enumerate(CONCEPTS):
        out.append(f'''<a class="card reveal" href="concepts/{slug}.html" data-cursor="View site" style="--d:{(i%2)*120}ms">
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


import math
def _closed_path(pts):
    n = len(pts); d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for i in range(n):
        p0, p1, p2, p3 = pts[(i-1) % n], pts[i], pts[(i+1) % n], pts[(i+2) % n]
        c1 = (p1[0] + (p2[0]-p0[0])/6, p1[1] + (p2[1]-p0[1])/6)
        c2 = (p2[0] - (p3[0]-p1[0])/6, p2[1] - (p3[1]-p1[1])/6)
        d += f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + 'Z'

def _rings(cx, cy, count, step, start, harm, cls):
    out = []
    for i in range(count):
        r0 = start + i * step
        pts = []
        for k in range(72):
            t = 2 * math.pi * k / 72
            w = sum(a * math.sin(m * t + ph + i * 0.045) for m, a, ph in harm)
            r = r0 * (1 + w)
            pts.append((cx + r * math.cos(t) * 1.12, cy + r * math.sin(t)))
        major = ' major' if i % 4 == 3 else ''
        out.append(f'<path class="{cls}{major}" style="--n:{i}" pathLength="1" d="{_closed_path(pts)}"/>')
    return out

def topo_svg():
    harm = [(2, .055, .4), (3, .045, 1.9), (5, .022, .7), (7, .010, 2.6)]
    main = _rings(330, 270, 17, 17, 12, harm, 'c')
    side = _rings(735, 470, 7, 15, 10, [(2, .07, 2.2), (3, .05, .3), (4, .03, 1.1)], 'c s')
    grid = ''.join(f'<line x1="{x}" y1="0" x2="{x}" y2="560"/>' for x in range(0, 841, 70)) + \
           ''.join(f'<line x1="0" y1="{y}" x2="840" y2="{y}"/>' for y in range(0, 561, 70))
    return ('<figure class="topo reveal" aria-label="Stylised topographic map with contour rings centred on Tilburg">'
            '<svg viewBox="0 0 840 560" aria-hidden="true">'
            f'<g class="grid">{grid}</g><g class="contours">{"".join(main)}{"".join(side)}</g>'
            '<g class="pulse"><circle cx="330" cy="270" r="10"/><circle cx="330" cy="270" r="10"/><circle cx="330" cy="270" r="10"/></g>'
            '<g class="pin"><circle class="halo" cx="330" cy="270" r="14"/><circle class="dot" cx="330" cy="270" r="6"/></g></svg>'
            '<figcaption><span class="lbl"><b>Tilburg</b> North Brabant, NL</span><span class="coord">51.5555° N · 5.0913° E</span></figcaption>'
            '<span class="corner tl">N ↑</span><span class="corner br">Stylised contours</span></figure>')


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
        'Recent client work, four concept sites you can click through, and the simple process every project follows.') + f'''
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
        '04', 'About', 'What Signet Works is all about',
        'A small studio from Tilburg, building premium websites that businesses and people can actually afford.', cls='plain') + f'''
<section class="philosophy">
  <div class="wrap">
    <p class="kicker reveal"><b>05</b>The philosophy behind it all</p>
    <p class="manifesto" data-scrub>Professional websites shouldn’t be crazy expensive, or out of reach, in a digital age.</p>
    <div class="phil-grid">
      <div class="prose reveal">
        <p>Signet Works was founded on a simple idea: a professional website is no longer a luxury, so it shouldn’t be priced like one. Least of all for startups and small businesses, who often need a good website the most and can afford an expensive one the least.</p>
        <p>With the help of AI, the slow and repetitive parts of building a website take a fraction of the time. That time goes back into what matters: the design, the details, and getting your business across clearly. The result is high-quality websites with premium design, at a price that makes sense, for businesses and for personal use.</p>
      </div>
      <ul class="pillars reveal" style="--d:120ms">
        <li><b>Accessible</b><span>Clear, fair prices that work for startups, small businesses and individuals.</span></li>
        <li><b>Premium</b><span>Design and detail that hold their own next to sites that cost many times more.</span></li>
        <li><b>AI-assisted, personally made</b><span>AI speeds up the build. The design decisions, and the care, stay personal.</span></li>
      </ul>
    </div>
  </div>
</section>

<section>
  <div class="wrap about">
    <blockquote class="quote" data-scrub>{QUOTE}</blockquote>
    {promises()}
  </div>
</section>

<section class="origin">
  <div class="wrap">
    <div class="head">
      <p class="kicker reveal"><b>06</b>Origin</p>
      <h2 data-split>Headquartered in Tilburg, <em>operating around the globe.</em></h2>
    </div>
    <div class="origin-grid">
      {topo_svg()}
      <div class="prose reveal" style="--d:150ms">
        <p>Signet Works started in Tilburg, in the south of the Netherlands, and that is still home base.</p>
        <p>From there, the work travels: websites are planned, designed and launched remotely, for businesses wherever they are. Like the rings on this map, it starts from one point and keeps reaching further out.</p>
      </div>
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap split2">
    <div>
      <p class="kicker reveal" style="margin-bottom:24px"><b>07</b>The name</p>
      <h2 class="h2" data-split>Why a <em>signet?</em></h2>
    </div>
    <div class="prose reveal">
      <p>A signet ring was once used to seal a letter: a small, personal mark that said who it came from and that it could be trusted.</p>
      <p>That is the idea behind Signet Works. Every site carries the same care, whether it is a one-page site for a local shop or a full redesign, and it is built to earn your customers’ trust.</p>
    </div>
  </div>
</section>
<p class="fineprint wrap"><a href="privacy.html">Privacy policy</a><span aria-hidden="true">·</span><a href="cookies.html">Cookie policy</a></p>
</main>
''' + band() + footer()

def start():
    return head('Start a project', 'Tell Signet Works about your business and the website you need. You will get a reply with next steps and a time to talk.', 'start') + nav() + '<main id="main">'  + page_head(
        '05', 'Start a project', 'Let’s build your <em>website.</em>',
        'Tell me a little about your business and what you need. I’ll reply with next steps and a time to talk.') + f'''
<section>
  <div class="wrap contact">
    <div>
      <p class="kicker reveal"><b>—</b>What happens next</p>
      <ol class="next reveal">
        <li><div><b>You answer four quick questions</b><span>About a minute. No phone number needed.</span></div></li>
        <li><div><b>We talk</b><span>A short call to understand your customers and goals.</span></div></li>
        <li><div><b>You get a fixed quote</b><span>Clear scope and price before any work begins.</span></div></li>
      </ol>
      <p class="reveal" style="margin-top:34px;color:var(--muted)">Prefer email?</p>
      <a class="mail reveal" href="mailto:hello@sigi.com">hello@sigi.com</a>
    </div>
    <div class="proj reveal" style="--d:120ms" id="proj">
      <div class="phone-stage" id="phoneStage">
        <div class="phone" id="phone">
          <div class="ph-body" aria-hidden="true"><i style="--f:-0.4722;--c:#a44b1d"></i><i style="--f:-0.4167;--c:#b45a29"></i><i style="--f:-0.3611;--c:#c26734"></i><i style="--f:-0.3056;--c:#ce733d"></i><i style="--f:-0.2500;--c:#d97d45"></i><i style="--f:-0.1944;--c:#e1854c"></i><i style="--f:-0.1389;--c:#e98c52"></i><i style="--f:-0.0833;--c:#ee9155"></i><i style="--f:-0.0278;--c:#f19458"></i><i style="--f:0.0278;--c:#f19458"></i><i style="--f:0.0833;--c:#ee9155"></i><i style="--f:0.1389;--c:#e98c52"></i><i style="--f:0.1944;--c:#e1854c"></i><i style="--f:0.2500;--c:#d97d45"></i><i style="--f:0.3056;--c:#ce733d"></i><i style="--f:0.3611;--c:#c26734"></i><i style="--f:0.4167;--c:#b45a29"></i><i style="--f:0.4722;--c:#a44b1d"></i></div>
          <div class="ph-btns" aria-hidden="true"><b class="l" style="--f:-0.16;top:17.5%;height:4.2%"></b><b class="l" style="--f:-0.08;top:17.5%;height:4.2%"></b><b class="l" style="--f:0.00;top:17.5%;height:4.2%"></b><b class="l" style="--f:0.08;top:17.5%;height:4.2%"></b><b class="l" style="--f:0.16;top:17.5%;height:4.2%"></b><b class="l" style="--f:-0.16;top:25.5%;height:7.5%"></b><b class="l" style="--f:-0.08;top:25.5%;height:7.5%"></b><b class="l" style="--f:0.00;top:25.5%;height:7.5%"></b><b class="l" style="--f:0.08;top:25.5%;height:7.5%"></b><b class="l" style="--f:0.16;top:25.5%;height:7.5%"></b><b class="l" style="--f:-0.16;top:34.5%;height:7.5%"></b><b class="l" style="--f:-0.08;top:34.5%;height:7.5%"></b><b class="l" style="--f:0.00;top:34.5%;height:7.5%"></b><b class="l" style="--f:0.08;top:34.5%;height:7.5%"></b><b class="l" style="--f:0.16;top:34.5%;height:7.5%"></b><b class="r" style="--f:-0.16;top:27%;height:11%"></b><b class="r" style="--f:-0.08;top:27%;height:11%"></b><b class="r" style="--f:0.00;top:27%;height:11%"></b><b class="r" style="--f:0.08;top:27%;height:11%"></b><b class="r" style="--f:0.16;top:27%;height:11%"></b><b class="r" style="--f:-0.16;top:64%;height:6%"></b><b class="r" style="--f:-0.08;top:64%;height:6%"></b><b class="r" style="--f:0.00;top:64%;height:6%"></b><b class="r" style="--f:0.08;top:64%;height:6%"></b><b class="r" style="--f:0.16;top:64%;height:6%"></b></div>
          <div class="ph-backside" aria-hidden="true"><div class="ph-back"><span class="ph-panel"></span><span class="sheen"></span></div><i class="pl-side" style="--z:1;left:5.9%;top:3.0%;width:90.7%;height:23.1%"></i><i class="pl-side" style="--z:2;left:5.9%;top:3.0%;width:90.7%;height:23.1%"></i><i class="pl-side" style="--z:3;left:5.9%;top:3.0%;width:90.7%;height:23.1%"></i><i class="pl-side" style="--z:4;left:5.9%;top:3.0%;width:90.7%;height:23.1%"></i><i class="pl-top" style="--z:5;left:5.9%;top:3.0%;width:90.7%;height:23.1%"><span class="sheen"></span></i><i class="ph-flash" style="--z:5.4;left:78.15%;top:6.26%;width:8.50%;height:4.08%"></i><i class="ph-mic" style="--z:5.4;left:81.40%;top:14.22%;width:1.60%;height:0.77%"></i><i class="ph-lidar" style="--z:5.4;left:77.95%;top:18.86%;width:8.50%;height:4.08%"></i><i class="ln-side" style="--z:6;left:9.40%;top:4.72%;width:17.80%;height:8.55%"></i><i class="ln-side" style="--z:7;left:9.40%;top:4.72%;width:17.80%;height:8.55%"></i><i class="ln-side" style="--z:8;left:9.40%;top:4.72%;width:17.80%;height:8.55%"></i><i class="ln-side" style="--z:9;left:9.40%;top:4.72%;width:17.80%;height:8.55%"></i><i class="ln-top" style="--z:10;left:9.40%;top:4.72%;width:17.80%;height:8.55%"><span class="glass"></span></i><i class="ln-side" style="--z:6;left:31.90%;top:9.89%;width:19.20%;height:9.22%"></i><i class="ln-side" style="--z:7;left:31.90%;top:9.89%;width:19.20%;height:9.22%"></i><i class="ln-side" style="--z:8;left:31.90%;top:9.89%;width:19.20%;height:9.22%"></i><i class="ln-side" style="--z:9;left:31.90%;top:9.89%;width:19.20%;height:9.22%"></i><i class="ln-top" style="--z:10;left:31.90%;top:9.89%;width:19.20%;height:9.22%"><span class="glass"></span></i><i class="ln-side" style="--z:6;left:9.05%;top:16.06%;width:18.50%;height:8.89%"></i><i class="ln-side" style="--z:7;left:9.05%;top:16.06%;width:18.50%;height:8.89%"></i><i class="ln-side" style="--z:8;left:9.05%;top:16.06%;width:18.50%;height:8.89%"></i><i class="ln-side" style="--z:9;left:9.05%;top:16.06%;width:18.50%;height:8.89%"></i><i class="ln-top" style="--z:10;left:9.05%;top:16.06%;width:18.50%;height:8.89%"><span class="glass"></span></i></div>
          <div class="ph-face ph-front">
            <div class="ph-screen">
              <span class="ph-island" aria-hidden="true"></span>
              <div class="call" id="call" role="group" aria-label="New project">
                <div class="call-glow" aria-hidden="true"></div>
                <div class="call-id">
                  <p class="call-name">New Project</p>
                  <p class="call-status" aria-hidden="true">is calling…</p>
                </div>
                <div class="call-actions">
                  <button class="bubble" type="button" id="remindMe" aria-label="Remind me later (adds a calendar reminder)">
                    <span class="orb-glass liquid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.3 1.6M5 4.5 2.8 6.5M19 4.5l2.2 2"/></svg></span>
                    <span class="bubble-label">Remind Me</span>
                  </button>
                  <a class="bubble" href="mailto:hello@sigi.com?subject=New%20website%20project" aria-label="Send a message by email">
                    <span class="orb-glass liquid"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4C6.8 4 3 7.3 3 11.3c0 2.3 1.3 4.3 3.3 5.6-.2 1.2-.8 2.4-1.8 3.3 1.9-.1 3.6-.8 4.8-1.8.8.2 1.7.3 2.7.3 5.2 0 9-3.3 9-7.4S17.2 4 12 4z"/></svg></span>
                    <span class="bubble-label">Message</span>
                  </a>
                </div>
                <div class="answer liquid" id="answer">
                  <span class="answer-text" aria-hidden="true">slide to answer</span>
                  <span class="answer-knob" id="answerKnob" role="slider" tabindex="0" aria-label="Slide to answer and start your project" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="Not answered">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>
                  </span>
                </div>
                <button class="call-skip" type="button" id="callSkip">Skip to the questions</button>
              </div>
            </div>
          </div>
        </div>
        <div class="ph-shadow" aria-hidden="true"></div>
      </div>
    <div class="formcard quiz" id="quiz">
      <div class="q-top">
        <span class="q-count" aria-live="polite"><b id="qNow">01</b> / 04</span>
        <span class="q-bar" aria-hidden="true"><i id="qBar"></i></span>
      </div>
      <form id="qform" action="mailto:hello@sigi.com" method="post" enctype="text/plain" novalidate>

        <fieldset class="q-step on" data-step="1">
          <legend class="q-title" tabindex="-1">What do you need help with?</legend>
          <p class="q-hint">Pick as many as you like.</p>
          <div class="chips lg">
            <label><input type="checkbox" name="need" value="A new website"><span>A new website</span></label>
            <label><input type="checkbox" name="need" value="A redesign"><span>A redesign</span></label>
            <label><input type="checkbox" name="need" value="An online store"><span>An online store</span></label>
            <label><input type="checkbox" name="need" value="Updates &amp; care"><span>Updates &amp; care</span></label>
            <label><input type="checkbox" name="need" value="Not sure yet"><span>Not sure yet</span></label>
          </div>
          <p class="q-err" role="alert"></p>
        </fieldset>

        <fieldset class="q-step" data-step="2">
          <legend class="q-title" tabindex="-1">Tell me about your business.</legend>
          <p class="q-hint">A few lines is plenty: what you do, and who your customers are.</p>
          <div class="q-fields">
            <label class="field"><input name="business" autocomplete="organization" placeholder=" "><span>Business name (optional)</span></label>
            <label class="field"><textarea name="about" placeholder=" " required></textarea><span>What does your business do?</span></label>
          </div>
          <p class="q-err" role="alert"></p>
        </fieldset>

        <fieldset class="q-step" data-step="3">
          <legend class="q-title" tabindex="-1">When would you like it live?</legend>
          <p class="q-hint">No pressure, it just helps with planning.</p>
          <div class="chips lg" data-auto>
            <label><input type="radio" name="when" value="As soon as possible"><span>As soon as possible</span></label>
            <label><input type="radio" name="when" value="Within 1–2 months"><span>Within 1–2 months</span></label>
            <label><input type="radio" name="when" value="In 3+ months"><span>In 3+ months</span></label>
            <label><input type="radio" name="when" value="Just exploring"><span>Just exploring</span></label>
          </div>
          <p class="q-err" role="alert"></p>
        </fieldset>

        <fieldset class="q-step" data-step="4">
          <legend class="q-title" tabindex="-1">Where can we reach you?</legend>
          <p class="q-hint">Email only. You’ll get a personal reply, never a newsletter.</p>
          <div class="q-fields">
            <label class="field"><input name="name" autocomplete="name" placeholder=" " required><span>Your name</span></label>
            <label class="field"><input name="email" type="email" autocomplete="email" placeholder=" " required><span>Email address</span></label>
          </div>
          <p class="q-err" role="alert"></p>
        </fieldset>

        <fieldset class="q-step" data-step="5">
          <legend class="q-title" tabindex="-1">All set. Look right?</legend>
          <dl class="q-sum" id="qSum"></dl>
          <p class="sent" role="status" aria-live="polite"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="8.5"/><path d="M6 10.5l2.8 2.8L14.5 7"/></svg><span>Your email app should open with everything filled in. If it doesn’t, write to hello@sigi.com.</span></p>
        </fieldset>

        <div class="q-nav">
          <button type="button" class="q-back" id="qBack" hidden>← Back</button>
          <button type="button" class="btn orange lg" id="qNext" data-magnetic><span class="tw"><span class="t">Continue</span></span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
          <span class="q-enter" aria-hidden="true">or press <kbd>Enter ↵</kbd></span>
        </div>
      </form>
    </div>
    </div>
  </div>
</section>
</main>
''' + footer()

def rates():
    tiers = [
        ('One-page landing', '<small>from about</small> €300', 'A single, clean landing page. No animations or transitions, just a sharp, professional first impression.',
         ['Works on every screen', 'Two revision rounds included', 'Done in 7–10 business days'], ''),
        ('2–5 page website', '€500–750', 'Room for your services, your story and a way to get in touch, with the polish of a premium site.',
         ['Works on every screen', 'Two revision rounds included', 'Done in 7–10 business days', 'Open to coordinating around your needs'], ' hot'),
        ('Something bigger?', 'Let’s talk', 'Animations, more pages, an online store or something custom. Priced around what you actually need.',
         ['Fixed quote before work begins', 'Two revision rounds included', 'Timeline agreed up front'], ''),
    ]
    cards = ''.join(f"""<article class="tier reveal{hot}" style="--d:{i*110}ms"><p class="tier-name">{n}</p><p class="tier-price">{p}</p><p class="tier-desc">{d}</p>
        <ul>{''.join(f'<li>{x}</li>' for x in li)}</ul></article>""" for i, (n, p, d, li, hot) in enumerate(tiers))
    terms = [
        ('7–10', 'business days', 'From the go-ahead to a completed project.'),
        ('2', 'revision rounds included', 'Two full rounds of changes are part of the price.'),
        ('+20%', 'per extra round', 'Each additional round adds 20% of the original price. It never compounds: on a €500 site, every extra round is €100.'),
        ('0', 'surprises', 'You get a fixed quote, with scope and price agreed before any work begins.'),
    ]
    tl = ''.join(f'<div class="term reveal" style="--d:{i*90}ms"><p class="term-big">{a}</p><p class="term-lbl">{l}</p><p class="term-txt">{t}</p></div>' for i, (a, l, t) in enumerate(terms))
    return head('Rates', 'Signet Works rates: one-page landing pages from about €300, 2–5 page websites from €500–750, done in 7–10 business days with two revision rounds included.', 'rates') + nav() + '<main id="main">' + page_head(
        '05', 'Rates', 'Premium websites, <em>fair prices.</em>',
        'Every business needs something different, so rates depend heavily on what yours needs. This is where most projects land.') + f"""
<section>
  <div class="wrap">
    <div class="tiers">{cards}</div>
    <p class="tier-note reveal">Prices are a starting point, not a fixed menu. Tell us what you need and you’ll get a quote that fits.</p>
  </div>
</section>

<section class="compare">
  <div class="wrap compare-grid">
    <div class="cmp reveal"><p class="cmp-big"><s>€1,000–2,000</s></p><p class="cmp-lbl">What most freelancers charge per site</p></div>
    <div class="cmp us reveal" style="--d:140ms"><p class="cmp-big">from €300</p><p class="cmp-lbl">Signet Works</p></div>
    <div class="cmp-text reveal" style="--d:260ms">
      <h2 class="h2">A website is part of <em>the business.</em></h2>
      <p>We believe a website isn’t an add-on. It’s part of the business itself, an extension of it. And in this day and age, a premium website shouldn’t cost a fortune.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="head">
      <p class="kicker reveal"><b>—</b>How we do business</p>
      <h2 data-split>Simple terms, <em>in writing.</em></h2>
    </div>
    <div class="terms">{tl}</div>
  </div>
</section>
</main>
""" + band('Ready for a website that <em>fits your budget?</em>') + footer()

def legal_page(slug, title, desc, updated, body):
    return head(title, desc, slug) + nav() + '<main id="main">' + page_head(
        '—', 'Legal', title, f'Last updated {updated}.', orb=False, cls='plain legal-head') + f"""
<section>
  <div class="wrap legal">{body}</div>
</section>
</main>
""" + footer()

UPDATED = '17 November 2026'

def privacy():
    body = """
<h2>The short version</h2>
<p>This website has no accounts, no analytics and no tracking. We only receive personal information if you choose to email us, and we use it only to reply to you and work on your project.</p>
<h2>Who we are</h2>
<p>Signet Works is a web design studio based in Tilburg, the Netherlands. For anything about your data, email <a href="mailto:hello@sigi.com">hello@sigi.com</a>.</p>
<h2>What we collect, and why</h2>
<p><b>When you contact us.</b> The project questionnaire and the “Message” button don’t send anything through this website. They open your own email app with a message ready to go. Nothing reaches us unless you press send. If you do, we receive what you wrote: usually your name, email address, business name and project details. We use this only to reply, prepare a quote and carry out the work you ask for.</p>
<p><b>Legal basis.</b> We process this information to take steps at your request before entering into an agreement, and to carry out that agreement (Article 6(1)(b) GDPR).</p>
<p><b>When you browse.</b> We don’t collect anything about your visit ourselves. The only things stored are two small preferences on your own device, explained in our <a href="cookies.html">cookie policy</a>.</p>
<h2>Services that help run this site</h2>
<p><b>Hosting.</b> This website is hosted on GitHub Pages. Like any web host, GitHub processes technical data such as your IP address to deliver the pages and keep the service secure.</p>
<p><b>Fonts.</b> Some fonts are loaded from Google Fonts. To deliver them, Google receives your IP address and basic browser information.</p>
<p><b>Email.</b> Messages you send us are handled by our email provider.</p>
<h2>How long we keep it</h2>
<p>We keep emails and project details for as long as needed to answer you and complete your project, and afterwards only as long as required for our records and legal obligations. You can ask us to delete them at any time.</p>
<h2>Your rights</h2>
<p>Under the GDPR you can ask to see, correct or delete the personal data we hold about you, object to its use, or ask for a copy. Email us and we’ll respond within one month. You also have the right to complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).</p>
<h2>We don’t sell your data</h2>
<p>We never sell, rent or share your information for advertising.</p>
<h2>Changes</h2>
<p>If this policy changes, we’ll update this page and the date at the top.</p>
"""
    return legal_page('privacy', 'Privacy policy', 'How Signet Works handles personal data: no tracking, no analytics, and contact details used only to reply.', UPDATED, body)

def cookies():
    body = """
<h2>We don’t use cookies</h2>
<p>This website doesn’t place any cookies on your device. There are no analytics, advertising or tracking cookies, and no third-party cookies from social media or embedded content. That’s also why you don’t see a cookie banner.</p>
<h2>What we do store on your device</h2>
<p>Two small settings are saved in your browser’s own storage so the site behaves the way you expect. They never leave your device and we can’t see them.</p>
<table>
  <thead><tr><th>Name</th><th>Where</th><th>Purpose</th><th>How long</th></tr></thead>
  <tbody>
    <tr><td><code>sw-theme</code></td><td>Local storage</td><td>Remembers whether you chose the dark or light look.</td><td>Until you clear it</td></tr>
    <tr><td><code>sw-intro</code></td><td>Session storage</td><td>Makes sure the opening animation plays only once per visit.</td><td>Until you close the tab</td></tr>
  </tbody>
</table>
<h2>Third parties</h2>
<p>Our host (GitHub Pages) and our font provider (Google Fonts) don’t set cookies on this website. They do receive your IP address when delivering pages and fonts, as explained in our <a href="privacy.html">privacy policy</a>.</p>
<h2>Removing stored settings</h2>
<p>You can clear these settings at any time through your browser’s settings, usually under “site data”. The site will simply go back to its default look.</p>
<h2>Changes</h2>
<p>If we ever start using cookies, we’ll update this page first and ask for your consent where the law requires it.</p>
"""
    return legal_page('cookies', 'Cookie policy', 'Signet Works doesn’t use cookies. Here is what is stored on your device, and why.', UPDATED, body)

for name, fn in [('index', home), ('services', services), ('work', work), ('rates', rates), ('about', about), ('start', start), ('privacy', privacy), ('cookies', cookies)]:
    with open(os.path.join(OUT, name + '.html'), 'w') as f:
        f.write(fn())
print('ok')
