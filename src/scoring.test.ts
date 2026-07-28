import { describe, expect, it } from 'vitest'
import { questions } from './data'
import { calculateResults, getBlockBand, getGeneralLevel, invertAnswer } from './scoring'
import type { Answer } from './types'

const allAnswers = (value: Answer) => Object.fromEntries(questions.map((question) => [question.id, value]))

describe('pontuação', () => {
  it('inverte respostas de validação', () => {
    expect([1, 2, 3, 4, 5].map((value) => invertAnswer(value as Answer))).toEqual([5, 4, 3, 2, 1])
  })

  it('calcula os limites totais de 30 e 150', () => {
    const low = allAnswers(1)
    questions.filter((q) => q.inverted).forEach((q) => { low[q.id] = 5 })
    const high = allAnswers(5)
    questions.filter((q) => q.inverted).forEach((q) => { high[q.id] = 1 })
    expect(calculateResults(low).total).toBe(30)
    expect(calculateResults(high).total).toBe(150)
  })

  it('preserva todos os empates de maior e menor bloco', () => {
    const result = calculateResults(allAnswers(3))
    expect(result.strongest).toHaveLength(5)
    expect(result.priority).toHaveLength(5)
  })

  it.each([[5, 'priority'], [9, 'priority'], [10, 'developing'], [14, 'developing'], [15, 'consistent'], [19, 'consistent'], [20, 'consolidated'], [25, 'consolidated']])('classifica bloco %i', (score, band) => {
    expect(getBlockBand(score)).toBe(band)
  })

  it.each([[30, 1], [59, 1], [60, 2], [89, 2], [90, 3], [119, 3], [120, 4], [150, 4]])('classifica total %i', (score, level) => {
    expect(getGeneralLevel(score).level).toBe(level)
  })
})
