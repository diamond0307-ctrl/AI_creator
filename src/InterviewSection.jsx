import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

const interviews = {
  sns: {
    id: 'section-11', tag: 'AI × SNS集客', lead: 'バリ島に住んで、仕事の価値観が変わった。', name: '五十嵐邦夫', type: 'kunio',
    questions: [
      { q: 'バリ島でどんな活動をされていますか？', a: <>最初に始めたのはおむすび屋さんです。その後ヴィラを作り、色んな国の方からご利用して頂いています。またウブドでカフェを1店舗経営しています。エニアグラムを使ったオンラインセッションも行っています。</> },
      { q: '今回ノマドAI LABを始めようと思った理由は？', a: <>僕はなんとなく日本で働くことに息苦しさを感じていました。おそらく合ってなかったんだと思います。ここバリ島に来て、本当に自由に自分が心地よい場所で生きること、そこでできる仕事をやることで、<strong>人生の幸福度が大きく変わる経験</strong>をしました。<br /><br />AIの使い方を学び、皆さんにも<strong>自分のパフォーマンスが最も発揮できる環境</strong>で、人生を楽しんで欲しいと思っています。植物は植えられた場所で生きないといけませんが、動物は動くことができます。<strong>AIにはできないことが、あなたの働く環境の設定</strong>です。<br /><br />皆様の人生がいつでも、どこでも、できるものに変わるお手伝いができると思っています。</> }
    ]
  },
  design: {
    id: 'section-12', tag: 'AI × デザイン', lead: '感覚を、言葉にする。そして、AIを「使える表現」に変えていく。', name: '石丸篤史', type: 'atsushi',
    questions: [
      { q: 'これまで、どんな活動をしてきましたか？', a: <>2000年代に東京でヘアメイクとして活動し、CanCamやZipperなどの雑誌、舞台、ヘアメイクショーに携わりました。その後デザインへ領域を広げ、企業や店舗のロゴ、博多限定のユニクロTシャツ、ブランド、WebサイトやLPなどを制作。現在はアート活動も行っています。</> },
      { q: 'デザインで大切にしていることは？', a: <><strong>「感覚を言語化すること」</strong>です。なぜ美しいのか。なぜ違和感があるのか。AIでつくったものも、その理由を言葉にできなければ修正できません。AIは、あくまで道具です。包丁や鍋を持っているだけでは、レストランの料理にならないのと同じ。<br /><br /><strong>AIの力と、人が培ってきた感覚や経験。</strong>その両方を掛け合わせ、仕事として使える表現にする。それが、これからのAI×デザインに必要だと考えています。ノマドAIラボではその辺りを皆さんに学んでいただけると、仕事として使えるのではないかと考えています。</> }
    ]
  }
}

function Portrait({ type, name }) {
  if (type === 'kunio') return <img className="interview-portrait-interior" src="portraits/kunio.jpg" alt={`${name}さん`} loading="lazy" />
  return <div className="portrait-source-crop"><img src="output/imagegen/ai-design-interview-lp-v1.png" alt={`${name}さん`} loading="lazy" /></div>
}

export default function InterviewSection({ kind, scrollRef }) {
  const data = interviews[kind]
  const ref = useRef(null)
  const inView = useInView(ref, { root: scrollRef, amount: .12, once: true })
  const reduce = useReducedMotion()
  const active = inView && !reduce
  return <section className="swipe-section interview-section" id={data.id} ref={ref} aria-label={`${data.tag} 講師インタビュー`}>
    <div className="interview-inner">
      <motion.div className="interview-header" initial={false} animate={active ? { opacity: [.25, 1], y: [50, 0] } : undefined} transition={{ duration: .85, ease: [0.16, 1, .3, 1] }}>
        <span className="interview-logo">L A B</span><p className="interview-kicker">講師インタビュー / {data.tag}</p><h2>{data.tag}</h2><div className="interview-summary"><p>{data.lead}</p><div className="interview-person"><div className="interview-portrait"><Portrait type={data.type} name={data.name} /></div><strong>{data.name}</strong></div></div>
      </motion.div>
      <div className="interview-questions">{data.questions.map((item, index) => <motion.article className="interview-qa" key={item.q} initial={false} whileInView={reduce ? undefined : { opacity: [0.3, 1], x: [index % 2 ? 64 : -64, 0] }} viewport={{ root: scrollRef, amount: .25, once: true }} transition={{ duration: .75, delay: .08 * index, ease: [0.16, 1, .3, 1] }}><h3><span>Q{index + 1}</span>{item.q}</h3><p>{item.a}</p></motion.article>)}</div>
    </div>
  </section>
}
