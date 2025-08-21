<script type="module" src="../assets/js/project-layout.js"></script>

class ProjectPage extends HTMLElement {
    /* list of attributes to observe, when any of these change, attributeChangedCallback runs */
    static get observedAttributes() {
        return ['title', 'subtitle', 'role', 'dates', 'stack', 'tags', 'cover', 'variant', 'disable']
    }


    constructor() {
        super(); // calling parent class constructor
        /* Shadow root created to keep components HTML&CSS isolated.
        mode:'open' lets you inspect in devtools and access via shadowRoot */
        const root = this.attachShadow({ mode: 'open' }); // attach shadow DOM, which is a separate DOM tree

        /* component UI, inline the <style> so styles are scoped to this component only
           we expose some parts so i can style from outside with ::part() */
        root.innerHTML = `
          <style>
            /* Host element defaults + theming hooks (override these from page CSS) */
            :host {display:block;}
            /*Theme hooks */
            :host {
            --wrap-max: 1100px;     /* max content width */
            --g: 1.25rem;           /* gap spacing */
            --aside-w: 320px;       /* sidebar width */
            --radius: 1rem;         /* border radius for images/panels*/
            }
            /* Allow a fully-custom hero that spans full width */
:host([hero="custom"]) header.hero { grid-template-columns: 1fr; }
:host([hero="custom"]) header.hero > div:first-child { display: none; } /* hide default text column */
:host([hero="custom"]) header.hero .media { grid-column: 1 / -1; }     /* make hero slot full width */


            /* Outer container */
            .wrap { max-width: var(--wrap-max); margin: 3rem auto; padding: 0 1 rem; }

            /* Hero: left = text, right = image ( or slotted custom media)*/
            header.hero {
            display:grid;
            grid-template-columns: 1.2fr 1fr; 
            gap: var(--g);      /* gap between columns */
            align-items:center;
            }
            
            header.hero img { width:100%; height:auto; border-radius: var(--radius);}

            /* Pills - Title/subtitle/meta */
             .title { margin:0; font-size: clamp(1.9rem, 2.4vw, 2.6rem); color: var(--title-color); }
             .subtitle { margin-top:.25rem; color: var(--text-color); }
             .meta { display:flex; flex-wrap:wrap; gap:.5rem .6rem; margin-top:.75rem; }
             .pill {
             font-size: .85rem; padding:.25rem .6rem; border-radius:999px;
             background : var(--container-color); border:1px solid var(--scroll-bar-color);
             }

             /* Link row */
             .links { display:flex; gap:.5rem; flex-wrap:wrap; margin-top: 1rem}
             .links ::slotted(a) {
               display:inline-flex; align-items:center;
                padding:.5rem .75rem; border-radius:.6rem;
                border:1px solid var(--scroll-bar-color); text-decoration:none;
                color: var(--title-color);
             }

             /* Main layout: article + aside (sidebar) */
            main {
          margin-top: 2.25rem;
          display:grid;
          grid-template-columns: 1fr var(--aside-w);
          gap: var(--g);
        }

        /* Article content and sections*/
        article section { margin-bottom: 2rem;}
        article h2 { font-size: 1.25rem; margin: 0 0 .25rem; color: var(--title-color); }
        article p, article li { line-height:1.7; color: var(--text-color); }

        /* Sticky sidebar with key/value info (Role/Dates/Stack) */
        aside {
          position: sticky; top: 1rem; height: fit-content;
          border:1px solid var(--scroll-bar-color); padding:1rem;
          border-radius:.8rem; background: var(--container-color);
        }
        aside h4 { margin:.25rem 0 .5rem; font-size:1rem; color: var(--title-color); }
        aside .kv { display:grid; gap:.35rem; font-size:.95rem; color: var(--text-color); }

        /* Built-in layout variants controlled by the [variant] attribute */
        :host([variant="wide"]) main { grid-template-columns: 1fr; }            /* no sidebar */
        :host([variant="left-aside"]) main { grid-template-columns: var(--aside-w) 1fr; } /* sidebar first */
        :host([variant="no-hero-img"]) header.hero { grid-template-columns: 1fr; }        /* no media column */

        /* Responsive: single column on small screens */
        @media (max-width: 900px) {
          header.hero { grid-template-columns: 1fr; }
          main { grid-template-columns: 1fr; }
        }
      </style>

       <!-- "part" attributes allow styling from page CSS: project-page::part(title) { … } -->
    <div class="wrap" part="wrap">
        <header class="hero" part="hero">
          <!-- Left side: text content -->
          <div>
            <h1 class="title" part="title"></h1>
            <div class="subtitle" part="subtitle"></div>
            <div class="meta" part="meta"></div>
            <div class="links" part="links"><slot name="links"></slot></div>
          </div>

          <!-- Right side: image by default, or your own slotted hero content -->
          <div class="media" part="media">
            <!-- If you slot your own hero, this <img> is ignored/hidden -->
            <slot name="hero"><img alt=""></slot>
          </div>
        </header>

        <main part="main">
          <article part="article">
            <!-- Core sections (auto-hidden if you don’t provide content) -->
            <section id="sec-overview" part="section overview">
              <h2>Overview</h2><slot name="overview"></slot>
            </section>
            <section id="sec-highlights" part="section highlights">
              <h2>Highlights</h2><slot name="highlights"></slot>
            </section>
            <section id="sec-challenges" part="section challenges">
              <h2>Challenges</h2><slot name="challenges"></slot>
            </section>
            <section id="sec-results" part="section results">
              <h2>Results</h2><slot name="results"></slot>
            </section>

            <!-- Anything custom (diagrams, carousels, etc.) goes here -->
            <slot name="custom"></slot>
          </article>

          <!-- Sidebar with quick facts -->
          <aside part="aside">
            <h4>Project info</h4>
            <div class="kv">
              <div><strong>Role:</strong> <span class="role"></span></div>
              <div><strong>Dates:</strong> <span class="dates"></span></div>
              <div><strong>Stack:</strong> <span class="stack"></span></div>
            </div>
          </aside>
        </main>
      </div>
      `;
    }
    /* runs when the element is inserted into the page. we render once
    and set up listeners to auto-hide empty sections
    */
    connectedCallback() {
        this.render();

        // for each core section, hide if theres no slotted content 
        ['overview', 'highlights', 'challenges', 'results'].foreEach((name) => {
            const slot = this.shadowRoot.querySelector(`slor[name="${name}]`)

            // re-check whenever the slot content changes 
            slot.addEventListener('slotchange', () => this._toggleSection(name));

            // Initial check on connect 
            this._toggleSection(name);
        });
    }

    /* runs whnever a watched attribute changes (title,tags, etc) */
    attributeChangedCallback() {
        this._render(); // re-renders the component 
    }

    /* show/hide section based on whether it has any real content.
    Supports force-hiding via disable="overview, results".*/
    _toggleSection(name) {
        const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
        const sectionEl = this.shadowRoot.getElementById(`sec-${name}`);

        if (!slot || !sectionEl) return; // safety

        // Does the slot have any non-empty node?
        const hasContent = slot
            .assignedNodes()
            .some((n) => (n.nodeType === Node.TEXT_NODE ? n.textContent.trim() : true));

        // Hide if empty
        sectionEl.style.display = hasContent ? '' : 'none';

        // If attribute "disable" lists this section, keep it hidden
        const disabled = (this.getAttribute('disable') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        if (disabled.includes(name)) {
            sectionEl.style.display = 'none';
        }
    }

    /* Read attributes, fill in the UI, and build pills + hero fallback. */
    _render() {
        const $ = (sel) => this.shadowRoot.querySelector(sel);

        // Basic text fields
        $('.title').textContent = this.getAttribute('title') || '';
        $('.subtitle').textContent = this.getAttribute('subtitle') || '';
        $('.role').textContent = this.getAttribute('role') || '';
        $('.dates').textContent = this.getAttribute('dates') || '';
        $('.stack').textContent = this.getAttribute('stack') || '';

        // Tags → chip “pills”
        const meta = $('.meta');
        meta.innerHTML = ''; // clear any existing pills
        (this.getAttribute('tags') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((t) => {
                const pill = document.createElement('span');
                pill.className = 'pill';
                pill.setAttribute('part', 'pill'); // expose for ::part styling
                pill.textContent = t;
                meta.appendChild(pill);
            });

        // Hero image fallback:
        // - If you provided a <slot name="hero"> element in the light DOM, we use that
        // - Otherwise, if a 'cover' URL is set, we show the <img> with that source
        const cover = this.getAttribute('cover');
        const customHeroProvided = this.querySelector('[slot="hero"]') != null;
        const img = this.shadowRoot.querySelector('header.hero img');

        if (img) {
            if (!customHeroProvided && cover) {
                img.src = cover;
                img.alt = this.getAttribute('title') || 'Project cover';
                img.style.display = '';
            } else if (!customHeroProvided && !cover) {
                // No hero slot and no cover → hide the default img
                img.style.display = 'none';
            } else {
                // You supplied your own hero slot; the slotted content shows instead
                img.style.display = 'none';
            }
        }
    }
}

/* Register the element so you can use <project-page> in HTML */
customElements.define('project-page', ProjectPage);


