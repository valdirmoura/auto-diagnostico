export type BlockId = 'selfAwareness' | 'selfRegulation' | 'relationships' | 'responsibility' | 'resilience'

export type Question = {
  id: string
  text: string
  block: BlockId | 'validation'
  inverted?: boolean
}

export type Answer = 1 | 2 | 3 | 4 | 5

export type BlockDefinition = {
  id: BlockId
  name: string
  shortName: string
  description: string
}

export type BandKey = 'priority' | 'developing' | 'consistent' | 'consolidated'

export type BlockResult = BlockDefinition & {
  score: number
  percentage: number
  band: BandKey
  bandLabel: string
  interpretation: string
  action: string
}
