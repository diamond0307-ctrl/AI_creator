import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'

const lineUrl = 'https://lin.ee/Q2JH9I2'

function Rise({ children, delay = 0, className = '', active = true, as = 'div' }) {
  const Element = motion[as]
  return <Element className={className} initial={false} animate={active ? { opacity: [0.15, 1], y: [52, 0], scale: [.94, 1] } : undefined} transition={{ duration: .78, delay, ease: [0.16, 1, .3, 1] }}>{children}</Element>
}

function AtsushiPortrait() {
  return <div className="portrait-source-crop"><img src="output/imagegen/ai-design-interview-lp-v1.png" alt="石丸篤史さん" loading="lazy" /></div>
}

export default function HeroSection({ id, scrollRef, final = false }) {
  const ref = useRef(null)
  const visible = useInView(ref, { root: scrollRef, amount: .38, once: false })
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ container: scrollRef, target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, .5, 1], [60, 0, -70])
  const active = visible && !reduce

  return <section className={`swipe-section html-hero ${final ? 'html-hero--final' : ''}`} id={id} ref={ref} aria-label={final ? 'AI WORK BASIC 無料オンラインセミナーへの参加案内' : 'AI×SNS集客 無料オンラインセミナー'}>
    <div className="html-hero-glow" aria-hidden="true" />
    <div className="html-hero-inner">
      <Rise className="hero-intro" active={active} delay={0}>
        <div className="hero-pills"><span>AI初心者OK</span><span>事業主・経営者向け</span></div>
        <p className="hero-question">毎日のSNS投稿、<strong>時間をかけすぎて</strong>いませんか？</p>
      </Rise>
      <Rise className="hero-heading" active={active} delay={.12}>
        <p className="hero-title-top"><strong>ゼロ</strong>から学ぶ</p>
        <h1>AI <span>×</span> SNS集客</h1>
        <p className="hero-sub">仕事に活かす、最初の一歩。</p>
      </Rise>
      <Rise className="hero-bonus" active={active} delay={.24}>
        <div><p className="hero-bonus-label">セミナー参加特典</p><p className="hero-bonus-copy">思い通りのデザインができる</p><strong>プロンプト<span>400</span></strong></div>
        <img src="output/imagegen/lab-assets/lab-bonus-prompt-catalog-v1.png" alt="プロンプトカタログの表紙" width="1145" height="1374" loading="lazy" />
      </Rise>
      <Rise className="hero-event-title" active={active} delay={.29} as="p">無料オンラインセミナー</Rise>
      <motion.div className="hero-speakers" style={reduce ? undefined : { y: portraitY }}>
        <Rise className="hero-speaker hero-speaker--kunio" active={active} delay={.33}><div className="hero-speaker-photo"><img src="portraits/kunio.jpg" alt="五十嵐邦夫さん" width="3265" height="4898" loading="lazy" /></div><p>AI×Web集客クリエイター養成講座 主宰</p><strong>五十嵐 邦夫</strong></Rise>
        <Rise className="hero-speaker hero-speaker--atsushi" active={active} delay={.42}><div className="hero-speaker-photo"><AtsushiPortrait /></div><p>AIデザイン＆クリエイティブ</p><strong>石丸 篤史</strong></Rise>
      </motion.div>
      <Rise className="hero-date" active={active} delay={.5}><strong>2026.10.31 <small>（土）</small></strong><span>20:00–22:00 <i /> <b>50名限定</b></span></Rise>
      <Rise className="hero-action" active={active} delay={.58}><a className="hero-html-cta" href={lineUrl} target="_blank" rel="noopener" aria-label="LINEで無料セミナーのZoom参加案内を受け取る"><span className="line-bubble">LINE</span><span className="hero-cta-copy"><span>LINEで無料セミナーの案内を受け取る</span><small>友だち追加後、LINEでZoom参加案内をご確認ください</small></span><b aria-hidden="true">›</b></a></Rise>
    </div>
    <span className="hero-progress-cue" aria-hidden="true">{final ? '最後までご覧いただき、ありがとうございます' : 'SWIPE TO EXPLORE ↓'}</span>
  </section>
}
