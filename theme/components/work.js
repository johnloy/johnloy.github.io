import { html } from '@rbardini/html'
import markdown from '../utils/markdown.js'
import DateTimeDuration from './date-time-duration.js'
import Duration from './duration.js'
import Link from './link.js'

/** @typedef {NonNullable<import('../schema.d.ts').ResumeSchema['work']>[number]} Work */
/** @typedef {Pick<Work, 'highlights' | 'location' | 'position' | 'startDate' | 'endDate' | 'summary'>} NestedWorkItem */
/** @typedef {Pick<Work, 'description' | 'name' | 'url'> & { items: NestedWorkItem[] }} NestedWork */

/**
 * @param {import('../schema.d.ts').ResumeSchema['work']} work
 * @returns {string | false}
 */
export default function Work(work = []) {
  const nestedWork = work.reduce((acc, { description, name, url, ...rest }) => {
    const prev = acc[acc.length - 1]
    if (prev && prev.name === name && prev.description === description && prev.url === url) prev.items.push(rest)
    else acc.push({ description, name, url, items: [rest] })
    return acc
  }, /** @type {NestedWork[]} */ ([]))

  return (
    work.length > 0 &&
    html`
      <section id="work">
        <h3>Work</h3>
        <div class="stack">
          ${nestedWork.map(({ description, name, url, items = [] }) => {
            const singleItem = items.length === 1 ? items[0] : undefined
            return html`
              <article itemprop="alumniOf" itemscope itemtype="https://schema.org/Organization">
                <header>
                  <h4>${singleItem ? singleItem.position : Link(url, name, 'name')}</h4>
                  <div class="meta">
                    ${singleItem
                      ? html`
                          <div>
                            ${[
                              html`<strong>${Link(url, name, 'name')}</strong>`,
                              description && html`<span itemprop="description">${description}</span>`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </div>
                          ${singleItem.startDate &&
                          html`<div>${DateTimeDuration(singleItem.startDate, singleItem.endDate)}</div>`}
                          ${singleItem.location && html`<div>${singleItem.location}</div>`}
                        `
                      : html`
                          ${description && html`<div itemprop="description">${description}</div>`}
                          ${items.some(item => item.startDate) && html`<div>${Duration(items)}</div>`}
                        `}
                  </div>
                </header>
                <div class="timeline">
                  ${items.map(
                    ({ highlights = [], location, position, startDate, endDate, summary }) => html`
                      <div itemprop="employee" itemscope itemtype="https://schema.org/EmployeeRole">
                        ${singleItem &&
                        html`<meta itemprop="roleName" content="${position}" />
                          ${startDate && html`<meta itemprop="startDate" content="${startDate}" />`}
                          ${endDate && html`<meta itemprop="endDate" content="${endDate}" />`}`}
                        ${!singleItem &&
                        html`
                          <div>
                            <h5 itemprop="roleName">${position}</h5>
                            <div class="meta">
                              ${startDate &&
                              html`<div>
                                ${DateTimeDuration(startDate, endDate, {
                                  startItemprop: 'startDate',
                                  endItemprop: 'endDate',
                                })}
                              </div>`}
                              ${location && html`<div>${location}</div>`}
                            </div>
                          </div>
                        `}
                        ${summary && html`<div itemprop="description">${markdown(summary)}</div>`}
                        ${highlights.length > 0 &&
                        html`
                          <ul>
                            ${highlights.map(highlight => html`<li>${markdown(highlight)}</li>`)}
                          </ul>
                        `}
                      </div>
                    `,
                  )}
                </div>
              </article>
            `
          })}
        </div>
      </section>
    `
  )
}
