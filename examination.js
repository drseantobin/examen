/*
 * examination.js — Examination of conscience content for the Examen AI confession-prep app.
 *
 * This content reflects the teaching of the Catholic Church (Catechism of the Catholic Church,
 * esp. CCC 1846-1876 on sin and CCC 2052-2557 on the Ten Commandments). It was synthesized in
 * original, plain, warm language from authoritative Catholic resources — Ascension / Ascension
 * Presents (seven-deadly-sins examination), New Advent / Catholic Encyclopedia (the seven capital
 * sins and the Decalogue), the USCCB examination of conscience, Catholic Answers (catholic.com),
 * and an Ignatian-examen resource (ignatianspirituality.com) for a gentle, gratitude-first,
 * reflective tone. No passages are copied verbatim from any source.
 *
 * KEEP IT ORTHODOX AND GENTLE. These prompts are aids to honest self-knowledge and to trust in
 * God's mercy — never a checklist meant to frighten or to feed scrupulosity. Sin is named plainly
 * but never graphically; for grave sins one need only confess the KIND of sin and, as best one can,
 * the number or frequency. When editing, do not invent sins, do not overstate gravity, and keep
 * child content concrete, reassuring, and never explicit.
 *
 * The app references these exact ids, emojis, names, and order. This is a content upgrade, not a
 * restructure — do not change the ids/emojis/names/ordering.
 */

window.EXAMINATION_CONTENT = {
  sins: [
    {
      id: 'pride',
      emoji: '👑',
      name: 'Pride',
      tag: { adult: 'The root sin — loving self above God and neighbor. Its remedy is humility.' },
      body: {
        child: 'Pride is wanting to be first and best, and forgetting to say thank you to God for everything good. The opposite is humility — knowing God loves us and being happy to let others go first.',
        teen: 'Pride is putting yourself at the center — needing to look good, refusing to admit you were wrong, or comparing yourself to others to feel above them. The cure is humility: receiving everything you are as a gift and serving without needing the credit.',
        adult: 'Pride is the disordered love of one\'s own excellence — placing self before God and neighbor. The Church calls it the root of the capital sins, because most other sins grow from it (CCC 1866). Its remedy is humility: receiving life as gift, accepting correction, and giving God the glory.'
      },
      q: {
        child: ['Do I say thank you to God for the good things in my life?', 'Is it hard for me to say sorry?'],
        teen: ['Do I struggle to admit when I am wrong or to ask forgiveness?', 'Do I look down on others, or need to seem better than them?', 'Where do I take credit for what is really a gift from God or from others?'],
        adult: ['Where do I place my own will, comfort, or reputation ahead of God and the people around me?', 'Do I find it hard to admit fault, ask forgiveness, or accept correction?', 'Do I compare myself to others — to feel superior, or to feel resentful?', 'Have I refused God a place in my decisions, living as if I were self-sufficient?', 'Do I serve others, or do I mostly want to be noticed and admired?']
      },
      check: {
        child: ['I bragged to feel better than others', 'I did not say sorry when I was wrong', 'I forgot to thank God for what I have', 'I would not let someone else go first'],
        teen: ['I refused to admit I was wrong', 'I looked down on someone', 'I wanted attention more than I wanted to help', 'I was too proud to ask for help or forgiveness', 'I took credit that was not mine'],
        adult: ['I put my own will and reputation ahead of God', 'I refused to admit fault or ask forgiveness', 'I resented correction or advice', 'I compared myself to others out of vanity or envy', 'I was unwilling to serve when it went unnoticed', 'I acted as if I did not need God', 'I was stubborn or contemptuous toward others', 'I sought praise for what was really a gift']
      }
    },
    {
      id: 'envy',
      emoji: '🟢',
      name: 'Envy',
      tag: { adult: 'Sadness at another\'s good. Its remedy is gratitude and brotherly love.' },
      body: {
        child: 'Envy is feeling sad or grumpy because someone else has something nice. The opposite is being glad for others and thankful for what God has given me.',
        teen: 'Envy is sorrow or resentment at someone else\'s gifts, looks, success, or popularity — wishing they had less so you could feel like more. The cure is gratitude for your own gifts and genuine gladness at the good in others.',
        adult: 'Envy is sadness at the good of another, which we see as lessening our own (CCC 2539). It can lead to gossip, detraction, and rejoicing at another\'s misfortune. Its remedies are gratitude for God\'s gifts and goodwill — wishing others well and rejoicing in their blessings.'
      },
      q: {
        child: ['Do I feel grumpy when someone else gets something nice?', 'Can I be happy for my friends?'],
        teen: ['Do I resent people who have more, or who seem to have it easier?', 'Have I put others down to make myself feel better?', 'Am I quietly pleased when someone I envy fails?'],
        adult: ['Do I feel sorrow or bitterness at others\' success, gifts, or possessions?', 'Have I spoken badly of someone out of envy, or quietly rejoiced at their misfortune?', 'Do I let comparison rob me of gratitude for what God has given me?', 'Has envy made me competitive or cold toward people I should love?', 'Where can I practice goodwill — actively wishing others well?']
      },
      check: {
        child: ['I felt grumpy when someone else had something nice', 'I could not be happy for a friend', 'I wanted what someone else had', 'I said something unkind because I was jealous'],
        teen: ['I resented someone for what they had', 'I put someone down out of jealousy', 'I was glad when someone I envied failed', 'I let comparison steal my gratitude', 'I competed instead of celebrating others'],
        adult: ['I felt sorrow at another person\'s good fortune', 'I spoke badly of someone out of envy', 'I was secretly pleased at someone\'s failure', 'I let comparison make me ungrateful', 'I was cold or competitive toward someone I should love', 'I coveted another\'s gifts, status, or success', 'I failed to rejoice in the blessings of others']
      }
    },
    {
      id: 'wrath',
      emoji: '🔥',
      name: 'Anger',
      tag: { adult: 'Disordered anger and the desire for revenge. Its remedy is meekness and forgiveness.' },
      body: {
        child: 'Anger becomes a sin when it makes me want to hurt someone or stay mad instead of forgiving. The opposite is being gentle and forgiving, like Jesus.',
        teen: 'Anger itself is not a sin — even Jesus felt it. It becomes sinful when it turns into hatred, lashing out, holding grudges, or wanting revenge. The cure is meekness: a calm, forgiving heart that seeks peace.',
        adult: 'Anger is a passion that becomes sinful when it is disordered — when it festers into hatred, revenge, harsh words, or refusal to forgive (CCC 2302-2303). Righteous indignation at real injustice can be good; the sin is in losing charity. Its remedies are meekness, patience, and forgiveness.'
      },
      q: {
        child: ['Do I stay mad instead of forgiving?', 'Have I tried to hurt someone when I was angry?'],
        teen: ['Do I lash out in words or actions when I lose my temper?', 'Am I holding a grudge or refusing to forgive someone?', 'Has my anger turned into wishing harm on someone?'],
        adult: ['Have I let anger curdle into resentment, hatred, or a desire for revenge?', 'Have I wounded others with harsh, cutting, or contemptuous words?', 'Do I nurse grudges instead of forgiving, as I have been forgiven?', 'Has my temper harmed my family, my driving, my work, or my online conduct?', 'Where is God asking me to make peace or to let something go?']
      },
      check: {
        child: ['I stayed mad instead of forgiving', 'I yelled or hit when I was angry', 'I said mean things on purpose', 'I would not make up with someone'],
        teen: ['I lost my temper and lashed out', 'I held a grudge', 'I said cruel things in anger', 'I wished harm on someone', 'I refused to forgive'],
        adult: ['I let anger turn into resentment or hatred', 'I wounded someone with harsh or contemptuous words', 'I nursed a grudge instead of forgiving', 'I wanted revenge', 'I let my temper harm my family or others', 'I was impatient or short with people', 'I withheld reconciliation that was within my power', 'I expressed anger violently or dangerously']
      }
    },
    {
      id: 'sloth',
      emoji: '🌙',
      name: 'Sloth',
      tag: { adult: 'Spiritual laziness — neglect of God and duty. Its remedy is diligence and zeal.' },
      body: {
        child: 'Sloth is being too lazy to do good things — like prayers, chores, or helping at home. The opposite is doing my part with a willing heart.',
        teen: 'Sloth is more than being tired or lazy — it is a kind of spiritual boredom that neglects prayer, responsibilities, and the good you know you should do. The cure is diligence: showing up faithfully, especially when you don\'t feel like it.',
        adult: 'Sloth (acedia) is spiritual laziness — a sadness or neglect that leads us to skip prayer, avoid effort, and refuse the demands of love (CCC 1866, 2094). It can even refuse the joy that comes from God. Its remedies are diligence, fervor, and faithful perseverance in our duties.'
      },
      q: {
        child: ['Do I skip my prayers or chores because I am lazy?', 'Do I help at home when I am asked?'],
        teen: ['Do I neglect prayer or my responsibilities because I just don\'t feel like it?', 'Do I waste a lot of time avoiding things I should be doing?', 'Have I given up on growing closer to God?'],
        adult: ['Have I neglected prayer, the sacraments, or my relationship with God out of indifference?', 'Do I avoid the duties of my state in life — at work, at home, in service?', 'Have I wasted time or talents God has entrusted to me?', 'Has spiritual discouragement led me to give up rather than to persevere?', 'Where is God inviting me to renewed effort and love?']
      },
      check: {
        child: ['I was too lazy to say my prayers', 'I did not do my chores', 'I did not help when I was asked', 'I wasted time instead of doing what I should'],
        teen: ['I neglected prayer because I didn\'t feel like it', 'I avoided my responsibilities', 'I wasted a lot of time', 'I gave up on growing closer to God', 'I let others carry my share'],
        adult: ['I neglected prayer or the sacraments out of indifference', 'I avoided the duties of my work or home', 'I wasted time or talents God gave me', 'I gave in to spiritual discouragement', 'I was negligent or careless in my responsibilities', 'I put off doing the good I knew I should do', 'I refused effort that love asked of me']
      }
    },
    {
      id: 'avarice',
      emoji: '💰',
      name: 'Greed',
      tag: { adult: 'Disordered love of money and possessions. Its remedy is generosity and detachment.' },
      body: {
        child: 'Greed is wanting more and more things and not wanting to share. The opposite is being generous and happy to give to others.',
        teen: 'Greed is letting money and possessions become too important — hoarding, never feeling you have enough, or being stingy. The cure is generosity and trusting that God provides what you truly need.',
        adult: 'Greed (avarice) is a disordered love of money and possessions, which can crowd out love of God and neighbor (CCC 2536, 2552). It shows up as stinginess, hoarding, anxiety over wealth, or injustice toward others. Its remedies are generosity, almsgiving, and detachment that trusts in God\'s providence.'
      },
      q: {
        child: ['Do I share with others?', 'Do I always want more toys or treats?'],
        teen: ['Do I care too much about money, brands, or having the latest things?', 'Am I stingy, or unwilling to give to those in need?', 'Do I let wanting more make me anxious or unhappy?'],
        adult: ['Has the desire for money or possessions taken a place in my heart that belongs to God?', 'Am I stingy toward those in need, or do I give of my time and means?', 'Have I been dishonest, unjust, or grasping in money matters?', 'Do I trust God\'s providence, or am I consumed by anxiety about having enough?', 'Where can I grow in generosity and simplicity?']
      },
      check: {
        child: ['I did not want to share', 'I always wanted more and more', 'I was selfish with my things', 'I was not thankful for what I have'],
        teen: ['I cared too much about money or possessions', 'I was stingy with people in need', 'I always wanted the next thing', 'I let wanting more make me unhappy', 'I valued stuff over people'],
        adult: ['I let money or possessions take God\'s place in my heart', 'I was stingy toward those in need', 'I was dishonest or unjust in money matters', 'I was anxious or consumed by the desire for more', 'I failed to give alms or share what I have', 'I was greedy or grasping', 'I neglected generosity and simplicity', 'I trusted in wealth more than in God']
      }
    },
    {
      id: 'gluttony',
      emoji: '🍷',
      name: 'Gluttony',
      tag: { adult: 'Disordered use of food and drink. Its remedy is temperance and self-control.' },
      body: {
        child: 'Gluttony is taking way too much of something I like, like sweets, and not leaving enough for others. The opposite is enjoying good things in the right amount.',
        teen: 'Gluttony is letting food, drink, or other pleasures get out of control — overdoing it, or using them to escape. The cure is temperance: enjoying good things with balance and gratitude.',
        adult: 'Gluttony is the disordered use of food or drink — eating or drinking to excess, or making bodily pleasure an end in itself (CCC 1866). Drunkenness and the abuse of substances belong here, and can also offend against the care of one\'s own life. Its remedy is temperance: moderation, gratitude, and freedom over our appetites.'
      },
      q: {
        child: ['Do I take more than my fair share of treats?', 'Can I say no to more when I have had enough?'],
        teen: ['Do I overeat, or use food or drink to comfort or escape?', 'Have I drunk too much, or used anything to get out of control?', 'Do my appetites run me, instead of the other way around?'],
        adult: ['Do I use food or drink in a way that is excessive or out of balance?', 'Have I been drunk, or abused alcohol, food, or other substances?', 'Do I turn to consumption to numb, escape, or comfort myself instead of turning to God?', 'Is my relationship with bodily pleasure ordered by temperance and gratitude?', 'Where am I being invited to greater freedom and self-control?']
      },
      check: {
        child: ['I took more than my share', 'I would not stop when I had enough', 'I was greedy with treats', 'I did not think of others'],
        teen: ['I overate or overindulged', 'I used food or drink to escape my feelings', 'I drank too much', 'I let my cravings control me', 'I was wasteful with food'],
        adult: ['I ate or drank to excess', 'I was drunk or abused alcohol', 'I misused food, drink, or substances', 'I used consumption to numb or escape instead of turning to God', 'I let bodily appetites rule me', 'I was ungrateful or wasteful with what I was given', 'I neglected temperance and self-control']
      }
    },
    {
      id: 'lust',
      emoji: '🤍',
      name: 'Lust',
      tag: {
        child: 'Treating my body and other people with respect, and growing in self-control.',
        teen: 'Keeping the heart, eyes, and body pure, and learning self-control. Its remedy is the virtue of chastity.',
        adult: 'Disordered desire for sexual pleasure. Its remedy is the virtue of chastity.'
      },
      body: {
        child: 'Our bodies are a good gift from God. We treat our own body and other people with respect and kindness, and we practice self-control — saying no to wants and impulses that are not good for us. The opposite is a clean, respectful heart.',
        teen: 'This is about purity: keeping your heart, eyes, and body good and respectful, and learning self-control over your impulses. It means treating yourself and everyone else as a whole person made and loved by God — never as a thing to use. The virtue that grows here is chastity: a self-mastery that frees you to love well.',
        adult: 'Lust is the disordered desire for, or enjoyment of, sexual pleasure apart from its God-given meaning within marriage (CCC 2351). It can include pornography, masturbation, fornication, adultery, and impure thoughts willingly entertained. Its remedy is chastity, which integrates sexuality into the whole person and frees us to love. In confession one need only name the kind of sin and, for grave sins, the number or frequency as best one can recall.'
      },
      q: {
        child: ['Do I treat my body and other people with respect and kindness?', 'Can I say no to wants or impulses that are not good for me?', 'Am I careful and good about what I watch and look at?'],
        teen: ['Have I kept watch over my eyes and heart — careful about what I look at and dwell on?', 'Have I treated myself and others with respect, as whole persons and not as things?', 'Have I practiced self-control over my impulses?', 'Have I been modest in how I dress and act?'],
        adult: ['Have I willingly entertained impure thoughts, desires, or fantasies?', 'Have I viewed pornography or sought out impure images?', 'Have I sinned against chastity through masturbation, fornication, or adultery?', 'Have I treated my own body or another person as an object rather than a person to be loved?', 'Where is God calling me toward greater purity, freedom, and self-gift?']
      },
      check: {
        child: ['I was not respectful of my body or other people', 'I did not have self-control over my wants or impulses', 'I was unkind or rude about someone', 'I watched or looked at things I knew were not good'],
        teen: ['I did not guard my eyes or heart well', 'I dwelt on thoughts I knew were not pure', 'I treated myself or someone else without respect', 'I was not modest in how I dressed or acted', 'I gave in to impulses instead of practicing self-control'],
        adult: ['I willingly entertained impure thoughts or desires', 'I viewed pornography', 'I committed impure acts (masturbation)', 'I had sexual relations outside of marriage (fornication or adultery)', 'I treated my body or another as an object', 'I was immodest, or led others toward impurity', 'I failed to guard my eyes, heart, or media use', 'I neglected the means that help me grow in chastity']
      }
    }
  ],

  commandments: [
    {
      id: 'c1',
      emoji: '✝️',
      name: '1st Commandment',
      tag: { adult: 'I am the Lord your God; you shall have no other gods before me.' },
      body: {
        child: 'God asks us to love him more than anything else and to talk to him in prayer. We keep him first in our hearts.',
        teen: 'The first commandment calls us to put God first — to believe in him, hope in him, love him, and worship him alone. It is broken by neglecting prayer, by putting other things (success, image, money) in God\'s place, or by dabbling in superstition or the occult.',
        adult: 'The first commandment calls us to adore the one true God in faith, hope, and charity, and to give him first place in our lives (CCC 2084). It is sinned against by neglecting prayer and worship, by despair or presumption, by making idols of money, success, or self, and by superstition, divination, or occult practices.'
      },
      q: {
        child: ['Do I make time to talk to God in prayer?', 'Do I love God more than my things?'],
        teen: ['Do I keep God first, or have I let other things take his place?', 'Have I neglected prayer or doubted God\'s love?', 'Have I gotten involved in horoscopes, fortune-telling, or the occult?'],
        adult: ['Have I given God first place, or have I made idols of money, success, comfort, or my own image?', 'Have I neglected prayer and my relationship with God?', 'Have I sinned against faith, hope, or charity — through doubt I nurtured, despair, or presumption?', 'Have I taken part in superstition, divination, the occult, or other false worship?', 'Have I been ashamed of my faith, or failed to nourish it?']
      },
      check: {
        child: ['I forgot to pray', 'I loved my things more than God', 'I did not listen at church', 'I did not thank God'],
        teen: ['I neglected prayer', 'I let other things become more important than God', 'I doubted or ignored God', 'I dabbled in horoscopes or the occult', 'I was embarrassed about my faith'],
        adult: ['I gave God less than first place in my life', 'I neglected daily prayer', 'I made an idol of money, success, or image', 'I gave in to despair or presumption', 'I took part in superstition or the occult', 'I nurtured doubts rather than seeking understanding', 'I was ashamed of my faith', 'I failed to grow in my relationship with God']
      }
    },
    {
      id: 'c2',
      emoji: '🗣️',
      name: '2nd Commandment',
      tag: { adult: 'You shall not take the name of the Lord your God in vain.' },
      body: {
        child: 'God\'s name is holy. We say it with love and respect, never as a bad or angry word.',
        teen: 'The second commandment asks us to honor God\'s name and to use it with reverence. It is broken by cursing, using God\'s or Jesus\' name carelessly or in anger, blasphemy, or breaking promises made in God\'s name.',
        adult: 'The second commandment calls us to honor the holy name of God and to use it with reverence and love (CCC 2142-2155). It is sinned against by blasphemy, cursing, using God\'s name carelessly or in anger, taking false or empty oaths, and breaking vows or promises made to God.'
      },
      q: {
        child: ['Do I say God\'s name with love?', 'Have I used God\'s name as a bad word?'],
        teen: ['Do I use God\'s or Jesus\' name carelessly, in anger, or as a curse?', 'Have I spoken disrespectfully about holy things?', 'Have I kept the promises I made to God?'],
        adult: ['Have I used the name of God, Jesus, Mary, or the saints carelessly, in anger, or as a curse?', 'Have I committed blasphemy or spoken irreverently about holy things?', 'Have I taken oaths falsely, or sworn unnecessarily?', 'Have I kept the vows and promises I made to God?', 'Do I speak of God and sacred things with reverence?']
      },
      check: {
        child: ['I used God\'s name as a bad word', 'I said holy things in a rude way', 'I broke a promise I made to God', 'I spoke without respect at church'],
        teen: ['I used God\'s or Jesus\' name carelessly or in anger', 'I cursed', 'I spoke disrespectfully about holy things', 'I broke a promise to God', 'I joked about sacred things'],
        adult: ['I used God\'s name carelessly or in anger', 'I cursed or used profane speech', 'I spoke blasphemously or irreverently about holy things', 'I took a false or empty oath', 'I broke a vow or promise made to God', 'I failed to speak of God with reverence', 'I misused the names of Jesus, Mary, or the saints']
      }
    },
    {
      id: 'c3',
      emoji: '⛪',
      name: '3rd Commandment',
      tag: { adult: 'Remember to keep holy the Lord\'s Day.' },
      body: {
        child: 'Sunday is God\'s special day. We go to Mass, rest, and spend time with our family.',
        teen: 'The third commandment asks us to keep Sunday holy — by participating in Mass, resting from unnecessary work, and making time for God and family. It is broken by missing Sunday Mass through our own fault, or by being deliberately distracted or irreverent.',
        adult: 'The third commandment calls us to keep the Lord\'s Day holy — above all by participating in Sunday Mass and Holy Days of Obligation, and by resting in a way that renews body and spirit (CCC 2174-2188). It is sinned against by deliberately missing Mass, by arriving late or being irreverent without good reason, or by needless work that crowds out rest and worship.'
      },
      q: {
        child: ['Do I go to Mass on Sunday?', 'Do I try to pay attention at church?'],
        teen: ['Do I go to Sunday Mass, or do I skip it without a real reason?', 'Am I attentive and reverent at Mass, or distracted on purpose?', 'Do I keep Sunday as a day for God, rest, and family?'],
        adult: ['Have I missed Sunday Mass or a Holy Day of Obligation through my own fault?', 'Have I arrived late, left early, or been deliberately distracted or irreverent at Mass?', 'Do I keep the Lord\'s Day as a time for worship, rest, and family, or do I fill it with needless work?', 'Have I helped my household keep Sunday holy?', 'Do I make Sunday a true encounter with God?']
      },
      check: {
        child: ['I did not want to go to Mass', 'I did not pay attention at church', 'I was restless and would not pray', 'I did not rest or spend time with family'],
        teen: ['I skipped Sunday Mass without a real reason', 'I was distracted on purpose at Mass', 'I was irreverent in church', 'I did not keep Sunday as a day for God', 'I was late or left early for no reason'],
        adult: ['I missed Sunday Mass through my own fault', 'I missed a Holy Day of Obligation', 'I was deliberately late, distracted, or irreverent at Mass', 'I filled the Lord\'s Day with needless work', 'I did not rest or renew myself', 'I failed to help my family keep Sunday holy', 'I treated Mass as a routine rather than an encounter with God']
      }
    },
    {
      id: 'c4',
      emoji: '👨‍👩‍👧',
      name: '4th Commandment',
      tag: { adult: 'Honor your father and your mother.' },
      body: {
        child: 'God asks us to love, obey, and respect our parents and the grown-ups who take care of us.',
        teen: 'The fourth commandment calls us to honor our parents and lawful authority — through respect, obedience in what is right, and gratitude. It is broken by disobedience, disrespect, ingratitude, or neglecting our family responsibilities.',
        adult: 'The fourth commandment governs the duties of family and society (CCC 2197-2257). Children owe parents respect, gratitude, obedience while young, and care in their old age. Parents owe children love, formation in the faith, education, and good example. We also owe just respect to lawful authority, and authority owes justice and care to those it serves.'
      },
      q: {
        child: ['Do I obey my parents?', 'Am I kind and respectful to grown-ups who care for me?'],
        teen: ['Do I treat my parents with respect, or with contempt and constant arguing?', 'Do I obey in what is right, and help at home?', 'Am I grateful for my family, or do I take them for granted?'],
        adult: ['Do I honor and care for my parents, especially as they age?', 'If I am a parent, do I love, form, and give good example to my children, and raise them in the faith?', 'Do I fulfill my responsibilities to my spouse and family?', 'Do I show just respect to lawful authority, and exercise authority justly where it is mine?', 'Have I neglected the people God has placed in my care?']
      },
      check: {
        child: ['I disobeyed my parents', 'I talked back or was rude', 'I did not help at home', 'I was not grateful to my family'],
        teen: ['I disrespected my parents', 'I disobeyed in what was right', 'I argued constantly or with contempt', 'I did not help at home', 'I took my family for granted'],
        adult: ['I was disrespectful or ungrateful toward my parents', 'I neglected the care my aging parents need', 'I failed in my duties to my spouse', 'I neglected the formation, faith, or good example my children need', 'I was harsh, absent, or inconsistent as a parent', 'I disrespected lawful authority', 'I exercised authority unjustly or selfishly', 'I neglected someone God placed in my care']
      }
    },
    {
      id: 'c5',
      emoji: '❤️‍🩹',
      name: '5th Commandment',
      tag: { adult: 'You shall not kill.' },
      body: {
        child: 'Every person is precious to God. We are kind, we do not hurt others, and we take care of our own bodies too.',
        teen: 'The fifth commandment protects the sacredness of human life. It is broken not only by violence, but by hatred, holding grudges, bullying, cruel words, reckless harm, and by neglecting the care of your own life and health.',
        adult: 'The fifth commandment safeguards the dignity of human life from conception to natural death (CCC 2258-2330). It is gravely violated by murder, abortion, euthanasia, and direct cooperation in them. It is also sinned against by hatred, anger, revenge, scandal, bullying, reckless endangerment, and by neglecting the reasonable care of one\'s own life and health (food, rest, sobriety, safety).'
      },
      q: {
        child: ['Am I kind, or do I hurt others with my hands or words?', 'Do I take care of my body — eating, sleeping, staying safe?'],
        teen: ['Have I harmed anyone, or wished harm on them?', 'Have I bullied, mocked, or led others into trouble?', 'Have I neglected or harmed my own health or safety?'],
        adult: ['Have I harmed anyone in body or spirit, or wished them harm?', 'Have I held hatred, sought revenge, or refused forgiveness?', 'Have I given scandal — leading others toward sin by word or example?', 'Have I cooperated in abortion, euthanasia, or other grave harm to life?', 'Have I cared responsibly for my own life and health, or endangered it through recklessness, substance abuse, or neglect?']
      },
      check: {
        child: ['I hurt someone with my hands', 'I hurt someone with my words', 'I was mean on purpose', 'I did not take care of my body'],
        teen: ['I harmed or threatened someone', 'I bullied or mocked someone', 'I held hatred or wished harm', 'I led someone toward bad choices', 'I neglected or endangered my own health'],
        adult: ['I harmed someone in body or spirit', 'I held hatred or sought revenge', 'I refused to forgive', 'I gave scandal or led others toward sin', 'I cooperated in grave harm to human life', 'I endangered myself or others through recklessness', 'I abused substances or neglected my health', 'I failed to defend the dignity of the vulnerable']
      }
    },
    {
      id: 'c6',
      emoji: '🤍',
      name: '6th & 9th Commandments',
      tag: {
        child: 'Respecting my body and others, and keeping a clean, kind heart.',
        teen: 'Purity and faithfulness of heart and body. Its remedy is chastity and respect for every person.',
        adult: 'You shall not commit adultery. You shall not covet your neighbor\'s wife.'
      },
      body: {
        child: 'God asks us to respect our bodies and other people, to be kind and modest, and to keep our hearts good and clean. We practice self-control, and we are faithful — true to the people we love.',
        teen: 'These commandments call you to purity and faithfulness: keeping your heart, eyes, and body good and respectful, practicing self-control, and being true to others. They guard the dignity of every person. The virtue that grows here is chastity — a self-mastery that frees you to love.',
        adult: 'The sixth and ninth commandments call every person to chastity according to their state in life, and they guard the dignity of marriage and the body (CCC 2331-2400, 2514-2533). They are sinned against by lust, pornography, masturbation, fornication, adultery, and impure thoughts willingly entertained; the ninth especially addresses the desires of the heart. Married couples are also called to keep marriage open to life; contraception, deliberately separating union from procreation, is contrary to this gift. One need only confess the kind of sin and, for grave sins, the number or frequency as best one can recall.'
      },
      q: {
        child: ['Do I treat my body and other people with respect and kindness?', 'Am I modest and good in what I do and watch?', 'Do I practice self-control over my impulses?'],
        teen: ['Have I kept watch over my eyes and heart?', 'Have I been modest and respectful toward myself and others?', 'Have I practiced self-control over my impulses?', 'Have I been faithful and honest in my friendships?'],
        adult: ['Have I willingly entertained impure thoughts or desires?', 'Have I viewed pornography, or sinned through masturbation, fornication, or adultery?', 'Have I been faithful and self-giving to my spouse — in body, attention, and affection?', 'If married, have we kept our love open to life, or used contraception?', 'Have I been immodest, or led others toward impurity?']
      },
      check: {
        child: ['I was not respectful of my body or other people', 'I was not modest or kind', 'I did not practice self-control', 'I watched or looked at things I knew were not good'],
        teen: ['I did not guard my eyes or heart well', 'I dwelt on thoughts I knew were not pure', 'I was not modest in how I dressed or acted', 'I treated someone without respect', 'I gave in to impulses instead of practicing self-control'],
        adult: ['I willingly entertained impure thoughts or desires', 'I viewed pornography', 'I committed impure acts (masturbation)', 'I had sexual relations outside of marriage (fornication or adultery)', 'I was unfaithful to my spouse in heart or body', 'We used contraception, separating union from openness to life', 'I was immodest or led others toward impurity', 'I neglected the means that protect chastity']
      }
    },
    {
      id: 'c7',
      emoji: '🤝',
      name: '7th & 10th Commandments',
      tag: { adult: 'You shall not steal. You shall not covet your neighbor\'s goods.' },
      body: {
        child: 'We do not take what belongs to others, and we are honest. We share, and we are happy with what we have.',
        teen: 'These commandments call us to justice and honesty with possessions — and to a content heart. They are broken by stealing, cheating, damaging others\' things, being lazy or dishonest in work, and by greed or envy of what others have.',
        adult: 'The seventh and tenth commandments call us to justice, honesty, and respect for others\' property, and to a heart free of greed (CCC 2401-2463, 2534-2557). They are sinned against by theft, cheating, fraud, vandalism, dishonesty in work or business, unjust wages, failure to pay debts, wastefulness, and by envy or greed for what belongs to others. They also call us to care for the poor and to be good stewards of creation.'
      },
      q: {
        child: ['Have I taken something that wasn\'t mine?', 'Am I honest, and do I share?'],
        teen: ['Have I stolen, cheated, or copied others\' work?', 'Have I damaged or wasted what belongs to others?', 'Am I lazy or dishonest in my work or schoolwork?', 'Do I envy what others have?'],
        adult: ['Have I stolen, cheated, defrauded, or kept what isn\'t mine?', 'Have I been honest and just in my work, business, and dealings — fair wages, fair effort, paid debts?', 'Have I damaged or wasted property, or been a poor steward of what I have?', 'Have I been generous to those in need, or indifferent to the poor?', 'Do I covet what others have, or live with a grateful, content heart?']
      },
      check: {
        child: ['I took something that was not mine', 'I was not honest', 'I broke or wasted someone\'s things', 'I would not share'],
        teen: ['I stole or cheated', 'I copied someone\'s work', 'I damaged or wasted others\' things', 'I was lazy or dishonest in my work', 'I envied what others had'],
        adult: ['I stole, cheated, or defrauded someone', 'I was dishonest or unjust in work or business', 'I failed to give a fair day\'s work or fair wages', 'I did not pay debts or return what I owed', 'I damaged, wasted, or poorly stewarded property', 'I was indifferent to the poor and needy', 'I coveted what belonged to others', 'I let greed crowd out gratitude and generosity']
      }
    },
    {
      id: 'c8',
      emoji: '💬',
      name: '8th Commandment',
      tag: { adult: 'You shall not bear false witness against your neighbor.' },
      body: {
        child: 'We tell the truth and speak kindly. We do not lie or say unkind things about others.',
        teen: 'The eighth commandment calls us to truthfulness and to guard others\' good name. It is broken by lying, gossip, spreading rumors, revealing secrets, harsh judgments, and refusing to repair harm we\'ve caused with our words.',
        adult: 'The eighth commandment calls us to live and speak the truth, and to protect the reputation of others (CCC 2464-2513). It is sinned against by lying, perjury, gossip, detraction (revealing others\' faults without need), calumny (false accusation), rash judgment, betraying confidences, and flattery. It also requires us to repair the harm our words have caused.'
      },
      q: {
        child: ['Do I tell the truth?', 'Have I said unkind or untrue things about someone?'],
        teen: ['Have I lied, or twisted the truth to protect myself?', 'Have I gossiped or spread rumors?', 'Have I damaged someone\'s reputation, or judged them rashly?'],
        adult: ['Have I lied, exaggerated, or been deceptive?', 'Have I gossiped, spread rumors, or revealed others\' faults without good reason (detraction)?', 'Have I falsely accused someone or damaged their good name (calumny)?', 'Have I judged others rashly, or betrayed a confidence?', 'Have I failed to repair harm my words have caused, or to defend the truth?']
      },
      check: {
        child: ['I told a lie', 'I said unkind things about someone', 'I was not honest', 'I told a secret I should have kept'],
        teen: ['I lied or twisted the truth', 'I gossiped or spread rumors', 'I damaged someone\'s reputation', 'I judged someone unfairly', 'I revealed a secret'],
        adult: ['I lied or was deceptive', 'I gossiped or spread rumors', 'I revealed others\' faults without need (detraction)', 'I falsely accused or slandered someone (calumny)', 'I judged others rashly', 'I betrayed a confidence', 'I flattered or was insincere', 'I failed to repair harm my words caused']
      }
    }
  ]
};
