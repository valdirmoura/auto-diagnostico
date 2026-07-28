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
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('conclui as 30 perguntas e preserva o resultado ao consultar as interpretações', () => {
    render(<App />)
    completeAssessment()

    expect(screen.getByRole('heading', { name: 'Maturidade comportamental' })).toBeInTheDocument()
    expect(screen.getByLabelText('90 de 150 pontos')).toBeInTheDocument()
    expect(screen.getAllByLabelText('50% do intervalo da competência')).toHaveLength(5)

    fireEvent.click(screen.getByRole('button', { name: 'Entender todos os resultados' }))
    expect(screen.getByRole('heading', { name: 'Entenda todos os resultados possíveis.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '← Voltar' }))
    expect(screen.getByRole('heading', { name: 'Maturidade comportamental' })).toBeInTheDocument()
  })

  it('permite voltar, alterar uma resposta e recalcula o resultado', () => {
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

  it('abre a rota pública diretamente e retorna ao início', () => {
    window.history.replaceState({}, '', '/resultados')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Entenda todos os resultados possíveis.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '← Voltar' }))
    expect(screen.getByRole('button', { name: 'Iniciar autodiagnóstico' })).toBeInTheDocument()
  })
})


