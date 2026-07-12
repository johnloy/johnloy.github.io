import { html } from '@rbardini/html'

/**
 * @param {string} url
 * @returns {string}
 */
const formatURL = url => url.replace(/^(https?:|)\/\//, '').replace(/\/$/, '')

/**
 * Per the HTML microdata spec, itemprop on an <a> always extracts its href
 * (never its text), so a text-valued itemprop (e.g. "name") must live on an
 * inner element instead of the anchor itself.
 * @param {string} [url]
 * @param {string} [name]
 * @param {string} [itemprop]
 * @returns {string | undefined}
 */
export default function Link(url, name, itemprop) {
  if (name) {
    const inner = itemprop ? html`<span itemprop="${itemprop}">${name}</span>` : name
    return url ? html`<a href="${url}">${inner}</a>` : inner
  }
  const attr = itemprop ? ` itemprop="${itemprop}"` : ''
  return url && html`<a href="${url}"${attr}>${formatURL(url)}</a>`
}
