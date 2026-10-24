import { useRef } from 'react'
import parse, { attributesToProps, domToReact } from 'html-react-parser'
import { motion, useInView, useReducedMotion } from 'motion/react'
import content from './content.html?raw'
import HeroSection from './HeroSection.jsx'
import InterviewSection from './InterviewSection.jsx'
import './motion-lp.css'

function Reveal({ rootRef, children, as = 'div', delay = 0, variant = 'shell', ...props }) {
  const ref = useRef(null)
  const visible = useInView(ref, { root: rootRef, amount: 0.25, once: true })
  const reduceMotion = useReducedMotion()
  const Element = motion[as]
  const movement = variant === 'card'
    ? { opacity: [0.12, 1], x: [delay % .12 ? 70 : -70, 0], scale: [.88, 1] }
    : { opacity: [0.28, 1], y: [46, 0] }

  return (
    <Element
      {...props}
      ref={ref}
      animate={visible && !reduceMotion ? movement : undefined}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, .3, 1] }}
    >
      {children}
    </Element>
  )
}

export default function App() {
  const scrollRef = useRef(null)
  const options = {
    replace(node) {
      if (node.type !== 'tag') return undefined
      const props = attributesToProps(node.attribs || {})
      if (node.name === 'main' && props.className === 'swipe-container') {
        return <main {...props} ref={scrollRef}>{domToReact(node.children, options)}</main>
      }
      if (node.name === 'section' && props.id === 'section-01') return <HeroSection id="section-01" scrollRef={scrollRef} />
      if (node.name === 'section' && props.id === 'section-13') return <HeroSection id="section-13" scrollRef={scrollRef} final />
      if (node.name === 'section' && props.id === 'section-11') return <InterviewSection kind="sns" scrollRef={scrollRef} />
      if (node.name === 'section' && props.id === 'section-12') return <InterviewSection kind="design" scrollRef={scrollRef} />
      if (node.name === 'div' && props.className?.split(' ').includes('section-shell')) {
        return <Reveal {...props} rootRef={scrollRef}>{domToReact(node.children, options)}</Reveal>
      }
      const itemClass = props.className || ''
      const isPainItem = node.name === 'li' && node.parent?.attribs?.class === 'pain-list'
      const isCard = node.name === 'article' && /(?:learn-card|speaker-card|step-card|bonus-card)/.test(itemClass)
      if (isPainItem || isCard) {
        const siblings = node.parent?.children?.filter(child => child.type === 'tag' && child.name === node.name) || []
        const delay = Math.min(siblings.indexOf(node) * 0.06, 0.24)
        return <Reveal {...props} as={node.name} delay={delay} variant="card" rootRef={scrollRef}>{domToReact(node.children, options)}</Reveal>
      }
      if (node.name === 'img' && props.fetchpriority) {
        props.fetchPriority = props.fetchpriority
        delete props.fetchpriority
        return <img {...props} />
      }
      return undefined
    }
  }
  return parse(content, options)
}
