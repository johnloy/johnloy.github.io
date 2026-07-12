import { html } from '@rbardini/html'
import markdown from '../utils/markdown.js'
import DateTimeDuration from './date-time-duration.js'
import Link from './link.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['volunteer']} volunteer
 * @returns {string | false}
 */
export default function Volunteer(volunteer = []) {
  return (
    volunteer.length > 0 &&
    html`
      <section id="volunteer">
        <h3>Volunteer</h3>
        <div class="stack">
          ${volunteer.map(
            ({ highlights = [], organization, position, startDate, endDate, summary, url }) => html`
              <article itemprop="alumniOf" itemscope itemtype="https://schema.org/Organization">
                <header>
                  <h4>${Link(url, organization, 'name')}</h4>
                </header>
                <section itemprop="employee" itemscope itemtype="https://schema.org/EmployeeRole">
                  <div class="meta">
                    <strong itemprop="roleName">${position}</strong>
                    ${startDate &&
                    html`<div>
                      ${DateTimeDuration(startDate, endDate, { startItemprop: 'startDate', endItemprop: 'endDate' })}
                    </div>`}
                  </div>
                  ${summary && html`<div itemprop="description">${markdown(summary)}</div>`}
                  ${highlights.length > 0 &&
                  html`
                    <ul>
                      ${highlights.map(highlight => html`<li>${markdown(highlight)}</li>`)}
                    </ul>
                  `}
                </section>
              </article>
            `,
          )}
        </div>
      </section>
    `
  )
}
