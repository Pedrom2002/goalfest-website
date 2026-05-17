// @vitest-environment jsdom
import React from 'react'
import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockUseLocale = vi.fn().mockReturnValue('pt')

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => mockUseLocale(),
}))

vi.mock('@/data/faq.json', () => ({
  default: [
    {
      category: 'entradas',
      items: [
        { q: 'Pergunta PT?', a: 'Resposta PT.', qEn: 'Question EN?', aEn: 'Answer EN.' },
      ],
    },
  ],
}))

import FaqSection from './FaqSection'

describe('FaqSection', () => {
  it('renders without crashing', () => {
    render(<FaqSection />)
    expect(document.body).toBeTruthy()
  })

  it('uses pt questions and answers for pt locale', () => {
    mockUseLocale.mockReturnValueOnce('pt')
    render(<FaqSection />)
    expect(screen.getByText('Pergunta PT?')).toBeInTheDocument()
  })

  it('uses en questions and answers for en locale', () => {
    mockUseLocale.mockReturnValueOnce('en')
    render(<FaqSection />)
    expect(screen.getByText('Question EN?')).toBeInTheDocument()
  })
})
