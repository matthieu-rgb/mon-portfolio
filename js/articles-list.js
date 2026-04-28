/* ============================================================
   ARTICLES-LIST.JS - Editorial Pivot light
   Charge articles/index.json, produit un hero featured + grid
   ============================================================ */

(function () {
    'use strict';

    const listEl = document.getElementById('article-list-blog');
    const filterEl = document.getElementById('article-tags-filter');
    if (!listEl) return;

    const escapeHtml = (str) =>
        String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const renderFeatured = (article) => {
        const sourceLine = article.primary_source
            ? `<div class="article-card-source">${escapeHtml(article.primary_source)}</div>`
            : '';
        const tags = (article.tags || []).map((t) => `#${escapeHtml(t)}`).join(' &middot; ');
        const meta = [
            `<span><strong>${escapeHtml(article.date_human || article.date)}</strong></span>`,
            article.reading_time ? `<span>${article.reading_time} min de lecture</span>` : '',
            tags ? `<span>${tags}</span>` : '',
        ]
            .filter(Boolean)
            .join('');

        return `
            <a class="article-card featured" href="${escapeHtml(article.url)}" data-tags="${escapeHtml((article.tags || []).join(','))}">
                <div class="featured-eyebrow">Dernier article</div>
                ${sourceLine}
                <h2 class="article-card-title">${escapeHtml(article.title)}</h2>
                <p class="article-card-lead">${escapeHtml(article.lead || article.summary || '')}</p>
                <div class="article-card-meta">${meta}</div>
                <span class="article-card-link">Lire l'article &rarr;</span>
            </a>
        `;
    };

    const renderCard = (article) => {
        const sourceLine = article.primary_source
            ? `<div class="article-card-source">${escapeHtml(article.primary_source)}</div>`
            : '';
        const tags = (article.tags || []).map((t) => `<span class="article-card-tag">#${escapeHtml(t)}</span>`).join('');
        const meta = [
            `<span><strong>${escapeHtml(article.date_human || article.date)}</strong></span>`,
            article.reading_time ? `<span>${article.reading_time} min</span>` : '',
        ]
            .filter(Boolean)
            .join('');

        return `
            <a class="article-card" href="${escapeHtml(article.url)}" data-tags="${escapeHtml((article.tags || []).join(','))}">
                ${sourceLine}
                <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
                <p class="article-card-lead">${escapeHtml(article.lead || article.summary || '')}</p>
                <div class="article-card-meta">${meta}</div>
                ${tags ? `<div class="article-card-tags">${tags}</div>` : ''}
                <span class="article-card-link">Lire &rarr;</span>
            </a>
        `;
    };

    const renderEmpty = (msg) => `<p class="article-list-empty">${escapeHtml(msg)}</p>`;

    const renderTagsFilter = (articles) => {
        if (!filterEl) return;
        const allTags = new Set();
        articles.forEach((a) => (a.tags || []).forEach((t) => allTags.add(t)));
        if (allTags.size === 0) return;
        const chips = Array.from(allTags)
            .sort()
            .map((t) => `<button type="button" class="article-tag-chip" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`)
            .join('');
        filterEl.insertAdjacentHTML('beforeend', chips);
        filterEl.hidden = false;

        filterEl.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.article-tag-chip');
            if (!btn) return;
            filterEl.querySelectorAll('.article-tag-chip').forEach((c) => c.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.tag || '';
            listEl.querySelectorAll('.article-card').forEach((card) => {
                const cardTags = (card.dataset.tags || '').split(',');
                card.style.display = !target || cardTags.includes(target) ? '' : 'none';
            });
        });
    };

    fetch('articles/index.json', { cache: 'no-cache' })
        .then((res) => {
            if (!res.ok) throw new Error('index.json indisponible');
            return res.json();
        })
        .then((data) => {
            const articles = data.articles || [];
            if (articles.length === 0) {
                listEl.innerHTML = renderEmpty(
                    "Pas encore d'article publie ici. Premier article tres bientot."
                );
                return;
            }

            const [featured, ...rest] = articles;
            let html = renderFeatured(featured);
            if (rest.length > 0) {
                html += `<div class="article-list">${rest.map(renderCard).join('')}</div>`;
            }
            listEl.innerHTML = html;
            renderTagsFilter(articles);
        })
        .catch((err) => {
            console.error('articles-list:', err);
            listEl.innerHTML = renderEmpty(
                "Index des articles indisponible. Revenez dans quelques instants."
            );
        });
})();
