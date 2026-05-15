import React from 'react'

const motion = new Proxy({} as Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>>, {
  get: (_target, tag: string) =>
    ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
      React.createElement(tag, rest, children),
})

const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>

export { motion, AnimatePresence }
