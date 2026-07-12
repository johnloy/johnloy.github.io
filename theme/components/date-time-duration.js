import { html } from '@rbardini/html'
import DateTime from './date-time.js'
import Duration from './duration.js'

/**
 * @param {string} startDate
 * @param {string} [endDate]
 * @param {{ startItemprop?: string, endItemprop?: string }} [itemprops]
 * @returns {string}
 */
export default function DateTimeDuration(startDate, endDate, { startItemprop, endItemprop } = {}) {
  if (endDate === startDate) return DateTime(endDate, startItemprop)
  return html`${DateTime(startDate, startItemprop)} – ${endDate ? DateTime(endDate, endItemprop) : 'Present'} ${Duration([{ startDate, endDate }])}`
}
