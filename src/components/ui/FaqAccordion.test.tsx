import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FaqAccordion from './FaqAccordion'

vi.mock('framer-motion', () => {
  const motion = new Proxy({} as Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>>, {
    get: (_target, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, rest, children),
  })
  const AnimatePresence = ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children)
  const useInView = () => true
  const useAnimation = () => ({ start: () => {}, stop: () => {} })
  const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} })
  return { motion, AnimatePresence, useInView, useAnimation, useMotionValue }
})

const items = [
  { q: 'Pergunta um', a: 'Resposta um' },
  { q: 'Pergunta dois', a: 'Resposta dois' },
  { q: 'Pergunta três', a: 'Resposta três' },
]

describe('FaqAccordion', () => {
  it('renders all question buttons', () => {
    render(<FaqAccordion items={items} />)
    expect(screen.getByText('Pergunta um')).toBeInTheDocument()
    expect(screen.getByText('Pergunta dois')).toBeInTheDocument()
    expect(screen.getByText('Pergunta três')).toBeInTheDocument()
  })

  it('answers are not visible initially', () => {
    render(<FaqAccordion items={items} />)
    expect(screen.queryByText('Resposta um')).not.toBeInTheDocument()
  })

  it('clicking a question reveals its answer', async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)
    await user.click(screen.getByText('Pergunta um'))
    expect(screen.getByText('Resposta um')).toBeInTheDocument()
  })

  it('clicking the same question again hides the answer', () => {
    render(<FaqAccordion items={items} />)
    fireEvent.click(screen.getByText('Pergunta um').closest('button')!)
    fireEvent.click(screen.getByText('Pergunta um').closest('button')!)
    expect(screen.queryByText('Resposta um')).not.toBeInTheDocument()
  })

  it('only one answer is visible at a time', () => {
    render(<FaqAccordion items={items} />)
    fireEvent.click(screen.getByText('Pergunta um').closest('button')!)
    fireEvent.click(screen.getByText('Pergunta dois').closest('button')!)
    expect(screen.queryByText('Resposta um')).not.toBeInTheDocument()
    expect(screen.getByText('Resposta dois')).toBeInTheDocument()
  })

  it('renders empty list without crashing', () => {
    render(<FaqAccordion items={[]} />)
    expect(document.querySelector('[class*="divide-y"]')).toBeInTheDocument()
  })

  it('button has aria-expanded=false when answer is hidden', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('button has aria-expanded=true when answer is visible', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('button aria-controls points to the answer panel id', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    const controlsId = btn.getAttribute('aria-controls')!
    expect(controlsId).toBeTruthy()
    fireEvent.click(btn)
    expect(document.getElementById(controlsId)).toBeInTheDocument()
  })
})
