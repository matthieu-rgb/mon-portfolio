/* ============================================================
   ARTICLE.JS
   Reading progress bar, copy code buttons, TOC scroll-spy
   ============================================================ */

(function () {
    'use strict';

    // Reading progress bar (suit le scroll dans l'article)
    const progressBar = document.getElementById('reading-progress');
    const article = document.querySelector('article');

    if (progressBar && article) {
        const updateProgress = () => {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;

            const totalScrollable = articleHeight - windowHeight + articleTop;
            const scrolled = Math.max(0, scrollTop - articleTop / 2);
            const progress = Math.min(100, (scrolled / totalScrollable) * 100);

            progressBar.style.width = progress + '%';
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // Bouton copy sur chaque code block
    document.querySelectorAll('.codehilite-copy').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.codehilite');
            if (!wrapper) return;
            const pre = wrapper.querySelector('pre');
            if (!pre) return;

            const text = pre.innerText;
            try {
                await navigator.clipboard.writeText(text);
                const originalLabel = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copie';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalLabel;
                }, 1800);
            } catch (err) {
                console.error('Copy failed', err);
            }
        });
    });

    // TOC scroll-spy : marque l'item visible
    const tocLinks = Array.from(document.querySelectorAll('.article-toc a[href^="#"]'));
    if (tocLinks.length > 0) {
        const headings = tocLinks
            .map((link) => {
                const id = link.getAttribute('href').slice(1);
                return document.getElementById(id);
            })
            .filter(Boolean);

        const setActive = () => {
            const scrollPos = window.scrollY + 120;
            let activeIdx = 0;
            for (let i = 0; i < headings.length; i++) {
                if (headings[i].offsetTop <= scrollPos) {
                    activeIdx = i;
                }
            }
            tocLinks.forEach((link, idx) => {
                link.classList.toggle('active', idx === activeIdx);
            });
        };

        window.addEventListener('scroll', setActive, { passive: true });
        setActive();
    }

    // Liens externes : ajoute la classe .external (icone via CSS)
    const articleProse = document.querySelector('.article-prose');
    if (articleProse) {
        articleProse.querySelectorAll('a[href^="http"]').forEach((link) => {
            try {
                const url = new URL(link.href);
                if (url.host !== window.location.host && !link.classList.contains('header-anchor')) {
                    link.classList.add('external');
                    if (!link.hasAttribute('target')) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                }
            } catch (_) {}
        });
    }
})();
