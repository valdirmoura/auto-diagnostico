import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const completeAssessment = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar autodiagnóstico' }))
  fireEvent.click(screen.getByRole('button', { name: /Entendi, vamos começar/ }))

  for (let index = 0; index < 30; index += 1) {
    fireEvent.click(screen.getByRole('radio', { name: /3.*Às vezes/ }))
    fireEvent.click(screen.getByRole('button', { name: index === 29 ? /Ver resultado/ : /Continuar/ }))
  }
}

describe('fluxo do AutoDiagnóstico', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    vi.spyOn(window.crypto, 'randomUUID').mockReturnValue('11111111-2222-4333-8444-555555555555')
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('não expõe interpretações antes da conclusão', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /Entenda os resultados/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/Como o cálculo funciona/)).not.toBeInTheDocument()
  })

  it('conclui as 30 perguntas e abre metodologia em caminho opaco da sessão', () => {
    render(<App />)
    completeAssessment()

    expect(screen.getByRole('heading', { name: 'Maturidade comportamental' })).toBeInTheDocument()
    expect(screen.getByLabelText('90 de 150 pontos')).toBeInTheDocument()
    expect(screen.getAllByLabelText('50% do intervalo da competência')).toHaveLength(5)

    fireEvent.click(screen.getByRole('button', { name: 'Entenda todos os resultados' }))
    expect(window.location.pathname).toBe('/r/11111111-2222-4333-8444-555555555555')
    expect(screen.getByRole('heading', { name: 'Entenda todos os resultados possíveis.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '← Voltar' }))
    expect(screen.getByRole('heading', { name: 'Maturidade comportamental' })).toBeInTheDocument()
  })

  it('permite voltar e alterar uma resposta', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar autodiagnóstico' }))
    fireEvent.click(screen.getByRole('button', { name: /Entendi, vamos começar/ }))
    fireEvent.click(screen.getByRole('radio', { name: /3.*Às vezes/ }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }))
    fireEvent.click(screen.getByRole('button', { name: '← Voltar' }))
    fireEvent.click(screen.getByRole('radio', { name: /5.*Quase sempre/ }))
    expect(screen.getByRole('radio', { name: /5.*Quase sempre/ })).toBeChecked()
  })

  it('pede confirmação antes de descartar uma sessão respondida', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar autodiagnóstico' }))
    fireEvent.click(screen.getByRole('button', { name: /Entendi, vamos começar/ }))
    fireEvent.click(screen.getByRole('radio', { name: /3.*Às vezes/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Sair da avaliação' }))
    expect(confirm).toHaveBeenCalled()
    expect(screen.getByRole('progressbar', { name: 'Pergunta 1 de 30' })).toBeInTheDocument()
  })

  it('abre a rota administrativa fixa diretamente', () => {
    window.history.replaceState({}, '', '/resultados-metodologia')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Entenda todos os resultados possíveis.' })).toBeInTheDocument()
  })

  it('recusa um caminho opaco compartilhado em outra sessão', () => {
    window.history.replaceState({}, '', '/r/token-compartilhado')
    render(<App />)
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('button', { name: 'Iniciar autodiagnóstico' })).toBeInTheDocument()
  })
})
