function createEntryForm() {
  var form = FormApp.create('AI×LPクリエイター養成講座 0期生エントリーフォーム');

  form.setDescription(
    'このフォームはお申し込みフォームではありません。\n\n' +
    '0期生募集に向けた事前エントリー兼審査フォームです。\n\n' +
    '経験やスキルは問いません。\n' +
    'ただし、\n' +
    '・自ら学ぶ意欲がある方\n' +
    '・行動できる方\n' +
    '・誰かの役に立ちたい方\n' +
    'を対象としています。\n\n' +
    'ご回答内容を拝見した上で、必要に応じてZoom面談をご案内させていただきます。'
  );

  form.setCollectEmail(false);
  form.setConfirmationMessage(
    'ご回答ありがとうございます。\n\n' +
    '内容を確認させていただき、必要に応じてZoom面談のご案内をさせていただきます。\n\n' +
    '現在は0期生募集準備中のため、正式募集開始まで今しばらくお待ちください。\n\n' +
    'お会いできることを楽しみにしています。'
  );
  form.setShowLinkToRespondAgain(false);

  // ① お名前
  form.addTextItem().setTitle('お名前').setRequired(true);

  // ② メールアドレス
  var emailItem = form.addTextItem().setTitle('メールアドレス').setRequired(true);
  emailItem.setValidation(
    FormApp.createTextValidation().requireTextIsEmail().build()
  );

  // ③ 現在のお仕事
  form.addTextItem().setTitle('現在のお仕事').setRequired(true);

  // ④ AIツール利用経験（複数選択可）
  form.addCheckboxItem()
    .setTitle('AIツール利用経験')
    .setChoiceValues(['ChatGPT', 'Claude', 'Gemini', 'その他', '未経験'])
    .setRequired(true);

  // ⑤ なぜこの講座に興味を持ちましたか？
  form.addParagraphTextItem().setTitle('なぜこの講座に興味を持ちましたか？').setRequired(true);

  // ⑥ 半年後どんな状態になっていたいですか？
  form.addParagraphTextItem().setTitle('半年後どんな状態になっていたいですか？').setRequired(true);

  // ⑦ 月にどのくらい収入を増やしたいですか？
  form.addMultipleChoiceItem()
    .setTitle('月にどのくらい収入を増やしたいですか？')
    .setChoiceValues(['3万円', '5万円', '10万円', '20万円以上'])
    .setRequired(true);

  // ⑧ その収入が増えたら何を実現したいですか？
  form.addParagraphTextItem().setTitle('その収入が増えたら何を実現したいですか？').setRequired(true);

  // ⑨ この講座で学んだことを誰のために使いたいですか？
  form.addParagraphTextItem().setTitle('この講座で学んだことを誰のために使いたいですか？').setRequired(true);

  // ⑩ 週にどのくらい学習時間を確保できますか？
  form.addMultipleChoiceItem()
    .setTitle('週にどのくらい学習時間を確保できますか？')
    .setChoiceValues(['1〜3時間', '3〜5時間', '5〜10時間', '10時間以上'])
    .setRequired(true);

  // ⑪ パソコン作業について教えてください
  form.addMultipleChoiceItem()
    .setTitle('パソコン作業について教えてください')
    .setChoiceValues(['得意', '普通', '苦手'])
    .setRequired(true);

  // ⑫ この講座で何ができるようになったら「受講して良かった」と思いますか？
  form.addParagraphTextItem()
    .setTitle('この講座で何ができるようになったら「受講して良かった」と思いますか？')
    .setRequired(true);

  // ⑬ 受講費が98,000円前後の場合、受講を検討できますか？
  form.addMultipleChoiceItem()
    .setTitle('受講費が98,000円前後の場合、受講を検討できますか？')
    .setChoiceValues(['前向きに検討したい', '内容次第', '難しい'])
    .setRequired(true);

  Logger.log('公開用URL: ' + form.getPublishedUrl());
  Logger.log('編集用URL: ' + form.getEditUrl());
}
