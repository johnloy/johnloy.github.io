import { html } from '@rbardini/html'
import markdown from '../utils/markdown.js'
import DateTime from './date-time.js'
import Link from './link.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['publications']} publications
 * @returns {string | false}
 */
export default function Publications(publications = []) {
  return (
    publications.length > 0 &&
    html`
      <section id="publications">
        <h3>Publications</h3>
        <div class="stack">
          ${publications.map(
            ({ name, publisher, releaseDate, summary, url }) => html`
              <article itemscope itemtype="https://schema.org/CreativeWork">
                <header>
                  <h4>${Link(url, name, 'name')}</h4>
                  <div class="meta">
                    ${publisher &&
                    html`<div>
                      Published by
                      <strong itemprop="publisher" itemscope itemtype="https://schema.org/Organization"
                        ><span itemprop="name">${publisher}</span></strong
                      >
                    </div>`}
                    ${releaseDate && DateTime(releaseDate, 'datePublished')}
                  </div>
                </header>
                ${summary && html`<div itemprop="description">${markdown(summary)}</div>`}
              </article>
            `,
          )}
        </div>
      </section>
    `
  )
}
