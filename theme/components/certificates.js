import { html } from '@rbardini/html'
import DateTime from './date-time.js'
import Link from './link.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['certificates']} certificates
 * @returns {string | false}
 */
export default function Certificates(certificates = []) {
  return (
    certificates.length > 0 &&
    html`
      <section id="certificates">
        <h3>Certificates</h3>
        <div class="stack">
          ${certificates.map(
            ({ date, issuer, name, url }) => html`
              <article itemprop="hasCredential" itemscope itemtype="https://schema.org/EducationalOccupationalCredential">
                <header>
                  <h4>${Link(url, name, 'name')}</h4>
                  <div class="meta">
                    ${issuer &&
                    html`<div>
                      Issued by
                      <strong itemprop="recognizedBy" itemscope itemtype="https://schema.org/Organization"
                        ><span itemprop="name">${issuer}</span></strong
                      >
                    </div>`}
                    ${date && DateTime(date)}
                  </div>
                </header>
              </article>
            `,
          )}
        </div>
      </section>
    `
  )
}
