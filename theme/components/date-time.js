import { html } from '@rbardini/html'

/**
 * @param {string} dateString
 * @returns {string}
 */
const formatDate = dateString =>
  new Date(dateString).toLocaleDateString('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/**
 * @param {string} date
 * @param {string} [itemprop]
 * @returns {string}
 */
export default function DateTime(date, itemprop) {
  const attr = itemprop ? ` itemprop="${itemprop}"` : ''
  return html`<time datetime="${date}"${attr}>${formatDate(date)}</time>`
}
