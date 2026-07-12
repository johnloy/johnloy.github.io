import { html } from '@rbardini/html'
import markdown from '../utils/markdown.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['references']} references
 * @returns {string | false}
 */
export default function References(references = []) {
  return (
    references.length > 0 &&
    html`
      <section id="references">
        <h3>References</h3>
        <div class="stack">
          ${references.map(
            ({ name, reference }) => html`
              <blockquote itemscope itemtype="https://schema.org/Review">
                ${reference && html`<div itemprop="reviewBody">${markdown(reference)}</div>`}
                ${name &&
                html`
                  <p>
                    <cite itemprop="author" itemscope itemtype="https://schema.org/Person"
                      ><span itemprop="name">${name}</span></cite
                    >
                  </p>
                `}
              </blockquote>
            `,
          )}
        </div>
      </section>
    `
  )
}
