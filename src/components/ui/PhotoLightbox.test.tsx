import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import PhotoLightbox from './PhotoLightbox'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: object, tag: string) =>
      ({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement(tag, rest, children),
  }),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const photos = [
  { src: '/photo1.jpg', alt: 'Photo 1' },
  { src: '/photo2.jpg', alt: 'Photo 2' },
  { src: '/photo3.jpg', alt: 'Photo 3' },
]

describe('PhotoLightbox', () => {
  it('renders nothing when index is null', () => {
    const { container } = render(
      <PhotoLightbox photos={photos} index={null} onClose={vi.fn()} onPrev={vi.fn()} onNext={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders image when index is 0', () => {
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={vi.fn()} />
    )
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={onClose} onPrev={vi.fn()} onNext={vi.fn()} />
    )
    await user.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when prev button is clicked', async () => {
    const user = userEvent.setup()
    const onPrev = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={1} onClose={vi.fn()} onPrev={onPrev} onNext={vi.fn()} />
    )
    await user.click(screen.getByText('‹'))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={onNext} />
    )
    await user.click(screen.getByText('›'))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={onClose} onPrev={vi.fn()} onNext={vi.fn()} />
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when ArrowLeft key is pressed', async () => {
    const user = userEvent.setup()
    const onPrev = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={1} onClose={vi.fn()} onPrev={onPrev} onNext={vi.fn()} />
    )
    await user.keyboard('{ArrowLeft}')
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when ArrowRight key is pressed', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={onNext} />
    )
    await user.keyboard('{ArrowRight}')
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('moves focus to close button when lightbox opens', () => {
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={vi.fn()} />
    )
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fechar galeria' }))
  })

  it('returns focus to previously focused element when lightbox closes via Escape', async () => {
    const user = userEvent.setup()
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.appendChild(trigger)
    trigger.focus()

    const onClose = vi.fn()
    const { rerender } = render(
      <PhotoLightbox photos={photos} index={0} onClose={onClose} onPrev={vi.fn()} onNext={vi.fn()} />
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(
      <PhotoLightbox photos={photos} index={null} onClose={onClose} onPrev={vi.fn()} onNext={vi.fn()} />
    )

    expect(document.activeElement).toBe(trigger)

    document.body.removeChild(trigger)
  })

  it('focus trap: Tab from last focusable element wraps to first', async () => {
    const user = userEvent.setup()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={vi.fn()} />
    )

    const buttons = screen.getAllByRole('button')
    const last = buttons[buttons.length - 1]!
    last.focus()
    expect(document.activeElement).toBe(last)

    await user.keyboard('{Tab}')

    const first = buttons[0]!
    expect(document.activeElement).toBe(first)
  })

  it('focus trap: Shift+Tab from first focusable element wraps to last', async () => {
    const user = userEvent.setup()
    render(
      <PhotoLightbox photos={photos} index={0} onClose={vi.fn()} onPrev={vi.fn()} onNext={vi.fn()} />
    )

    const buttons = screen.getAllByRole('button')
    const first = buttons[0]!
    first.focus()
    expect(document.activeElement).toBe(first)

    await user.keyboard('{Shift>}{Tab}{/Shift}')

    const last = buttons[buttons.length - 1]!
    expect(document.activeElement).toBe(last)
  })
})
