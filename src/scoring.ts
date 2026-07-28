import { bandLabels, blockReadings, blocks, questions } from './data'
import type { Answer, BandKey, BlockResult } from './types'

export type Answers = Record<string, Answer>

export const invertAnswer = (answer: Answer): Answer => (6 - answer) as Answer

export const getBlockBand = (score: number): BandKey => {
  if (score <= 9) return 'priority'
  if (score <= 14) return 'developing'
  if (score <= 19) return 'consistent'
  return 'consolidated'
}

export const getGeneralLevel = (score: number) => {
  if (score <= 59) return {
    level: 1,
    title: 'Reatividade elevada',
    description: 'Você tende a reagir de forma impulsiva diante de conflitos, mudanças ou pressão. As emoções frequentemente influenciam suas decisões e relacionamentos.',
    focus: ['Desenvolver autoconsciência', 'Praticar pausas antes de reagir', 'Assumir maior responsabilidade pelas próprias escolhas'],
  }
  if (score <= 89) return {
    level: 2,
    title: 'Consciência em desenvolvimento',
    description: 'Você já reconhece seus comportamentos, mas ainda oscila em situações desafiadoras.',
    focus: ['Fortalecer a comunicação assertiva', 'Criar novos hábitos emocionais', 'Buscar consistência sob pressão'],
  }
  if (score <= 119) return {
    level: 3,
    title: 'Maturidade comportamental',
    description: 'Você demonstra bom equilíbrio emocional e costuma agir de forma consciente na maior parte das situações.',
    focus: ['Aprimorar influência positiva', 'Desenvolver feedback e escuta', 'Consolidar comportamentos de liderança'],
  }
  return {
    level: 4,
    title: 'Liderança emocional',
    description: 'Você apresenta elevada inteligência emocional, responsabilidade e estabilidade comportamental.',
    focus: ['Mentorar outras pessoas', 'Compartilhar boas práticas', 'Continuar evoluindo continuamente'],
  }
}

export const calculateResults = (answers: Answers) => {
  const blockResults: BlockResult[] = blocks.map((block) => {
    const score = questions
      .filter((question) => question.block === block.id)
      .reduce((sum, question) => sum + (answers[question.id] ?? 0), 0)
    const band = getBlockBand(score)
    return {
      ...block,
      score,
      percentage: Math.round(((score - 5) / 20) * 100),
      band,
      bandLabel: bandLabels[band],
      ...blockReadings[block.id][band],
    }
  })

  const validationScore = questions
    .filter((question) => question.inverted)
    .reduce((sum, question) => sum + invertAnswer(answers[question.id] ?? 1), 0)
  const total = blockResults.reduce((sum, block) => sum + block.score, 0) + validationScore
  const max = Math.max(...blockResults.map((block) => block.score))
  const min = Math.min(...blockResults.map((block) => block.score))

  return {
    total,
    validationScore,
    general: getGeneralLevel(total),
    blocks: blockResults,
    strongest: blockResults.filter((block) => block.score === max),
    priority: blockResults.filter((block) => block.score === min),
  }
}
