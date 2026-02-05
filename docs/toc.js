// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="Einleitung.html">Einleitung</a></li><li class="chapter-item expanded "><a href="01 Links.html"><strong aria-hidden="true">1.</strong> Links</a></li><li class="chapter-item expanded "><a href="02 Datentypen.html"><strong aria-hidden="true">2.</strong> Datentypen</a></li><li class="chapter-item expanded "><a href="03 Datenstrukturen (Collections).html"><strong aria-hidden="true">3.</strong> Datenstrukturen (Collections)</a></li><li class="chapter-item expanded "><a href="04 Kommentare.html"><strong aria-hidden="true">4.</strong> Kommentare</a></li><li class="chapter-item expanded "><a href="05 Ein- und Ausgabe.html"><strong aria-hidden="true">5.</strong> Ein- und Ausgabe</a></li><li class="chapter-item expanded "><a href="06 Operatoren.html"><strong aria-hidden="true">6.</strong> Operatoren</a></li><li class="chapter-item expanded "><a href="07 Kontrollstrukturen.html"><strong aria-hidden="true">7.</strong> Kontrollstrukturen</a></li><li class="chapter-item expanded "><a href="08 Funktionen.html"><strong aria-hidden="true">8.</strong> Funktionen</a></li><li class="chapter-item expanded "><a href="09 Grundlagen der Objektorientierung.html"><strong aria-hidden="true">9.</strong> Grundlagen der Objektorientierung</a></li><li class="chapter-item expanded "><a href="10 Fortgeschrittene Objektorientierung.html"><strong aria-hidden="true">10.</strong> Fortgeschrittene Objektorientierung</a></li><li class="chapter-item expanded "><a href="11 Fortgeschrittene Funktionstechniken.html"><strong aria-hidden="true">11.</strong> Fortgeschrittene Funktionstechniken</a></li><li class="chapter-item expanded "><a href="12 Typannotationen.html"><strong aria-hidden="true">12.</strong> Typannotationen</a></li><li class="chapter-item expanded "><a href="13 Fehlerbehandlung.html"><strong aria-hidden="true">13.</strong> Fehlerbehandlung</a></li><li class="chapter-item expanded "><a href="14 Speicherverhalten, Referenzen und Mutability.html"><strong aria-hidden="true">14.</strong> Speicherverhalten, Referenzen und Mutability</a></li><li class="chapter-item expanded "><a href="15 Multithreading und -processing.html"><strong aria-hidden="true">15.</strong> Multithreading und -processing</a></li><li class="chapter-item expanded "><a href="16 Leistungsoptimierung.html"><strong aria-hidden="true">16.</strong> Leistungsoptimierung</a></li><li class="chapter-item expanded "><a href="17 Debugging.html"><strong aria-hidden="true">17.</strong> Debugging</a></li><li class="chapter-item expanded "><a href="18 Profiling und Timing.html"><strong aria-hidden="true">18.</strong> Profiling und Timing</a></li><li class="chapter-item expanded "><a href="19 Pakete und HTML-Dokumentation.html"><strong aria-hidden="true">19.</strong> Pakete und HTML-Dokumentation</a></li><li class="chapter-item expanded "><a href="20 Disassembler, Syntax Tree und Flow Graph.html"><strong aria-hidden="true">20.</strong> Disassembler, Syntax Tree und Flow Graph</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
