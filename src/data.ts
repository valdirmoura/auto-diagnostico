import type { BandKey, BlockDefinition, BlockId, Question } from './types'

export const scale = [
  { value: 1, label: 'Nunca' },
  { value: 2, label: 'Raramente' },
  { value: 3, label: 'Às vezes' },
  { value: 4, label: 'Frequentemente' },
  { value: 5, label: 'Quase sempre' },
] as const

export const blocks: BlockDefinition[] = [
  { id: 'selfAwareness', name: 'Autoconsciência', shortName: 'Consciência', description: 'Perceber emoções, gatilhos, forças e limitações antes de agir.' },
  { id: 'selfRegulation', name: 'Autorregulação', shortName: 'Regulação', description: 'Conduzir emoções com respeito, equilíbrio e clareza, inclusive sob pressão.' },
  { id: 'relationships', name: 'Relacionamento e Comunicação', shortName: 'Comunicação', description: 'Escutar, dialogar e expressar necessidades de forma clara e respeitosa.' },
  { id: 'responsibility', name: 'Responsabilidade e Protagonismo', shortName: 'Protagonismo', description: 'Assumir escolhas, aprender com erros e agir com disciplina.' },
  { id: 'resilience', name: 'Resiliência e Adaptabilidade', shortName: 'Resiliência', description: 'Responder a mudanças, frustrações e conversas difíceis com flexibilidade.' },
]

const makeQuestions = (block: Question['block'], texts: string[], inverted = false): Question[] =>
  texts.map((text, index) => ({ id: `${block}-${index + 1}`, text, block, inverted }))

export const questions: Question[] = [
  ...makeQuestions('selfAwareness', [
    'Consigo identificar quando minhas emoções estão influenciando minhas decisões.',
    'Reconheço facilmente quais situações despertam irritação, ansiedade ou insegurança em mim.',
    'Antes de reagir, percebo o que estou sentindo.',
    'Tenho consciência dos meus pontos fortes e das minhas limitações.',
    'Admito meus erros sem precisar justificar ou procurar culpados.',
  ]),
  ...makeQuestions('selfRegulation', [
    'Consigo fazer uma pausa antes de responder quando estou emocionalmente abalado(a).',
    'Mantenho o respeito mesmo quando discordo profundamente de alguém.',
    'Meu humor raramente interfere na forma como trato outras pessoas.',
    'Consigo separar emoções momentâneas das decisões que preciso tomar.',
    'Em situações de pressão, mantenho equilíbrio e clareza.',
  ]),
  ...makeQuestions('relationships', [
    'Escuto atentamente antes de responder.',
    'Demonstro interesse genuíno pelas pessoas.',
    'Sei dar feedback com respeito e objetividade.',
    'Recebo críticas sem reagir imediatamente de forma defensiva.',
    'Expresso minhas necessidades e limites de maneira clara e respeitosa.',
  ]),
  ...makeQuestions('responsibility', [
    'Procuro soluções antes de apresentar problemas.',
    'Assumo responsabilidade pelos resultados do meu trabalho.',
    'Busco aprender com erros em vez de escondê-los.',
    'Cumpro compromissos mesmo quando estou desmotivado(a).',
    'Tenho disciplina para manter comportamentos positivos ao longo do tempo.',
  ]),
  ...makeQuestions('resilience', [
    'Consigo manter a calma diante de mudanças inesperadas.',
    'Transformo dificuldades em oportunidades de aprendizado.',
    'Recupero-me rapidamente após uma frustração.',
    'Mudanças não costumam comprometer minha produtividade.',
    'Enfrento conversas difíceis sem evitá-las.',
  ]),
  ...makeQuestions('validation', [
    'Costumo responder por impulso quando me sinto contrariado(a).',
    'Frequentemente culpo fatores externos pelos meus resultados.',
    'Tenho dificuldade em aceitar opiniões diferentes da minha.',
    'Meu humor interfere na forma como trato as pessoas.',
    'Evito conversas difíceis sempre que possível.',
  ], true),
]

export const bandLabels: Record<BandKey, string> = {
  priority: 'Atenção prioritária',
  developing: 'Em desenvolvimento',
  consistent: 'Consistente',
  consolidated: 'Bem consolidada',
}

type Reading = Record<BandKey, { interpretation: string; action: string }>

export const blockReadings: Record<BlockId, Reading> = {
  selfAwareness: {
    priority: { interpretation: 'Perceber emoções e gatilhos ainda pode ser difícil no momento em que eles surgem.', action: 'Durante uma semana, nomeie a emoção e o gatilho antes de tomar uma decisão importante.' },
    developing: { interpretation: 'Você já reconhece parte dos seus padrões, mas essa percepção pode chegar depois da reação.', action: 'Faça uma pausa diária e registre uma situação, a emoção sentida e a resposta escolhida.' },
    consistent: { interpretation: 'Você costuma reconhecer emoções, limites e pontos fortes antes de agir.', action: 'Aprofunde a percepção observando também sinais físicos que antecedem emoções intensas.' },
    consolidated: { interpretation: 'A leitura dos próprios estados emocionais aparece como um recurso muito presente.', action: 'Use essa clareza para pedir feedback e verificar se sua autopercepção coincide com o impacto nos outros.' },
  },
  selfRegulation: {
    priority: { interpretation: 'Em situações intensas, a reação imediata pode ocupar o lugar de uma resposta escolhida.', action: 'Pratique uma pausa de três respirações antes de responder a contrariedades.' },
    developing: { interpretation: 'Você consegue se regular em alguns contextos, mas ainda oscila sob pressão.', action: 'Escolha um gatilho recorrente e prepare antecipadamente uma resposta respeitosa.' },
    consistent: { interpretation: 'Equilíbrio e respeito costumam permanecer presentes mesmo em situações desafiadoras.', action: 'Observe quais condições ajudam você a manter clareza e transforme-as em rotina.' },
    consolidated: { interpretation: 'Você demonstra forte capacidade de conduzir emoções sem perder clareza ou respeito.', action: 'Compartilhe práticas de pausa e regulação sem assumir que funcionam igual para todas as pessoas.' },
  },
  relationships: {
    priority: { interpretation: 'Escuta, feedback e expressão de limites podem gerar tensão ou respostas defensivas.', action: 'Em uma conversa, resuma o que ouviu antes de apresentar seu ponto de vista.' },
    developing: { interpretation: 'Há recursos de comunicação disponíveis, mas eles nem sempre permanecem em conversas difíceis.', action: 'Prepare um feedback usando fato observado, impacto e pedido claro.' },
    consistent: { interpretation: 'Você tende a combinar escuta, clareza e respeito na maior parte das interações.', action: 'Peça a alguém de confiança um retorno sobre sua escuta em situações de discordância.' },
    consolidated: { interpretation: 'Comunicação e qualidade de relacionamento aparecem como competências muito presentes.', action: 'Use essa habilidade para facilitar diálogos, preservando espaço para vozes diferentes.' },
  },
  responsibility: {
    priority: { interpretation: 'Assumir escolhas e manter compromissos pode ser especialmente difícil diante de erros ou desmotivação.', action: 'Escolha um resultado recente e registre uma ação concreta que estava sob seu controle.' },
    developing: { interpretation: 'Você reconhece sua responsabilidade, mas a consistência pode variar conforme o contexto.', action: 'Transforme um compromisso importante em uma ação pequena, observável e com prazo.' },
    consistent: { interpretation: 'Você costuma buscar soluções, aprender com erros e sustentar compromissos.', action: 'Revise semanalmente um compromisso e ajuste o método sem abandonar o objetivo.' },
    consolidated: { interpretation: 'Protagonismo, aprendizagem e disciplina aparecem como recursos fortemente estabelecidos.', action: 'Ajude a criar contextos de responsabilidade compartilhada, sem centralizar todas as soluções.' },
  },
  resilience: {
    priority: { interpretation: 'Mudanças, frustrações ou conversas difíceis podem consumir muita energia e reduzir a capacidade de resposta.', action: 'Diante de uma mudança, separe por escrito o que você controla, influencia e precisa aceitar.' },
    developing: { interpretation: 'Você se recupera e se adapta, mas alguns desafios ainda prolongam o desequilíbrio.', action: 'Após uma dificuldade, identifique um aprendizado e o próximo passo possível nas próximas 24 horas.' },
    consistent: { interpretation: 'Você tende a recuperar o ritmo e preservar a produtividade diante de mudanças.', action: 'Mapeie os recursos e pessoas que apoiam sua recuperação para acioná-los conscientemente.' },
    consolidated: { interpretation: 'Flexibilidade e recuperação aparecem como capacidades muito presentes diante de adversidades.', action: 'Use sua estabilidade para apoiar mudanças coletivas sem minimizar o tempo de adaptação dos outros.' },
  },
}
