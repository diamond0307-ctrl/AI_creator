import { DEFAULT_LINE_ATTRIBUTION } from './line-routing.js'

export default function HeroSection({ id, lineAttribution = DEFAULT_LINE_ATTRIBUTION, final = false }) {
  return <section className="swipe-section vol2-hero" id={id} aria-label="第2回 AI×SNS集客 無料オンラインセミナー">
    <div className="vol2-hero-inner">
      <img className="vol2-art" src="seminar-vol2.png" alt="ゼロから学ぶ vol.2 AI×SNS集客 無料オンラインセミナー 2026年11月7日土曜日20時" width="941" height="1672" fetchPriority={final ? 'auto' : 'high'} />
      <div className="vol2-info"><p className="vol2-eyebrow">AI WORK BASIC / VOL. 2</p><h1>AIを、<br />仕事と集客の<br /><span>力に変える。</span></h1><p className="vol2-description">ゼロから学ぶ、AI×SNS集客。<br />第2回 無料オンラインセミナー</p><p className="vol2-date">11.7 <small>SAT</small> <b>20:00〜</b></p><a className="hero-html-cta" href={lineAttribution.lineUrl} data-line-cta="true" data-traffic-route={lineAttribution.trafficRoute} data-line-destination={lineAttribution.lineDestination} target="_blank" rel="noopener"><span className="line-bubble">LINE</span><span className="hero-cta-copy">LINEでセミナーの案内を見る</span><b aria-hidden="true">›</b></a><p className="vol2-scroll">{final ? 'ご参加をお待ちしています' : 'SCROLL TO EXPLORE ↓'}</p></div>
    </div>
  </section>
}
