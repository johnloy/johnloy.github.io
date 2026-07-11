import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const resumePath = resolve('resume.json')
export const summaryPath = resolve('summary.txt')
export const skillsPath = resolve('skills.md')

export function parseSkillsMarkdown(content) {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => {
      const [name = '', level = '', keywords = ''] = line
        .slice(1)
        .split('|')
        .map(part => part.trim())
      return {
        name,
        level,
        keywords: keywords
          ? keywords.split(',').map(keyword => keyword.trim()).filter(Boolean)
          : [],
      }
    })
}

export function loadResume() {
  const resume = JSON.parse(readFileSync(resumePath, 'utf-8'))
  try {
    resume.basics.summary = readFileSync(summaryPath, 'utf-8').trim()
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  try {
    resume.skills = parseSkillsMarkdown(readFileSync(skillsPath, 'utf-8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  return resume
}
