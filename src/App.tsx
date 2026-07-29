import { useEffect, useMemo, useRef, useState } from 'react'
import { bandLabels, blockReadings, blocks, questions, scale } from './data'
import { calculateResults, getGeneralLevel, type Answers } from './scoring'
import type { Answer, BandKey } from './types'

type Screen = 'home' | 'instructions' | 'assessment' | 'result' | 'learn'

const levelRanges = [
  { range: '30–59', ...getGeneralLevel(30) },
  { range: '60–89', ...getGeneralLevel(60) },
  { range: '90–119', ...getGeneralLevel(90) },
  { range: '120–150', ...getGeneralLevel(120) },
]

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      {[15, 24, 34, 24, 15].map((height, index) => <i key={index} style={{ height }} />)}
    </span>
  )
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`logo ${inverse ? 'logo--inverse' : ''}`}>
      <Mark />
      <span><strong>Auto</strong>Diagnóstico</span>
    </span>
  )
}

function PrivacyNote({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`privacy-note ${compact ? 'privacy-note--compact' : ''}`}>
      <span className="privacy-icon" aria-hidden="true">✓</span>
      <div>
        <strong>Nada é enviado ou armazenado.</strong>
        {!compact && <p>Sem cadastro, cookies ou histórico. Suas respostas existem somente nesta tela e desaparecem ao atualizar ou fechar.</p>}
      </div>
    </div>
  )
}

function IndependenceNote() {
  return <p className="independence-note">Instrumento independente, elaborado para fins educativos e de reflexão. Não afiliado a autores, editoras ou metodologias comerciais.</p>
}

function Shell({ children, onHome }: { children: React.ReactNode; onHome: () => void }) {
  return (
    <div className="app-shell">
      <header className="site-header no-print">
        <button className="logo-button" onClick={onHome} aria-label="Ir para o início"><Logo /></button>
      </header>
      {children}
    </div>
  )
}

function Home({ onStart }: { onStart: () => void }) {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero__copy reveal">
          <span className="eyebrow">Uma leitura pessoal em cinco dimensões</span>
          <h1>Perceba seus padrões.<br /><em>Escolha o próximo passo.</em></h1>
          <p className="hero__lead">Um autodiagnóstico para compreender como você reage diante de desafios, conflitos, pressão e relacionamentos profissionais.</p>
          <div className="hero__actions">
            <button className="button button--primary" onClick={onStart}>Iniciar autodiagnóstico <span aria-hidden="true">→</span></button>

          </div>
          <div className="facts" aria-label="Informações da avaliação">
            <span><b>30</b> afirmações</span><span><b>≈ 5</b> minutos</span><span><b>0</b> dados solicitados</span>
          </div>
        </div>
        <div className="hero__visual reveal reveal--delay" aria-hidden="true">
          <div className="signal-card">
            <span className="signal-card__label">LEITURA PESSOAL</span>
            <div className="signal-lines">{blocks.map((block, index) => <i key={block.id} style={{ '--level': `${42 + index * 10}%` } as React.CSSProperties} />)}</div>
            <div className="signal-card__footer"><span>5 dimensões</span><Mark /></div>
          </div>
          <span className="orbit orbit--one" /><span className="orbit orbit--two" />
        </div>
      </section>
      <section className="home__lower">
        <PrivacyNote />
        <div><p className="clinical-note">Ferramenta de reflexão e desenvolvimento pessoal. Não constitui avaliação clínica ou psicológica.</p><IndependenceNote /></div>
      </section>
    </main>
  )
}

function Instructions({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <main className="narrow-page page-enter">
      <button className="back-link no-print" onClick={onBack}>← Voltar</button>
      <span className="eyebrow">Antes de começar</span>
      <h1>Responda pensando no que você faz hoje.</h1>
      <p className="intro">Não existem respostas certas ou erradas. Considere seu comportamento habitual, não o comportamento que gostaria de ter.</p>
      <div className="scale-preview">
        {scale.map((item) => <div key={item.value}><span>{item.value}</span><strong>{item.label}</strong></div>)}
      </div>
      <div className="instruction-grid">
        <div><span className="step-number">01</span><h2>Uma por vez</h2><p>Leia cada afirmação com calma e escolha a frequência que mais representa você.</p></div>
        <div><span className="step-number">02</span><h2>Você controla o ritmo</h2><p>É possível voltar e alterar respostas antes de concluir.</p></div>
        <div><span className="step-number">03</span><h2>Só nesta sessão</h2><p>Atualizar ou fechar esta página apaga todo o progresso.</p></div>
      </div>
      <PrivacyNote />
      <button className="button button--primary button--wide" onClick={onStart}>Entendi, vamos começar <span aria-hidden="true">→</span></button>
    </main>
  )
}

function Assessment({ answers, setAnswers, onFinish, onExit }: { answers: Answers; setAnswers: React.Dispatch<React.SetStateAction<Answers>>; onFinish: () => void; onExit: () => void }) {
  const firstUnanswered = Math.max(0, questions.findIndex((q) => answers[q.id] === undefined))
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const question = questions[index]
  const selected = answers[question.id]

  useEffect(() => { headingRef.current?.focus() }, [index])
  useEffect(() => {
    const preventExit = (event: BeforeUnloadEvent) => { if (Object.keys(answers).length > 0) event.preventDefault() }
    window.addEventListener('beforeunload', preventExit)
    return () => window.removeEventListener('beforeunload', preventExit)
  }, [answers])

  const next = () => {
    if (!selected) return
    if (index === questions.length - 1) onFinish()
    else setIndex((current) => current + 1)
  }

  return (
    <main className="assessment page-enter">
      <div className="assessment__top">
        <button className="assessment__brand" onClick={onExit} aria-label="Sair da avaliação"><Logo inverse /></button>
        <span className="assessment__count"><b>{String(index + 1).padStart(2, '0')}</b> / {questions.length}</span>
      </div>
      <div className="progress" role="progressbar" aria-label={`Pergunta ${index + 1} de ${questions.length}`} aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1}>
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <section className="question-panel">
        <div className="question-panel__content">
          <span className="eyebrow eyebrow--light">O quanto esta afirmação representa você?</span>
          <h1 ref={headingRef} tabIndex={-1}>{question.text}</h1>
          <fieldset className="answer-scale">
            <legend className="sr-only">Escolha uma frequência</legend>
            {scale.map((item) => (
              <label key={item.value} className={selected === item.value ? 'is-selected' : ''}>
                <input type="radio" name={question.id} value={item.value} checked={selected === item.value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: item.value as Answer }))} />
                <span className="answer-number">{item.value}</span><span className="answer-label">{item.label}</span><span className="answer-check" aria-hidden="true">✓</span>
              </label>
            ))}
          </fieldset>
        </div>
      </section>
      <div className="assessment__footer">
        <button className="button button--dark-quiet" disabled={index === 0} onClick={() => setIndex((current) => current - 1)}>← Voltar</button>
        <p>Anônimo · nada é salvo · atualizar apaga o progresso · não é avaliação clínica.</p>
        <button className="button button--primary" disabled={!selected} onClick={next}>{index === questions.length - 1 ? 'Ver resultado' : 'Continuar'} <span aria-hidden="true">→</span></button>
      </div>
    </main>
  )
}

function Result({ answers, onRestart, onLearn }: { answers: Answers; onRestart: () => void; onLearn: () => void }) {
  const result = useMemo(() => calculateResults(answers), [answers])
  const generatedAt = useMemo(() => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date()), [])
  const names = (items: typeof result.blocks) => items.map((item) => item.name).join(', ')

  return (
    <main className="result-page page-enter">
      <div className="print-header"><Logo /><span>{generatedAt}</span></div>
      <section className="result-hero">
        <div>
          <span className="eyebrow eyebrow--light">Sua leitura neste momento</span>
          <span className="level-pill">Nível {result.general.level}</span>
          <h1>{result.general.title}</h1>
          <p>{result.general.description}</p>
        </div>
        <div className="score-dial" aria-label={`${result.total} de 150 pontos`}>
          <svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="76" /><circle className="score-dial__value" cx="90" cy="90" r="76" pathLength="100" strokeDasharray={`${((result.total - 30) / 120) * 100} 100`} /></svg>
          <span><b>{result.total}</b><small>de 150</small></span>
        </div>
      </section>

      <section className="result-summary">
        <div><span className="summary-label">Mais consolidada</span><strong>{names(result.strongest)}</strong></div>
        <div><span className="summary-label">Prioridade de desenvolvimento</span><strong>{names(result.priority)}</strong></div>
      </section>

      <section className="result-content">
        <div className="section-heading"><div><span className="eyebrow">Suas cinco dimensões</span><h2>Uma leitura por competência</h2></div><p>As pontuações mostram tendências a partir das respostas dadas hoje. Use-as como ponto de partida, não como rótulo.</p></div>
        <div className="block-results">
          {result.blocks.map((block, index) => (
            <article className="block-card" key={block.id}>
              <div className="block-card__index">0{index + 1}</div>
              <div className="block-card__main">
                <div className="block-card__heading"><div><h3>{block.name}</h3><span className={`band band--${block.band}`}>{block.bandLabel}</span></div><strong>{block.score}<small>/25</small></strong></div>
                <div className="meter" aria-label={`${block.percentage}% do intervalo da competência`}><span style={{ width: `${block.percentage}%` }} /></div>
                <p>{block.interpretation}</p>
                <div className="action-callout"><span>Próximo passo</span><p>{block.action}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="focus-card">
        <span className="eyebrow eyebrow--light">Foco de desenvolvimento</span>
        <h2>Transforme uma intenção em hábito.</h2>
        <ul>{result.general.focus.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>Escolha uma competência para desenvolver nos próximos 30 dias e defina uma ação prática.</p>
      </section>

      <section className="result-actions no-print">
        <button className="button button--primary" onClick={() => window.print()}>Imprimir ou salvar em PDF</button>

        <button className="button button--quiet" onClick={onRestart}>Refazer avaliação</button>
      </section>
      <div className="result-disclaimer"><PrivacyNote /><div><p>Este autodiagnóstico apoia reflexão e desenvolvimento pessoal. Não constitui avaliação clínica ou psicológica.</p><IndependenceNote /><button className="footer-methodology-link no-print" onClick={onLearn}>Entenda todos os resultados</button></div></div>
    </main>
  )
}

function Learn({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const bands: BandKey[] = ['priority', 'developing', 'consistent', 'consolidated']
  const ranges: Record<BandKey, string> = { priority: '5–9', developing: '10–14', consistent: '15–19', consolidated: '20–25' }
  return (
    <main className="learn-page page-enter">
      <section className="learn-hero">
        <button className="back-link back-link--light no-print" onClick={onBack}>← Voltar</button>
        <span className="eyebrow eyebrow--light">Guia de interpretação</span>
        <h1>Entenda todos os resultados possíveis.</h1>
        <p>A pontuação organiza tendências em faixas para apoiar reflexão. Ela não define quem você é nem substitui uma avaliação profissional.</p><IndependenceNote />
      </section>
      <div className="learn-content">
        <section>
          <div className="section-heading"><div><span className="eyebrow">Resultado geral</span><h2>Quatro níveis de leitura</h2></div><p>O total varia de 30 a 150 pontos e considera as 30 afirmações.</p></div>
          <div className="levels-grid">
            {levelRanges.map((level) => <article key={level.level}><span className="level-number">0{level.level}</span><span className="range">{level.range} pontos</span><h3>{level.title}</h3><p>{level.description}</p><strong>Focos possíveis</strong><ul>{level.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul></article>)}
          </div>
        </section>
        <section className="method-section">
          <div className="section-heading"><div><span className="eyebrow">Cinco dimensões</span><h2>Como ler cada competência</h2></div><p>Cada dimensão varia de 5 a 25 pontos. Faixas iguais ganham significados próprios conforme a competência.</p></div>
          {blocks.map((block, index) => (
            <article className="dimension" key={block.id}>
              <header><span>0{index + 1}</span><div><h3>{block.name}</h3><p>{block.description}</p></div></header>
              <div className="reading-grid">{bands.map((band) => <div key={band}><span className={`band band--${band}`}>{ranges[band]} · {bandLabels[band]}</span><p>{blockReadings[block.id][band].interpretation}</p><strong>Ação prática</strong><p>{blockReadings[block.id][band].action}</p></div>)}</div>
            </article>
          ))}
        </section>
        <section className="methodology">
          <div><span className="eyebrow eyebrow--light">Metodologia</span><h2>Como o cálculo funciona</h2></div>
          <div><p>Cada resposta vale de 1 (“Nunca”) a 5 (“Quase sempre”). Cinco questões finais são redigidas no sentido inverso e têm a pontuação convertida: 1 vale 5, 2 vale 4, 3 permanece 3, 4 vale 2 e 5 vale 1.</p><p>Essa inversão reduz respostas automáticas. Ela participa apenas do resultado geral e não aparece como uma sexta competência.</p></div>
        </section>
        <section className="learn-cta no-print"><h2>Pronto para fazer sua leitura?</h2><button className="button button--primary" onClick={onStart}>Iniciar autodiagnóstico →</button></section>
      </div>
    </main>
  )
}

const ADMIN_METHODOLOGY_PATH = '/resultados-metodologia'

function tokenFromPath(pathname: string) {
  return pathname.startsWith('/r/') ? pathname.slice(3) : null
}

export default function App() {
  const initialPath = useRef(window.location.pathname).current
  const initialScreen: Screen = initialPath === ADMIN_METHODOLOGY_PATH ? 'learn' : 'home'
  const [screen, setScreenState] = useState<Screen>(initialScreen)
  const [answers, setAnswers] = useState<Answers>({})
  const [methodologyToken, setMethodologyToken] = useState<string | null>(null)

  const hasCompletedAssessment = Object.keys(answers).length === questions.length

  const setScreen = (next: Screen, path = '/') => {
    setScreenState(next)
    window.history.pushState({ screen: next }, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    if (tokenFromPath(initialPath)) {
      window.history.replaceState({ screen: 'home' }, '', '/')
      setScreenState('home')
      return
    }

    window.history.replaceState({ screen: initialScreen }, '', initialPath)
  }, [initialPath, initialScreen])

  useEffect(() => {
    const navigate = (event: PopStateEvent) => {
      const pathname = window.location.pathname
      const token = tokenFromPath(pathname)
      const mayViewMethodology = pathname === ADMIN_METHODOLOGY_PATH
        || (Boolean(token) && token === methodologyToken && hasCompletedAssessment)
      const requestedScreen = event.state?.screen as Screen | undefined

      if ((requestedScreen === 'learn' || token) && !mayViewMethodology) {
        window.history.replaceState({ screen: 'home' }, '', '/')
        setScreenState('home')
        return
      }

      setScreenState(requestedScreen ?? (pathname === ADMIN_METHODOLOGY_PATH ? 'learn' : 'home'))
    }

    window.addEventListener('popstate', navigate)
    return () => window.removeEventListener('popstate', navigate)
  }, [hasCompletedAssessment, methodologyToken])

  const finishAssessment = () => {
    setMethodologyToken(window.crypto.randomUUID())
    setScreen('result')
  }

  const openMethodology = () => {
    if (!methodologyToken || !hasCompletedAssessment) return
    setScreen('learn', `/r/${methodologyToken}`)
  }

  const reset = () => {
    if (Object.keys(answers).length > 0 && !window.confirm('Refazer a avaliação apagará todas as respostas desta sessão. Deseja continuar?')) return
    setAnswers({})
    setMethodologyToken(null)
    setScreen('home')
  }

  if (screen === 'assessment') return <Assessment answers={answers} setAnswers={setAnswers} onFinish={finishAssessment} onExit={reset} />

  return (
    <Shell onHome={reset}>
      {screen === 'home' && <Home onStart={() => setScreen('instructions')} />}
      {screen === 'instructions' && <Instructions onBack={() => setScreen('home')} onStart={() => setScreen('assessment')} />}
      {screen === 'result' && <Result answers={answers} onRestart={reset} onLearn={openMethodology} />}
      {screen === 'learn' && <Learn onBack={() => setScreen(hasCompletedAssessment ? 'result' : 'home')} onStart={() => setScreen('instructions')} />}
    </Shell>
  )
}
