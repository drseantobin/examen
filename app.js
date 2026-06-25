/* ============================================================================
   Examen AI — a quiet, private companion for examining your conscience,
   preparing a good confession, and praying a nightly examen.

   FULLY ON-DEVICE. Nothing you write here ever leaves this device. There is no
   server, no account, no network call. Your reflections live only in this
   browser's local storage and you can erase them at any time. This is the
   spiritual "seal" of the examination, kept by design.

   This tool PREPARES you. It is not the sacrament. Only a priest, acting in the
   person of Christ, gives absolution. Nothing here replaces a priest or a
   spiritual director — and it must never become a cause of fear or scruples.
   God's mercy is greater than any sin.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- storage */
  var K = {
    age: 'examen_age',
    theme: 'examen_theme',
    eoc: 'examen_eoc_v1',
    nightly: 'examen_nightly_v1',
    lastConf: 'examen_last_confession',
    seenIntro: 'examen_seen_intro',
    attn: 'examen_attention_v1',
    voiceAck: 'examen_voice_ack'
  };
  var AX = (typeof window !== 'undefined' && window.ATTENTION_EXAMEN) ? window.ATTENTION_EXAMEN : null;

  /* ---- The Attention Examen is the premium course: free preview, then unlock ----
     This is a static on-device app, so it can't take payment itself. The model:
     Days 1–3 are free; Days 4–30 unlock with a code the buyer receives after paying
     through an external checkout (e.g. Gumroad). SEAN — to go live, set storeUrl to
     your $9.99 product page. If you enable Gumroad "license keys" on that product,
     paste its gumroadProductPermalink and the app will verify real keys online; until
     then, codes are validated offline by validateOfflineCode() (honor-system; see
     ops/CONTINUE-HERE.md for how to mint valid codes). The unlock entitlement is kept
     in its OWN storage key so "Erase everything" does not revoke a purchase. */
  var ATTN_CONFIG = {
    price: '$9.99',
    freeDays: 3,
    // Live Gumroad product (created 2026-06-24): "The Attention Examen — 30-Day Workbook", $9.99,
    // license keys ON. The value below is the product's unique permalink, which Gumroad's license
    // /verify endpoint matches on (sent as both product_id and product_permalink for safety).
    storeUrl: 'https://seantobin.gumroad.com/l/movqsc',
    gumroadProductId: 'movqsc'
  };
  var ATTN_UNLOCK_KEY = 'examen_attention_unlocked';
  function attnUnlocked() { return rawGet(ATTN_UNLOCK_KEY) === '1'; }
  function dayIsFree(n) { return n <= ATTN_CONFIG.freeDays; }
  function dayAccessible(n) { return dayIsFree(n) || attnUnlocked(); }
  // Offline code check (honor-system until Gumroad keys are wired): a code is valid if,
  // uppercased with separators stripped, it matches IE + 8 base32 chars and its char-code
  // sum is ≡ 0 (mod 23). Sean can mint codes with this rule (see ops doc).
  function validateOfflineCode(raw) {
    var c = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^IE[A-Z0-9]{8}$/.test(c)) return false;
    var sum = 0; for (var i = 0; i < c.length; i++) sum += c.charCodeAt(i);
    return sum % 23 === 0;
  }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function rawGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function rawSet(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }

  /* ------------------------------------------------------------------ state */
  var state = {
    age: rawGet(K.age) || null,          // 'child' | 'teen' | 'adult'
    view: 'home',
    lens: 'sins',                        // 'sins' | 'commandments'
    sectionIndex: 0,
    stack: []
  };
  function pick(obj, age) {              // age-aware content with adult fallback
    if (!obj) return null;
    return obj[age] != null ? obj[age] : obj.adult;
  }

  /* ============================================================ CONTENT DATA
     Authored with care for Catholic teaching. Child content is gentle and
     concrete and never frightening; youth/adult content is fuller. Where a
     youth variant is omitted, the adult variant is used. */

  var AGES = [
    { id: 'child', emoji: '🧒', name: 'Child', age: 'about 7–10' },
    { id: 'teen',  emoji: '🧑', name: 'Youth',  age: 'about 11–17' },
    { id: 'adult', emoji: '🙏', name: 'Adult',  age: '18 and up' }
  ];

  // ---- The Seven Capital Sins ----------------------------------------------
  var SINS = [
    {
      id: 'pride', emoji: '👑', name: 'Pride',
      tag: { adult: 'Putting myself before God and others' },
      body: {
        child: 'Pride is when I think I am better than other people, or I won’t say sorry.',
        adult: 'Pride sets the self above God and neighbor. It is the root of the other sins. Its remedy is humility — the truth about who we are before God.'
      },
      q: {
        child: ['When was it hard to say sorry, or to admit I was wrong?'],
        teen:  ['Where do I want to look good more than I want to be good?',
                'Is it hard for me to admit when I’m wrong or to ask for help?'],
        adult: ['Where do I place my own will, comfort, or reputation above God and the people I love?',
                'Where do I refuse to forgive, to apologize, or to admit I was wrong?',
                'Do I make time for God — prayer, Mass, his commandments — or do I run my life as if I were the center?']
      },
      check: {
        child: ['I bragged or showed off.', 'I would not say sorry.', 'I did not listen to my parents or teachers.',
                'I made fun of someone to feel bigger.', 'I forgot to thank God or to pray.'],
        teen:  ['I was arrogant or looked down on others.', 'I refused to admit I was wrong.', 'I wouldn’t apologize.',
                'I was stubborn or talked back to those in authority.', 'I cared more about my image than the truth.',
                'I was ungrateful, or took credit that wasn’t mine.'],
        adult: ['I put my own will, pride, or comfort before God.', 'I refused to forgive someone.',
                'I was arrogant, vain, or self-righteous.', 'I refused to admit fault or to apologize.',
                'I neglected prayer or treated God as an afterthought.', 'I despised or looked down on others.',
                'I was stubborn against good advice or correction.']
      }
    },
    {
      id: 'envy', emoji: '🟢', name: 'Envy',
      tag: { adult: 'Sadness at another’s good' },
      body: {
        child: 'Envy is being sad or grumpy because someone else has something good.',
        adult: 'Envy is sorrow at the good of another, as if their blessing were my loss. Its remedy is gratitude and goodwill — rejoicing in others’ good.'
      },
      q: {
        child: ['Was I jealous of someone? What did I want that they had?'],
        adult: ['Whose gifts, success, or happiness am I unable to be glad about?',
                'Has envy made me critical, cold, or quietly happy at someone’s misfortune?']
      },
      check: {
        child: ['I was jealous of what someone else had.', 'I was mean because I wanted what they had.',
                'I was not happy for my friend’s good news.'],
        teen:  ['I was jealous of others’ looks, grades, things, or popularity.', 'I put someone down out of envy.',
                'I was secretly glad when someone failed.', 'I compared myself constantly and resented others.'],
        adult: ['I resented another’s success, gifts, or happiness.', 'I was glad at someone’s misfortune.',
                'I let envy make me critical or cold toward someone.', 'I gossiped or undermined someone out of jealousy.',
                'I was ungrateful for what God has given me.']
      }
    },
    {
      id: 'wrath', emoji: '🔥', name: 'Anger',
      tag: { adult: 'Disordered anger; the refusal to forgive' },
      body: {
        child: 'Anger is when I get so mad I am mean, or I stay mad and won’t forgive.',
        adult: 'Anger becomes sin when it turns to hatred, revenge, lasting resentment, or harm — in word or deed. Its remedy is meekness and forgiveness.'
      },
      q: {
        child: ['Did I yell, hit, or stay mad at someone?'],
        adult: ['Whom am I holding resentment or a grudge against?',
                'Has my anger spilled into harsh words, contempt, or harm — to others or myself?',
                'Where do I need to forgive, as I have been forgiven?']
      },
      check: {
        child: ['I yelled at someone or called them a mean name.', 'I hit, kicked, or hurt someone.',
                'I stayed mad and would not forgive.', 'I had a tantrum.'],
        teen:  ['I lost my temper or said cruel things.', 'I held a grudge and refused to forgive.',
                'I was harsh, sarcastic, or contemptuous.', 'I wished harm on someone.', 'I let anger control me online.'],
        adult: ['I gave in to rage or said cruel, cutting things.', 'I held on to resentment or a grudge.',
                'I refused to forgive someone.', 'I sought revenge or wished evil on another.',
                'I was harsh or contemptuous toward those close to me.', 'I let anger lead me to harm myself or others.']
      }
    },
    {
      id: 'sloth', emoji: '🌙', name: 'Sloth',
      tag: { adult: 'Spiritual laziness; neglect of love and duty' },
      body: {
        child: 'Sloth is being too lazy to do good things, like praying or helping at home.',
        adult: 'Sloth (acedia) is laziness of the soul — neglecting prayer, duty, and the good we know we should do. Its remedy is diligence and renewed love.'
      },
      q: {
        child: ['Did I skip my prayers or refuse to help because I was lazy?'],
        adult: ['Where have I let prayer, Mass, or my faith slide because I couldn’t be bothered?',
                'What good — a duty, a kindness, a responsibility — have I left undone out of laziness?']
      },
      check: {
        child: ['I was too lazy to say my prayers.', 'I did not help at home when I should have.',
                'I did not do my chores or homework.', 'I wasted lots of time and ignored what I should do.'],
        teen:  ['I neglected prayer or skipped Mass out of laziness.', 'I procrastinated on real responsibilities.',
                'I wasted hours on my phone or games instead of what mattered.', 'I gave up easily on hard but good things.',
                'I let myself drift instead of growing.'],
        adult: ['I neglected prayer and my spiritual life.', 'I missed Sunday Mass through laziness or indifference.',
                'I left duties to my family, work, or community undone.', 'I gave in to acedia — listlessness about the good.',
                'I wasted time I could have given to God or others.', 'I avoided the effort that love and growth require.']
      }
    },
    {
      id: 'avarice', emoji: '💰', name: 'Greed',
      tag: { adult: 'Disordered love of money and possessions' },
      body: {
        child: 'Greed is wanting more and more things, and not wanting to share.',
        adult: 'Greed (avarice) is the disordered love of money and possessions over God and people. Its remedy is generosity and trust in God’s providence.'
      },
      q: {
        child: ['Was I selfish with my things, or did I not want to share?'],
        adult: ['Where does money, comfort, or possessions have a grip on my heart?',
                'Am I generous with the poor and with those in need — or do I cling and hoard?',
                'Have I been dishonest or unjust in money, work, or business?']
      },
      check: {
        child: ['I would not share.', 'I wanted more and more things.', 'I was selfish or greedy.',
                'I took something that wasn’t mine.'],
        teen:  ['I was greedy or materialistic.', 'I was stingy when I could have given.',
                'I wanted things more than I wanted to be good.', 'I was envious of others’ possessions.',
                'I was careless or wasteful with money or things.'],
        adult: ['I let money or possessions take God’s place in my heart.', 'I was greedy, grasping, or never satisfied.',
                'I failed to give to the poor or to those in need.', 'I was dishonest or unjust in money or business.',
                'I overspent, gambled, or was a poor steward.', 'I judged my worth, or others’, by wealth.']
      }
    },
    {
      id: 'gluttony', emoji: '🍷', name: 'Gluttony',
      tag: { adult: 'Disordered use of food, drink, or comfort' },
      body: {
        child: 'Gluttony is eating too much, or being greedy with treats.',
        adult: 'Gluttony is the disordered use of food, drink, or bodily comfort — letting appetite rule. Its remedy is temperance and gratitude.'
      },
      q: {
        child: ['Did I eat too much, or grab more than my share?'],
        adult: ['Where does appetite — food, drink, alcohol, or comfort — rule me instead of serving me?',
                'Do I use eating, drinking, or substances to escape, numb, or comfort myself?']
      },
      check: {
        child: ['I ate too much or was greedy with treats.', 'I complained about my food.',
                'I was not grateful for my meals.'],
        teen:  ['I overate or used food to cope.', 'I drank or used substances I shouldn’t have.',
                'I let cravings or comfort control me.', 'I was wasteful or ungrateful with food.'],
        adult: ['I ate or drank to excess.', 'I abused alcohol, drugs, or other substances.',
                'I used food, drink, or comfort to escape or numb.', 'I let appetite rule reason.',
                'I was wasteful while others go without.', 'I neglected reasonable fasting or self-discipline.']
      }
    },
    {
      id: 'lust', emoji: '🤍', name: 'Lust',
      tag: { adult: 'Disordered desire; sins against chastity' },
      body: {
        child: 'This is about keeping ourselves pure: being modest, treating our body and other people’s bodies with respect, and not looking at bad pictures.',
        teen:  'Lust is the desire to use another person, or oneself, for pleasure rather than to love them. Chastity is the virtue that lets us love rightly, with respect for ourselves and others. God made our bodies good — chastity honors that.',
        adult: 'Lust is disordered desire — seeking sexual pleasure cut off from love and God’s design. Chastity, lived according to one’s state in life, frees us to love truly. Be honest but not graphic; you need only name the kind of sin.'
      },
      q: {
        child: ['Did I look at or say things that were not pure, or treat my body or someone else’s without respect?'],
        teen:  ['Have I treated my body, or another person’s, as an object instead of with respect?',
                'Have I sought out impure images, conversations, or content?'],
        adult: ['Where have I sought sexual pleasure apart from God’s design for love?',
                'Have I used pornography, impure media, or entertained impure thoughts?',
                'Have I been unfaithful, or treated another person as an object rather than a person to love?']
      },
      check: {
        child: ['I looked at or said things that were not pure.', 'I was not modest.',
                'I did not treat my body, or others’, with respect.'],
        teen:  ['I looked at pornography or impure images.', 'I entertained impure thoughts on purpose.',
                'I used impure language or jokes.', 'I treated someone as an object, not a person.',
                'I did things, alone or with another, against chastity.', 'I dressed or acted to provoke lust.'],
        adult: ['I viewed pornography or impure material.', 'I willfully entertained impure thoughts or fantasies.',
                'I committed impure acts alone (masturbation).', 'I committed impure acts with another / outside marriage.',
                'I was unfaithful to my spouse in act, word, or heart.', 'I treated others as objects of desire rather than persons.',
                'I used contraception or acted against the meaning of marriage.']
      }
    }
  ];

  // ---- The Ten Commandments ------------------------------------------------
  var COMMANDMENTS = [
    {
      id: 'c1', emoji: '✝️', name: '1st Commandment',
      tag: { adult: 'I am the Lord your God; you shall have no other gods before me.' },
      body: {
        child: 'Loving God most of all, praying, and putting God first.',
        adult: 'Faith, hope, charity, and worship owed to God alone — and the things that crowd him out.'
      },
      q: {
        child: ['Did I remember to pray and to put God first?'],
        adult: ['What has taken God’s place at the center of my life?',
                'Is my prayer life real, or neglected? Do I trust God, or live as if he weren’t there?']
      },
      check: {
        child: ['I forgot to pray.', 'I did not put God first.', 'I did not believe or trust God.'],
        teen:  ['I neglected prayer.', 'I doubted or denied my faith to fit in.', 'I put other things — phone, image, friends — before God.',
                'I dabbled in horoscopes, the occult, or superstition.'],
        adult: ['I neglected prayer and my relationship with God.', 'I doubted, denied, or was ashamed of my faith.',
                'I put money, success, pleasure, or a person in God’s place.', 'I engaged in superstition, the occult, or astrology.',
                'I despaired of God’s mercy, or presumed on it.', 'I received Communion in serious sin.']
      }
    },
    {
      id: 'c2', emoji: '🗣️', name: '2nd Commandment',
      tag: { adult: 'You shall not take the name of the Lord your God in vain.' },
      body: {
        child: 'Saying God’s and Jesus’ names with love and respect.',
        adult: 'Reverence for the holy names of God, Jesus, Mary, and the saints — in speech and in promises.'
      },
      q: {
        child: ['Did I say God’s or Jesus’ name in a bad or careless way?'],
        adult: ['How do I speak of God, holy things, and sacred persons? With reverence, or carelessly?',
                'Have I broken a promise or oath made before God?']
      },
      check: {
        child: ['I said God’s or Jesus’ name in a bad way.', 'I was not respectful about holy things.'],
        adult: ['I used God’s name carelessly, in anger, or as a curse.', 'I blasphemed or spoke against God, the Church, or the saints.',
                'I broke a vow or promise made to God.', 'I spoke of sacred things with mockery or irreverence.']
      }
    },
    {
      id: 'c3', emoji: '⛪', name: '3rd Commandment',
      tag: { adult: 'Remember to keep holy the Lord’s Day.' },
      body: {
        child: 'Going to Mass on Sunday and keeping Sunday special and restful.',
        adult: 'Sunday Mass, rest, and keeping the Lord’s Day holy.'
      },
      q: {
        child: ['Did I go to Mass and behave well there?'],
        adult: ['Do I keep Sunday holy — Mass, rest, time for God and family — or just another busy day?',
                'Am I present at Mass, or distracted and going through the motions?']
      },
      check: {
        child: ['I did not behave at Mass.', 'I complained about going to church.'],
        teen:  ['I missed Sunday Mass through my own fault.', 'I was deliberately distracted or disruptive at Mass.',
                'I treated Sunday as just another day.'],
        adult: ['I missed Sunday or holy-day Mass through my own fault.', 'I came to Mass habitually late or left early without reason.',
                'I was willfully distracted or irreverent at Mass.', 'I did unnecessary work that robbed the day of rest and God.']
      }
    },
    {
      id: 'c4', emoji: '👨‍👩‍👧', name: '4th Commandment',
      tag: { adult: 'Honor your father and your mother.' },
      body: {
        child: 'Obeying and respecting my parents, and being kind to my family.',
        adult: 'Honor, obedience, and care owed to parents, family, and legitimate authority — and their duties in turn.'
      },
      q: {
        child: ['Did I obey and respect my parents and teachers?'],
        adult: ['How do I treat my parents, my family, those in authority — and those in my care?',
                'Do I neglect, dishonor, or fail in my duties to family?']
      },
      check: {
        child: ['I disobeyed my parents.', 'I was disrespectful or talked back.', 'I did not help my family.',
                'I was unkind to my brothers or sisters.'],
        teen:  ['I disobeyed or disrespected my parents.', 'I was rude, cold, or rebellious at home.',
                'I neglected my family responsibilities.', 'I was unkind to siblings or relatives.'],
        adult: ['I dishonored or neglected my parents or elders.', 'I failed in my duties to my spouse or children.',
                'I disrespected legitimate authority.', 'I neglected the care of those entrusted to me.',
                'I set a poor example for my family or led them away from God.']
      }
    },
    {
      id: 'c5', emoji: '❤️‍🩹', name: '5th Commandment',
      tag: { adult: 'You shall not kill.' },
      body: {
        child: 'Being kind, not hurting others, and taking care of myself.',
        adult: 'Respect for human life and dignity — mine and others’ — in body, word, and care.'
      },
      q: {
        child: ['Did I hurt someone, or say very mean things?'],
        adult: ['Have I harmed anyone in body, or in heart — through anger, hatred, words, or neglect?',
                'How do I care for my own life and health? Do I harm myself?',
                'Have I had any part in abortion, or in serious harm to life?']
      },
      check: {
        child: ['I hurt someone on purpose.', 'I said very mean or hateful things.', 'I bullied or teased someone.',
                'I did not take care of myself.'],
        teen:  ['I bullied, harassed, or hurt someone.', 'I held hatred or wished harm on someone.',
                'I harmed myself (self-harm, substances, reckless risk).', 'I led others into sin or harm.',
                'I was cruel online.'],
        adult: ['I harmed someone in body or seriously in heart.', 'I held hatred, contempt, or the desire for revenge.',
                'I had any part in abortion or euthanasia.', 'I harmed my own life or health (substances, self-harm, recklessness).',
                'I gave scandal or led others into sin.', 'I was indifferent to those suffering or in need.',
                'I damaged someone with my anger or words.']
      }
    },
    {
      id: 'c6', emoji: '🤍', name: '6th & 9th Commandments',
      tag: { adult: 'You shall not commit adultery / covet your neighbor’s spouse.' },
      body: {
        child: 'Keeping pure: being modest and respecting my body and others’, and not looking at bad pictures.',
        teen:  'Chastity — loving rightly, with respect for myself and others, in body and in heart. God made the body good; purity honors it.',
        adult: 'Chastity in act, word, and heart, according to one’s state in life. Be honest, but you need only name the kind of sin, not its details.'
      },
      q: {
        child: ['Was I pure — modest, respectful of my body and others’, away from bad pictures?'],
        teen:  ['Have I treated my body, or another’s, with respect — or as an object?',
                'Have I sought out impure images, content, or conversations?'],
        adult: ['Where have I sinned against chastity in act, word, or thought?',
                'Have I used pornography or impure media? Been unfaithful in body or heart?']
      },
      check: {
        child: ['I looked at or said impure things.', 'I was not modest.', 'I did not respect my body or others’.'],
        teen:  ['I looked at pornography or impure images.', 'I willfully entertained impure thoughts.',
                'I used impure language or jokes.', 'I did impure things, alone or with another.',
                'I treated someone as an object of desire.'],
        adult: ['I viewed pornography or impure material.', 'I willfully entertained lustful thoughts or fantasies.',
                'I committed impure acts alone or with another.', 'I was unfaithful to my spouse in act or in heart.',
                'I engaged in sex outside of marriage.', 'I used contraception or acted against marriage’s meaning.',
                'I was immodest or led others to impurity.']
      }
    },
    {
      id: 'c7', emoji: '🤝', name: '7th & 10th Commandments',
      tag: { adult: 'You shall not steal / covet your neighbor’s goods.' },
      body: {
        child: 'Being honest with things, not taking what isn’t mine, and being happy with what I have.',
        adult: 'Justice and honesty with property and work, generosity to the poor, and contentment of heart over envy and greed.'
      },
      q: {
        child: ['Did I take something that wasn’t mine, or want things too much?'],
        adult: ['Have I been honest and just with property, money, and work?',
                'Am I generous, or do I cling, cheat, or envy what others have?']
      },
      check: {
        child: ['I took something that wasn’t mine.', 'I did not give back what I borrowed.',
                'I wanted things too much.', 'I would not share.'],
        teen:  ['I stole or kept what wasn’t mine.', 'I cheated (on tests, work, or online).',
                'I was greedy or materialistic.', 'I envied others’ things.', 'I damaged or wasted others’ property.'],
        adult: ['I stole, cheated, or kept what isn’t mine.', 'I was dishonest in work, business, or taxes.',
                'I failed to pay debts or make restitution.', 'I was greedy, or refused to help the poor.',
                'I coveted or envied others’ possessions.', 'I damaged property or was a careless steward of creation.']
      }
    },
    {
      id: 'c8', emoji: '💬', name: '8th Commandment',
      tag: { adult: 'You shall not bear false witness against your neighbor.' },
      body: {
        child: 'Telling the truth, and being kind with my words about others.',
        adult: 'Truthfulness, and the good name of others — against lies, gossip, calumny, and judgment.'
      },
      q: {
        child: ['Did I tell a lie, or say mean things about someone?'],
        adult: ['Have I been truthful — or lied, exaggerated, or deceived?',
                'Have I harmed anyone’s good name through gossip, detraction, or rash judgment?']
      },
      check: {
        child: ['I told a lie.', 'I said mean things about someone.', 'I tattled to get someone in trouble.',
                'I blamed someone for something I did.'],
        teen:  ['I lied or deceived.', 'I gossiped or spread rumors.', 'I damaged someone’s reputation.',
                'I judged others harshly.', 'I cheated or was two-faced.'],
        adult: ['I lied, deceived, or exaggerated.', 'I gossiped or engaged in detraction.',
                'I slandered someone or harmed their reputation (calumny).', 'I judged others rashly.',
                'I betrayed a confidence.', 'I failed to defend the truth or someone unjustly accused.',
                'I was hypocritical or insincere.']
      }
    }
  ];

  // Prefer the richer, source-reviewed content from examination.js when present.
  // The arrays above remain as an offline fallback if that file fails to load.
  if (typeof window !== 'undefined' && window.EXAMINATION_CONTENT) {
    if (Array.isArray(window.EXAMINATION_CONTENT.sins) && window.EXAMINATION_CONTENT.sins.length) {
      SINS = window.EXAMINATION_CONTENT.sins;
    }
    if (Array.isArray(window.EXAMINATION_CONTENT.commandments) && window.EXAMINATION_CONTENT.commandments.length) {
      COMMANDMENTS = window.EXAMINATION_CONTENT.commandments;
    }
  }

  // ---- Acts of Contrition --------------------------------------------------
  var CONTRITION = {
    child: {
      label: 'Simple (for children)',
      text: 'O my God, I am sorry for my sins with all my heart. Help me to be good, to do what is right, and to love you and others more. In the name of Jesus, my God, have mercy. Amen.'
    },
    modern: {
      label: 'From the Rite (modern)',
      text: 'O my God, I am sorry for my sins with all my heart. In choosing to do wrong and failing to do good, I have sinned against you, whom I should love above all things. I firmly intend, with your help, to do penance, to sin no more, and to avoid whatever leads me to sin. Our Savior Jesus Christ suffered and died for us. In his name, my God, have mercy. Amen.'
    },
    traditional: {
      label: 'Traditional',
      text: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasion of sin. Amen.'
    }
  };

  // ---- The steps of Confession ---------------------------------------------
  var CONFESSION_STEPS = [
    { t: 'Before you go in', d: 'Quiet your heart. Ask the Holy Spirit for light and for true sorrow. Bring your list (or just hold it in mind). Remember: you are coming to a Father who is glad you came.' },
    { t: 'Begin', d: 'Make the Sign of the Cross with the priest, and say: “Bless me, Father, for I have sinned. It has been [time] since my last confession.” (Or: “This is my first confession.”)' },
    { t: 'Confess your sins', d: 'Tell your sins simply and honestly. For serious (mortal) sins, name the kind and, as best you can, how often. You don’t have to explain, justify, or give details — just name them. Then say: “For these and all my sins, I am sorry.”' },
    { t: 'Listen', d: 'The priest may offer a few words of counsel and will give you a penance (a prayer or action). Receive it peacefully.' },
    { t: 'Act of Contrition', d: 'Pray your Act of Contrition aloud (the priest may invite you). It is your “yes” to God’s mercy and your resolve to begin again.' },
    { t: 'Absolution', d: 'The priest extends his hand and absolves you in the name of the Father, and of the Son, and of the Holy Spirit. Answer: “Amen.” In that moment your sins are truly forgiven.' },
    { t: 'Afterward', d: 'Give thanks. Do your penance soon. Then let the sins go — they are washed away. Don’t carry what God has already forgiven.' }
  ];

  // ---- Nightly Examen (Ignatian, 5 movements) ------------------------------
  var EXAMEN_STEPS = [
    { id: 'gratitude', kicker: 'Give thanks', q: 'What am I grateful for today? Name the gifts — small and large — that God gave you.' },
    { id: 'petition',  kicker: 'Ask for light', q: 'Ask God for the light to see your day as he sees it — with honesty, and with mercy. What grace do you most need tonight?' },
    { id: 'review',    kicker: 'Review the day', q: 'Walk back through your day. Where did you find love, joy, or God’s presence? Where did you fall short or turn away?' },
    { id: 'sorrow',    kicker: 'Seek forgiveness', q: 'Where do you need to ask God’s forgiveness? Whom do you need to forgive — including yourself?' },
    { id: 'resolve',   kicker: 'Look to tomorrow', q: 'What one thing will you do tomorrow, with God’s help? End in a short prayer of hope.' }
  ];

  /* =============================================================== rendering */
  var app;
  function h(html) { return html; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ageLabel() {
    var a = AGES.filter(function (x) { return x.id === state.age; })[0];
    return a ? a.name : '';
  }
  function go(view, opts) {
    opts = opts || {};
    if (!opts.noPush && state.view) state.stack.push({ view: state.view, lens: state.lens, sectionIndex: state.sectionIndex });
    state.view = view;
    if (opts.lens) state.lens = opts.lens;
    if (typeof opts.sectionIndex === 'number') state.sectionIndex = opts.sectionIndex;
    render();
    window.scrollTo(0, 0);
  }
  function back() {
    var prev = state.stack.pop();
    if (prev) { state.view = prev.view; state.lens = prev.lens; state.sectionIndex = prev.sectionIndex; }
    else state.view = 'home';
    render();
    window.scrollTo(0, 0);
  }

  function ico(name) {
    var s = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var paths = {
      home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/>',
      list: '<path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
      moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
      book: '<path d="M5 6h14a1 1 0 0 1 1 1v12l-4-2-4 2-4-2-4 2V7a1 1 0 0 1 1-1Z"/>',
      gear: '<path d="M4 8h9"/><path d="M17 8h3"/><circle cx="15" cy="8" r="2"/><path d="M4 16h3"/><path d="M11 16h9"/><circle cx="9" cy="16" r="2"/>',
      check: '<polyline points="4 12 9 17 20 6"/>',
      back: '<path d="M15 5l-7 7 7 7"/>'
    };
    return '<svg ' + s + '>' + (paths[name] || '') + '</svg>';
  }

  function backbar(label) {
    return '<div class="backbar"><button class="backbtn" data-action="back">' + ico('back') +
      '<span>' + esc(label || 'Back') + '</span></button></div>';
  }

  /* --------------------------------------------------------- ONBOARD / AGE */
  function renderOnboard() {
    app.innerHTML =
      '<div class="stack">' +
      '<div class="center" style="margin-top:8px">' +
        '<div class="boot-mark" style="margin:0 auto" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><path d="M12 21a6 6 0 0 0 6-6c0-3-2.5-5-6-9-3.5 4-6 6-6 9a6 6 0 0 0 6 6Z"/></svg>' +
        '</div>' +
        '<h1 class="serif" style="margin-top:14px">Examen AI</h1>' +
        '<p class="lede">A quiet, private place to examine your conscience, prepare a good confession, and end your day with God.</p>' +
      '</div>' +
      '<div class="callout privacy"><span class="co-ico">🔒</span><div class="co-body">' +
        '<strong>Everything stays on this device.</strong> Nothing you write here is ever sent anywhere — no account, no server. You can erase it any time. This is between you and God.' +
      '</div></div>' +
      '<div class="card"><h2>First, who is this for?</h2>' +
        '<p class="muted small">This gently shapes the language and the questions. You can change it later in Settings.</p>' +
        '<div class="age-grid" id="ageGrid">' +
          AGES.map(function (a) {
            return '<button class="age-card" data-action="set-age" data-age="' + a.id + '" aria-pressed="false">' +
              '<div class="ac-emoji">' + a.emoji + '</div><div class="ac-name">' + esc(a.name) + '</div>' +
              '<div class="ac-age">' + esc(a.age) + '</div></button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '</div>';
  }

  /* --------------------------------------------------------------- HOME */
  function renderHome() {
    var lastConf = rawGet(K.lastConf);
    app.innerHTML =
      '<div class="stack">' +
      '<div class="row between">' +
        '<div><h1 class="serif" style="margin-bottom:2px">Examen AI</h1>' +
          '<div class="muted small">Mode: ' + esc(ageLabel()) + ' · private on this device</div></div>' +
      '</div>' +

      '<button class="card-tap" data-action="go" data-view="lens">' +
        '<div class="row"><div class="ct-ico">🪞</div><div>' +
          '<div class="ct-title">Examine my conscience</div>' +
          '<div class="ct-desc">Prepare for confession — walk through, reflect, and build your list.</div>' +
        '</div></div>' +
      '</button>' +

      '<button class="card-tap" data-action="go" data-view="list">' +
        '<div class="row"><div class="ct-ico">📝</div><div>' +
          '<div class="ct-title">My confession list</div>' +
          '<div class="ct-desc">See everything you’ve noted, ready to bring to the priest.</div>' +
        '</div></div>' +
      '</button>' +

      '<button class="card-tap" data-action="go" data-view="guide">' +
        '<div class="row"><div class="ct-ico">📖</div><div>' +
          '<div class="ct-title">How to go to confession</div>' +
          '<div class="ct-desc">A short, calm guide — and the Act of Contrition.</div>' +
        '</div></div>' +
      '</button>' +

      '<button class="card-tap" data-action="go" data-view="examen">' +
        '<div class="row"><div class="ct-ico">🌙</div><div>' +
          '<div class="ct-title">Nightly examen</div>' +
          '<div class="ct-desc">Five quiet minutes to look back on your day with God.</div>' +
        '</div></div>' +
      '</button>' +

      (AX ?
      '<button class="card-tap" data-action="go" data-view="course">' +
        '<div class="row"><div class="ct-ico brain-ico"><img src="brain.png" alt="" /></div><div>' +
          '<div class="ct-title">The Attention Examen</div>' +
          '<div class="ct-desc">A 30-day practice to reclaim your attention — the faculty by which you love.</div>' +
        '</div></div>' +
      '</button>' : '') +

      '<div class="callout mercy"><span class="co-ico">🕊️</span><div class="co-body">' +
        '<strong>Take heart.</strong> This is preparation, not the sacrament itself — and not a test to fear. God’s mercy is greater than anything you bring. Be honest, be gentle with yourself, and let him do the rest.' +
      '</div></div>' +

      (lastConf ? '<p class="center muted small">Last confession noted: ' + esc(lastConf) + '</p>' : '') +
      '</div>';
  }

  /* --------------------------------------------------- LENS CHOICE (EOC) */
  function renderLens() {
    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<h1 class="serif">Examine my conscience</h1>' +
      '<p class="lede">Choose how you’d like to walk through. Both lead to the same honest place — pick whichever helps you see your heart more clearly.</p>' +

      '<button class="card-tap" data-action="open-lens" data-lens="sins">' +
        '<div class="ct-title">By the Seven Capital Sins</div>' +
        '<div class="ct-desc">Pride, envy, anger, sloth, greed, gluttony, lust — the roots beneath our sins.</div>' +
      '</button>' +
      '<button class="card-tap" data-action="open-lens" data-lens="commandments">' +
        '<div class="ct-title">By the Ten Commandments</div>' +
        '<div class="ct-desc">God’s law for love of him and of neighbor, the classic examination.</div>' +
      '</button>' +

      '<div class="callout"><span class="co-ico">💡</span><div class="co-body">' +
        'Go gently and prayerfully. You don’t have to check everything or write a lot — the questions are just to help you notice. The Holy Spirit does the real work.' +
      '</div></div>' +
      '</div>';
  }

  function lensSections() { return state.lens === 'sins' ? SINS : COMMANDMENTS; }
  function lensTitle() { return state.lens === 'sins' ? 'The Seven Capital Sins' : 'The Ten Commandments'; }

  function eocData() {
    var d = load(K.eoc, {});
    if (!d[state.lens]) d[state.lens] = {};
    return d;
  }
  function sectionRecord(d, secId) {
    if (!d[state.lens][secId]) d[state.lens][secId] = { notes: {}, checked: {} };
    return d[state.lens][secId];
  }
  function sectionTouched(secId) {
    var d = load(K.eoc, {});
    var r = d[state.lens] && d[state.lens][secId];
    if (!r) return false;
    var hasNote = r.notes && Object.keys(r.notes).some(function (k) { return (r.notes[k] || '').trim(); });
    var hasCheck = r.checked && Object.keys(r.checked).some(function (k) { return r.checked[k]; });
    return hasNote || hasCheck;
  }

  /* ---- the section LIST (overview of the chosen lens) ---- */
  function renderSectionList() {
    var secs = lensSections();
    app.innerHTML =
      backbar('Back') +
      '<div class="stack">' +
      '<h1 class="serif">' + esc(lensTitle()) + '</h1>' +
      '<p class="muted">Tap any area to reflect. A green dot means you’ve noted something there. Take them in any order.</p>' +
      '<div>' +
        secs.map(function (s, i) {
          var touched = sectionTouched(s.id);
          return '<button class="sec-item" data-action="open-section" data-index="' + i + '">' +
            '<span class="si-ico">' + s.emoji + '</span>' +
            '<span><span class="si-name">' + esc(s.name) + '</span>' +
            (pick(s.tag, state.age) ? '<br><span class="si-meta">' + esc(pick(s.tag, state.age)) + '</span>' : '') +
            '</span>' +
            '<span class="si-dot ' + (touched ? 'touched' : '') + '" aria-hidden="true"></span>' +
          '</button>';
        }).join('') +
      '</div>' +
      '<button class="btn block" data-action="go" data-view="list">See my confession list ' + ico('list') + '</button>' +
      '<button class="btn ghost block" data-action="open-section" data-index="0">Walk through from the beginning</button>' +
      '</div>';
  }

  /* ---- a single section step (questions + checklist) ---- */
  function renderSection() {
    var secs = lensSections();
    var i = Math.max(0, Math.min(state.sectionIndex, secs.length - 1));
    state.sectionIndex = i;
    var s = secs[i];
    var d = eocData();
    var rec = sectionRecord(d, s.id);
    var questions = pick(s.q, state.age) || [];
    var checks = pick(s.check, state.age) || [];
    var body = pick(s.body, state.age) || '';
    var pct = Math.round(((i + 1) / secs.length) * 100);

    app.innerHTML =
      backbar(lensTitle()) +
      '<div class="stack">' +
      '<div class="progress-rail"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="muted small">' + (i + 1) + ' of ' + secs.length + '</div>' +

      '<div class="eoc-head">' +
        '<div class="eoc-emoji">' + s.emoji + '</div>' +
        '<h1 class="serif" style="margin:6px 0 4px">' + esc(s.name) + '</h1>' +
        '<p class="lede">' + esc(body) + '</p>' +
      '</div>' +

      questions.map(function (q, qi) {
        var val = (rec.notes && rec.notes[qi]) || '';
        return '<div class="q-block">' +
          '<div class="q-text">' + esc(q) + '</div>' +
          '<textarea class="reflect" data-note="' + qi + '" placeholder="Write as much or as little as you like… (stays on this device)">' + esc(val) + '</textarea>' +
        '</div>';
      }).join('') +

      (checks.length ?
        '<div class="checklist">' +
          '<div class="cl-label">Or tap any that apply</div>' +
          checks.map(function (c, ci) {
            var on = !!(rec.checked && rec.checked[ci]);
            return '<button class="check-item" data-action="toggle-check" data-ci="' + ci + '" aria-pressed="' + on + '">' +
              '<span class="cb">' + ico('check') + '</span>' +
              '<span>' + esc(c) + '</span>' +
            '</button>';
          }).join('') +
        '</div>' : '') +

      '<div class="stepbar">' +
        (i > 0 ? '<button class="btn ghost" data-action="step" data-dir="-1">Previous</button>' : '<span></span>') +
        (i < secs.length - 1 ?
          '<button class="btn" data-action="step" data-dir="1">Next</button>' :
          '<button class="btn" data-action="go" data-view="list">Finish — see my list</button>') +
      '</div>' +
      '<button class="btn quiet block" data-action="go" data-view="sectionlist">Back to all areas</button>' +
      '</div>';

    // wire textareas (save on input)
    Array.prototype.forEach.call(app.querySelectorAll('textarea[data-note]'), function (ta) {
      ta.addEventListener('input', function () {
        var d2 = eocData();
        var r2 = sectionRecord(d2, s.id);
        if (!r2.notes) r2.notes = {};
        r2.notes[ta.getAttribute('data-note')] = ta.value;
        save(K.eoc, d2);
      });
    });
  }

  /* ------------------------------------------------------ COMPILED LIST */
  function renderList() {
    var d = load(K.eoc, {});
    // Normalize a checklist item so the same sin worded near-identically across the two
    // lenses (e.g. it lives under both Lust and the 6th Commandment) collapses to one entry.
    function normSin(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
    // 1) gather the raw selections per section
    var raw = [];
    ['sins', 'commandments'].forEach(function (lens) {
      var secs = lens === 'sins' ? SINS : COMMANDMENTS;
      secs.forEach(function (s) {
        var rec = d[lens] && d[lens][s.id];
        if (!rec) return;
        var checks = pick(s.check, state.age) || [];
        var cItems = [], nItems = [];
        if (rec.checked) Object.keys(rec.checked).forEach(function (ci) {
          if (rec.checked[ci] && checks[ci]) cItems.push(checks[ci]);
        });
        if (rec.notes) Object.keys(rec.notes).forEach(function (qi) {
          var t = (rec.notes[qi] || '').trim();
          if (t) nItems.push(t);
        });
        if (cItems.length || nItems.length) raw.push({ emoji: s.emoji, name: s.name, checks: cItems, notes: nItems });
      });
    });
    // 2) count how many places each checked sin came up across the whole examination
    var counts = {};
    raw.forEach(function (g) { g.checks.forEach(function (c) { var k = normSin(c); counts[k] = (counts[k] || 0) + 1; }); });
    // 3) build display groups — show each checked sin ONCE (first place it appears), and if it
    //    surfaced in more than one place, mark it rather than repeating it. Notes are never merged.
    var shown = {};
    var groups = [];
    raw.forEach(function (g) {
      var items = [];
      g.checks.forEach(function (c) {
        var k = normSin(c);
        if (shown[k]) return;
        shown[k] = true;
        items.push({ type: 'check', text: c, dup: counts[k] > 1 });
      });
      g.notes.forEach(function (t) { items.push({ type: 'note', text: t }); });
      if (items.length) groups.push({ emoji: g.emoji, name: g.name, items: items });
    });

    var hasAny = groups.length > 0;
    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<h1 class="serif">My confession list</h1>' +
      (hasAny ?
        '<p class="muted">Bring this to confession — read it, or just let it remind you. You only need to name your sins simply and honestly.</p>' +
        groups.map(function (g) {
          return '<div class="list-group"><h3>' + g.emoji + ' ' + esc(g.name) + '</h3>' +
            '<ul>' + g.items.map(function (it) {
              return it.type === 'note'
                ? '<li><span class="list-note">' + esc(it.text) + '</span></li>'
                : '<li>' + esc(it.text) + (it.dup ? ' <span class="dup-note">noted in more than one place</span>' : '') + '</li>';
            }).join('') + '</ul></div>';
        }).join('') +
        '<div class="callout mercy"><span class="co-ico">🕊️</span><div class="co-body">' +
          'When you’ve confessed, your sins are forgiven — truly and completely. Use <strong>Clear my list</strong> below to wipe it from this device and walk away light.' +
        '</div></div>' +
        '<button class="btn soft block" data-action="print">Print / save as PDF</button>' +
        '<button class="btn danger block" data-action="clear-list">I’ve been to confession — clear my list</button>'
        :
        '<div class="card center"><div style="font-size:2rem">📝</div>' +
          '<p>Your list is empty.</p>' +
          '<p class="muted small">As you examine your conscience, what you note and check will gather here, ready for confession.</p>' +
          '<button class="btn block" data-action="go" data-view="lens" style="margin-top:8px">Examine my conscience</button>' +
        '</div>') +
      '</div>';
  }

  /* ------------------------------------------------------- CONFESSION GUIDE */
  function renderGuide() {
    var ac = state.age === 'child' ? CONTRITION.child : CONTRITION.modern;
    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<h1 class="serif">How to go to confession</h1>' +
      '<p class="lede">It is simpler than you fear, and the priest is there to help. Here is the whole of it.</p>' +

      '<div class="card">' +
        CONFESSION_STEPS.map(function (st, i) {
          return '<div class="guide-step"><div class="guide-num">' + (i + 1) + '</div>' +
            '<div class="gs-body"><h3>' + esc(st.t) + '</h3><p>' + esc(st.d) + '</p></div></div>';
        }).join('') +
      '</div>' +

      '<h2 class="serif">The Act of Contrition</h2>' +
      '<p class="muted small">Pray this from the heart during confession. Tap to see other versions.</p>' +
      '<div class="prayer" id="acText">' + esc(ac.text) + '</div>' +
      '<div class="row wrap">' +
        Object.keys(CONTRITION).map(function (key) {
          return '<button class="btn ghost small" data-action="set-contrition" data-key="' + key + '">' +
            esc(CONTRITION[key].label) + '</button>';
        }).join('') +
      '</div>' +

      '<div class="callout"><span class="co-ico">🗓️</span><div class="co-body">' +
        'Note today as your last confession (helps you say “it’s been ___ ” next time)?' +
        '<br><button class="btn-link" data-action="mark-confession">Mark today as my last confession</button>' +
      '</div></div>' +

      '<div class="callout mercy"><span class="co-ico">🕊️</span><div class="co-body">' +
        '<strong>Don’t be afraid.</strong> If you forget something, or it’s been years, just tell the priest — he will help you. What matters is honest sorrow and trust in God’s mercy.' +
      '</div></div>' +
      '</div>';
  }

  /* --------------------------------------------------------- NIGHTLY EXAMEN */
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function renderExamen() {
    var all = load(K.nightly, {});
    var today = todayStr();
    var rec = all[today] || {};
    var dateNice = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<h1 class="serif">Nightly examen</h1>' +
      '<p class="muted">' + esc(dateNice) + ' · a quiet review of your day with God</p>' +

      EXAMEN_STEPS.map(function (st, i) {
        var val = rec[st.id] || '';
        return '<div class="card examen-step">' +
          '<div class="es-kicker">' + (i + 1) + '. ' + esc(st.kicker) + '</div>' +
          '<div class="q-text" style="margin-top:6px">' + esc(st.q) + '</div>' +
          '<textarea class="reflect" data-examen="' + st.id + '" placeholder="…">' + esc(val) + '</textarea>' +
        '</div>';
      }).join('') +

      '<div class="prayer center">Glory be to the Father, and to the Son, and to the Holy Spirit; as it was in the beginning, is now, and ever shall be, world without end. Amen.</div>' +

      '<div class="callout"><span class="co-ico">🌙</span><div class="co-body">' +
        'Your examens are saved privately by date, on this device only. ' +
        '<button class="btn-link" data-action="examen-history">See past examens</button>' +
      '</div></div>' +
      '</div>';

    Array.prototype.forEach.call(app.querySelectorAll('textarea[data-examen]'), function (ta) {
      ta.addEventListener('input', function () {
        var a2 = load(K.nightly, {});
        if (!a2[today]) a2[today] = {};
        a2[today][ta.getAttribute('data-examen')] = ta.value;
        save(K.nightly, a2);
      });
    });
  }

  function renderExamenHistory() {
    var all = load(K.nightly, {});
    var dates = Object.keys(all).sort().reverse().filter(function (dt) {
      return EXAMEN_STEPS.some(function (st) { return (all[dt][st.id] || '').trim(); });
    });
    app.innerHTML =
      backbar('Nightly examen') +
      '<div class="stack">' +
      '<h1 class="serif">Past examens</h1>' +
      (dates.length ?
        dates.map(function (dt) {
          var rec = all[dt];
          var nice = new Date(dt + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
          return '<div class="card"><h3>' + esc(nice) + '</h3>' +
            EXAMEN_STEPS.map(function (st) {
              var v = (rec[st.id] || '').trim();
              return v ? '<p class="small"><strong>' + esc(st.kicker) + ':</strong> ' + esc(v) + '</p>' : '';
            }).join('') + '</div>';
        }).join('')
        : '<div class="card center muted">No past examens yet.</div>') +
      '</div>';
  }

  /* ============================================ THE ATTENTION EXAMEN (course)
     Sean's finished 30-day workbook, rendered as an interactive course. Content
     is verbatim from attention-examen.js (window.ATTENTION_EXAMEN). Responses are
     saved per day, on-device only. */
  function attnData() {
    var d = load(K.attn, {});
    if (!d.days) d.days = {};
    return d;
  }
  function attnDayRec(d, n) {
    if (!d.days[n]) d.days[n] = { ex: {}, notes: '' };
    return d.days[n];
  }
  function attnDayTouched(n) {
    var d = load(K.attn, {});
    var r = d.days && d.days[n];
    if (!r) return false;
    if ((r.notes || '').trim()) return true;
    return r.ex && Object.keys(r.ex).some(function (k) { return (r.ex[k] || '').trim(); });
  }
  function attnCompletedCount() {
    var c = 0;
    for (var i = 1; i <= AX.days.length; i++) if (attnDayTouched(i)) c++;
    return c;
  }
  function attnCurrentDay() {        // first untouched day, else last
    for (var i = 1; i <= AX.days.length; i++) if (!attnDayTouched(i)) return i;
    return AX.days.length;
  }
  function paras(arr) {
    return (arr || []).map(function (p) {
      var isAnchor = /^Anchor:/i.test(p.trim());
      if (isAnchor) return '<p class="list-note" style="font-style:normal">' + esc(p) + '</p>';
      return '<p>' + esc(p) + '</p>';
    }).join('');
  }

  function attnIntroSeen() { return load(K.attn, {}).introSeen === true; }
  function setAttnIntroSeen() { var d = load(K.attn, {}); d.introSeen = true; save(K.attn, d); }

  // The course opens like a devotional book — a title page, then the preface
  // ("A Note Before You Begin"), then how-to + the Five Movements, then the days.
  function renderCourseCover() {
    var done = attnCompletedCount();
    app.innerHTML =
      backbar('Home') +
      '<div class="stack book-cover center">' +
        '<div class="bc-eyebrow">A 30-day devotional · interactive</div>' +
        '<div class="bc-mark brain-mark" aria-hidden="true"><img src="brain.png" alt="" /></div>' +
        '<h1 class="serif bc-title">' + esc(titleCase(AX.meta.title)) + '</h1>' +
        '<p class="bc-sub">' + esc(AX.meta.subtitle) + '</p>' +
        '<div class="bc-byline">' + esc(AX.meta.author) + ' · ' + esc(AX.meta.movement) + '</div>' +
        '<hr class="divider" />' +
        '<p class="lede">You don’t just read this one — you practice it. Thirty evenings, a few honest minutes each: you watch where your attention actually went, notice who was forming you through it, and gently take it back.</p>' +
        '<p class="muted">It moves through five small movements you can keep for life. And it remembers where you are, so you can always return.</p>' +
        '<button class="btn block lg" data-action="begin-course-reading">Begin the practice</button>' +
        '<button class="btn quiet block" data-action="skip-course-intro">' + (done > 0 ? 'Skip to the 30 days' : 'Skip the introduction') + '</button>' +
      '</div>';
  }

  function renderCourse() {
    if (!attnIntroSeen()) return renderCourseCover();
    var total = AX.days.length;
    var done = attnCompletedCount();
    var cur = attnCurrentDay();
    var pct = Math.round((done / total) * 100);
    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<div class="pill">🕯️ ' + esc(AX.meta.movement) + '</div>' +
      '<h1 class="serif">' + esc(titleCase(AX.meta.title)) + '</h1>' +
      '<p class="lede">' + esc(AX.meta.subtitle) + '</p>' +
      '<p class="muted small">' + esc(AX.meta.author) + '</p>' +

      // Front matter first — read these before beginning, like the opening of a book.
      '<div class="bc-eyebrow" style="margin-top:4px">Start here</div>' +
      '<button class="card-tap" data-action="go" data-view="courseintro">' +
        '<div class="ct-title">A Note Before You Begin</div>' +
        '<div class="ct-desc">The preface — why your attention is the faculty by which you love.</div>' +
      '</button>' +
      '<button class="card-tap" data-action="go" data-view="coursehowto">' +
        '<div class="ct-title">How to use it · the Five Movements</div>' +
        '<div class="ct-desc">The shape of each evening’s practice — learn it once, keep it for life.</div>' +
      '</button>' +

      '<div class="card">' +
        '<div class="row between"><strong>Your progress</strong>' +
          '<span class="muted small">' + done + ' of ' + total + ' days</span></div>' +
        '<div class="progress-rail" style="margin-top:10px"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<button class="btn block lg" style="margin-top:16px" data-action="open-day" data-day="' + cur + '">' +
          (done === 0 ? 'Begin — Day 1' : (done >= total ? 'Revisit the practice' : 'Continue — Day ' + cur)) +
        '</button>' +
      '</div>' +

      (attnUnlocked() ? '' :
        '<div class="card unlock-cta">' +
          '<div class="row between"><strong>Days 1–3 are free</strong><span class="pill amber">' + esc(ATTN_CONFIG.price) + '</span></div>' +
          '<p class="small muted" style="margin:8px 0 12px">Unlock all 30 days of the practice — yours to keep, fully private, on this device.</p>' +
          '<button class="btn block" data-action="go" data-view="unlock">Unlock the full practice</button>' +
        '</div>') +

      '<h2 class="serif" style="margin-top:8px">The 30 days</h2>' +
      '<div class="day-grid">' +
        AX.days.map(function (day) {
          var touched = attnDayTouched(day.day);
          var locked = !dayAccessible(day.day);
          return '<button class="day-cell ' + (touched ? 'done ' : '') + (locked ? 'locked' : '') + '" data-action="open-day" data-day="' + day.day + '" title="' + esc(day.title) + (locked ? ' (locked)' : '') + '">' +
            (locked ? '<span class="dc-lock" aria-hidden="true">🔒</span>' : '<span class="dc-num">' + day.day + '</span>') +
            (touched ? '<span class="dc-dot" aria-hidden="true"></span>' : '') +
          '</button>';
        }).join('') +
      '</div>' +

      (attnUnlocked() ? (function () {
        var wk = [{ w: 1, from: 1, to: 7 }, { w: 2, from: 8, to: 14 }, { w: 3, from: 15, to: 21 }, { w: 4, from: 22, to: 30 }];
        var totalDone = attnCompletedCount();
        var s = '<h2 class="serif" style="margin-top:8px">Look back</h2>' +
          '<p class="muted small">Quiet reviews that gather what you’ve noticed — drawn from your own words, on this device.</p>';
        var any = false;
        wk.forEach(function (b) {
          var c = 0; for (var i = b.from; i <= b.to; i++) if (attnDayTouched(i)) c++;
          if (c >= 3) {
            any = true;
            s += '<button class="card-tap" data-action="open-review" data-from="' + b.from + '" data-to="' + b.to + '" data-kind="week" data-label="Week ' + b.w + '">' +
              '<div class="ct-title">Week ' + b.w + ' review</div>' +
              '<div class="ct-desc">Days ' + b.from + '–' + b.to + ' · ' + c + ' evening' + (c === 1 ? '' : 's') + ' you’ve walked</div></button>';
          }
        });
        if (totalDone >= 10) {
          s += '<button class="card-tap" data-action="open-review" data-from="1" data-to="30" data-kind="final" data-label="Your 30 days">' +
            '<div class="ct-title">Your 30 days — the full review</div>' +
            '<div class="ct-desc">A thorough look back across everything you’ve shared</div></button>';
        } else {
          s += '<p class="muted small" style="opacity:.85">' + (any ? 'Your full thirty-day review' : 'Your first review') + ' opens once you’ve walked about ten days — ' + totalDone + ' so far.</p>';
        }
        if (totalDone >= 1) {
          s += '<button class="btn ghost small block" style="margin-top:4px" data-action="download-engagement">Download my entries (keep a copy)</button>';
        }
        if (totalDone >= 25 || attnDayTouched(30)) {
          s += '<button class="btn quiet block" data-action="go" data-view="courserestart">Begin a new thirty days…</button>';
        }
        return s;
      })() : '') +

      '<div class="callout"><span class="co-ico">🕯️</span><div class="co-body">' +
        'Take one day at a time, in order. You will miss days — returning <em>is</em> the practice. Everything you write stays on this device.' +
      '</div></div>' +
      '</div>';
  }

  function renderUnlock() {
    var hasStore = !!ATTN_CONFIG.storeUrl;
    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack">' +
      '<div class="pill amber">🔓 Full practice · ' + esc(ATTN_CONFIG.price) + '</div>' +
      '<h1 class="serif">Unlock all 30 days</h1>' +
      '<p class="lede">You’ve seen the first three days. The full 30-day practice is how the change actually happens — one honest look at a time.</p>' +

      '<div class="card"><h3>What you get</h3>' +
        '<ul style="margin:0;padding-left:1.1em;color:var(--ink-soft)">' +
          '<li>All 30 days — reading, the Examen, a practice, and notes</li>' +
          '<li>Yours to keep on this device, fully private</li>' +
          '<li>The complete Five Movements practice for life</li>' +
        '</ul>' +
        (hasStore
          ? '<button class="btn block" style="margin-top:14px" data-action="buy">Get the full practice — ' + esc(ATTN_CONFIG.price) + '</button>'
          : '<p class="small muted" style="margin-top:14px">Purchase link isn’t set up yet. (Owner: set <code>storeUrl</code> in app.js.)</p>') +
      '</div>' +

      '<div class="card"><h3>Already purchased?</h3>' +
        '<p class="small muted">Enter the unlock code from your receipt.</p>' +
        '<input id="unlockCode" class="reflect" style="min-height:0;height:48px" placeholder="e.g. IE-XXXX-XXXX" autocapitalize="characters" autocomplete="off" />' +
        '<div id="unlockMsg" class="small" style="margin:8px 0;min-height:18px"></div>' +
        '<button class="btn soft block" data-action="try-unlock">Unlock</button>' +
      '</div>' +

      '<div class="callout privacy"><span class="co-ico">🔒</span><div class="co-body">' +
        'Unlocking only flips a private flag on this device — no account, and your reflections never leave it.' +
      '</div></div>' +
      '</div>';
  }

  function renderUnlocked() {
    var next = Math.max(ATTN_CONFIG.freeDays + 1, attnCurrentDay());
    app.innerHTML =
      '<div class="stack center" style="padding-top:8vh">' +
      '<div class="boot-mark" style="margin:0 auto" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 6"/></svg>' +
      '</div>' +
      '<h1 class="serif" style="margin-top:14px">You’re in.</h1>' +
      '<p class="lede">All 30 days are open. Take them one honest look at a time — there is no hurry, and no shame in the days you miss. Returning <em>is</em> the practice.</p>' +
      '<button class="btn block lg" data-action="open-day" data-day="' + next + '">Continue — Day ' + next + '</button>' +
      '<button class="btn quiet block" data-action="go" data-view="course">See all 30 days</button>' +
      '</div>';
  }

  function renderCourseIntro() {
    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack reading book">' +
      '<div class="bc-eyebrow center">Preface</div>' +
      '<h1 class="serif center">' + esc(AX.intro.title) + '</h1>' +
      paras(AX.intro.paragraphs) +
      '<div class="stepbar" style="justify-content:flex-end">' +
        '<button class="btn" data-action="go" data-view="coursehowto">Continue →</button>' +
      '</div>' +
      '</div>';
  }

  function renderCourseHowTo() {
    var cur = attnCurrentDay();
    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack reading book">' +
      '<div class="bc-eyebrow center">How this works</div>' +
      '<h1 class="serif center">' + esc(AX.howTo.title) + '</h1>' +
      paras(AX.howTo.paragraphs) +
      '<h2 class="serif">The Five Movements</h2>' +
      '<p class="muted">Every evening moves through the same five steps. Learn them once and you have a practice for life.</p>' +
      AX.movements.map(function (m) {
        return '<div class="card examen-step">' +
          '<div class="es-kicker">' + m.n + '. ' + esc(m.name) + '</div>' +
          '<p style="margin:6px 0 0">' + esc(m.desc) + '</p></div>';
      }).join('') +
      '<button class="btn block lg" style="margin-top:8px" data-action="open-day" data-day="' + cur + '">' +
        (cur === 1 ? 'Begin — Day 1' : 'Continue — Day ' + cur) + '</button>' +
      '<button class="btn quiet block" data-action="go" data-view="course">See all 30 days</button>' +
      '</div>';
  }

  function renderCourseDay() {
    var total = AX.days.length;
    var n = Math.max(1, Math.min(state.dayNum || 1, total));
    state.dayNum = n;
    if (!dayAccessible(n)) { return renderUnlock(); }   // gate Days 4–30 until unlocked
    var day = AX.days[n - 1];
    var d = attnData();
    var rec = attnDayRec(d, n);
    var pct = Math.round((n / total) * 100);
    var notesVal = rec.notes || '';

    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack reading">' +
      '<div class="progress-rail"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="es-kicker">Day ' + n + ' of ' + total + '</div>' +
      '<h1 class="serif" style="margin-top:2px">' + esc(titleCase(day.title)) + '</h1>' +

      paras(day.reading) +

      '<hr class="divider" />' +
      '<h2 class="serif">The Examen</h2>' +
      day.examenPrompts.map(function (p, i) {
        var split = splitLabel(p);
        var val = (rec.ex && rec.ex[i]) || '';
        return '<div class="q-block">' +
          (split.label ? '<div class="es-kicker">' + esc(split.label) + '</div>' : '') +
          '<div class="q-text" style="font-size:1.05rem;margin:4px 0 10px">' + esc(split.text) + '</div>' +
          (i === 0 ? '<div class="small muted" style="margin:-2px 0 10px">If you’re on your phone to pray this — that’s alright. Take the breaths now; when you’ve written what you need, let the phone down and let the stillness keep going.</div>' : '') +
          '<textarea class="reflect" data-ax="' + i + '" placeholder="Write here… (stays on this device)">' + esc(val) + '</textarea>' +
        '</div>';
      }).join('') +

      (day.practice ?
        '<div class="callout privacy" style="margin-top:8px"><span class="co-ico">🌱</span><div class="co-body">' +
          esc(day.practice) + '</div></div>' : '') +

      '<div class="q-block"><div class="es-kicker">Notes</div>' +
        '<div class="q-text" style="font-size:1.02rem;margin:4px 0 10px">Anything else from today — what you noticed, or want to hold on to.</div>' +
        '<textarea class="reflect" data-axnotes="1" style="min-height:130px" placeholder="Write by hand if you can — or here, if that helps.">' + esc(notesVal) + '</textarea>' +
      '</div>' +

      '<button class="btn block lg" style="margin-top:8px" data-action="reflect-day">Complete today — see your reflection</button>' +

      ((n === ATTN_CONFIG.freeDays && !attnUnlocked()) ?
        '<div class="card unlock-cta" style="margin-top:8px">' +
          '<div class="row between"><strong>That’s the free preview</strong><span class="pill amber">' + esc(ATTN_CONFIG.price) + '</span></div>' +
          '<p class="small muted" style="margin:8px 0 12px">You’ve felt the shape of the practice. The next 27 days are where it does its work. Unlock the whole practice — yours to keep, fully private.</p>' +
          '<button class="btn block" data-action="go" data-view="unlock">Unlock the full practice</button>' +
        '</div>' +
        '<div class="stepbar">' +
          '<button class="btn ghost" data-action="day-step" data-dir="-1">Previous day</button>' +
          '<button class="btn quiet" data-action="go" data-view="course">All 30 days</button>' +
        '</div>'
        :
        '<div class="stepbar">' +
          (n > 1 ? '<button class="btn ghost" data-action="day-step" data-dir="-1">Previous day</button>' : '<span></span>') +
          (n < total ? '<button class="btn ghost" data-action="day-step" data-dir="1">Skip ahead →</button>' : '<span></span>') +
        '</div>' +
        '<button class="btn quiet block" data-action="go" data-view="course">All 30 days</button>') +
      '</div>';

    Array.prototype.forEach.call(app.querySelectorAll('textarea[data-ax]'), function (ta) {
      ta.addEventListener('input', function () {
        var d2 = attnData(); var r2 = attnDayRec(d2, n);
        if (!r2.ex) r2.ex = {};
        r2.ex[ta.getAttribute('data-ax')] = ta.value;
        save(K.attn, d2);
      });
    });
    var notesTa = app.querySelector('textarea[data-axnotes]');
    if (notesTa) notesTa.addEventListener('input', function () {
      var d2 = attnData(); var r2 = attnDayRec(d2, n);
      r2.notes = notesTa.value;
      save(K.attn, d2);
    });
  }

  // Shared attention-theme lexicon (used by the daily reflection AND the week/month reviews).
  var ATTN_THEMES = [
    { key: 'feed', label: 'the feed', rx: /phone|scroll|feed|instagram|insta|tiktok|tik tok|twitter|reddit|facebook|snapchat|\bsnap|youtube|social media|\bsocial\b|the app|my apps/, note: "You watched your attention slip toward the feed. That noticing is itself the loosening — what you can see, you no longer obey blindly." },
    { key: 'news', label: 'the news', rx: /\bnews\b|headline|politic|doomscroll|\bdoom\b/, note: "The pull was toward the news — the endless updating that promises control and delivers unease. Tomorrow, catch the moment the worry reaches for the screen." },
    { key: 'messages', label: 'messages', rx: /email|inbox|\btext\b|texts|message|slack|whatsapp|notification|dm\b/, note: "Messages kept calling you back. Each ping trains a small reflex; you’re beginning to feel the leash — which is how it loosens." },
    { key: 'restless', label: 'restlessness', rx: /bored|boredom|restless|idle|fidget|nothing to do|antsy|\bbore\b/, note: "What pulled at you looks like restlessness — the old monks’ acedia, the noonday demon. The cure isn’t force; it’s staying one more minute in the discomfort instead of reaching." },
    { key: 'anxiety', label: 'anxiety', rx: /anxious|anxiety|worry|worried|stress|overwhelm|afraid|\bfear\b|panic|dread/, note: "Underneath the reaching was anxiety, and the screen offered relief but gave static. Tomorrow, try one slow breath before the reach — let the feeling be felt." },
    { key: 'escape', label: 'the urge to escape', rx: /escape|numb|avoid|distract|procrastinat|zone out|checked out|switch off/, note: "You caught yourself reaching to escape. Attention flees what it can’t yet bear — and grows, quietly, by staying." },
    { key: 'work', label: 'busyness', rx: /\bwork\b|busy|deadline|\btask|productiv|meetings?/, note: "The day’s busyness fragmented you. Not all of it was yours to carry — some attention you simply spent because the work asked, and forgot you could choose." }
  ];

  function listJoin(arr) {
    arr = arr.filter(Boolean);
    if (arr.length <= 1) return arr[0] || '';
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
  }

  /* ---- week / month review (generated ON-DEVICE from the person's own entries) ----
     Gathers a span of days into one reflection: the attention-pulls that recurred,
     the moments of presence they named, the fences they set, and what quietly shifted
     from the first half of the span to the second. The final review is a fuller,
     sectioned write-up of the whole thirty days. Nothing leaves the device. */
  function buildRangeReview(from, to, kind) {
    var dataAll = load(K.attn, {}); var days = dataAll.days || {};
    function rec(i) { return days[i] || { ex: {}, notes: '' }; }
    function mv(i, m) { return ((rec(i).ex || {})[m] || '').trim(); }
    function dayLow(i) { var r = rec(i), ex = r.ex || {}; return [ex[0], ex[1], ex[2], ex[3], ex[4], r.notes].map(function (x) { return x || ''; }).join('  ').toLowerCase(); }
    function clip(s) { s = (s || '').trim(); return s.length > 150 ? s.slice(0, 147).trim() + '…' : s; }
    function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

    var touched = []; for (var i = from; i <= to; i++) if (attnDayTouched(i)) touched.push(i);
    if (!touched.length) {
      return { title: 'A look back', blocks: [{ paras: ['There’s nothing to gather here yet — these days are still empty. Come back once you’ve spent a few evenings with the practice, and this will hold up a mirror to what you’ve noticed.'] }] };
    }

    var themes = ATTN_THEMES.map(function (t) { var c = 0; touched.forEach(function (i) { if (t.rx.test(dayLow(i))) c++; }); return { t: t, c: c }; })
      .filter(function (x) { return x.c > 0; }).sort(function (a, b) { return b.c - a.c; });
    var grat = []; touched.forEach(function (i) { var g = mv(i, 3); if (g) grat.push(g); });
    var res = []; touched.forEach(function (i) { var x = mv(i, 4); if (x) res.push(x); });

    // what shifted, first half vs second half (on the dominant theme)
    function growth() {
      if (!themes.length || themes[0].c < 2) return '';
      var mid = Math.floor((from + to) / 2), rx = themes[0].t.rx, label = themes[0].t.label;
      var fN = 0, fC = 0, sN = 0, sC = 0;
      touched.forEach(function (i) { if (i <= mid) { fN++; if (rx.test(dayLow(i))) fC++; } else { sN++; if (rx.test(dayLow(i))) sC++; } });
      if (!fN || !sN) return '';
      var f = fC / fN, s = sC / sN;
      if (f - s >= 0.25) return 'There is a quiet sign of freedom here: ' + label + ' pulled at you less in the second half than the first. That is the practice doing its slow work — attention, taken back a little at a time.';
      if (s - f >= 0.25) return cap(label) + ' actually grew louder in the second half. That’s worth sitting with — not as failure, but as information. Something in this season is asking for you, and the feed is the symptom, not the cause.';
      return cap(label) + ' held steady across these days — a familiar companion. Naming it, again and again, is how its grip slowly loosens.';
    }

    var blocks = [];
    if (kind === 'final') {
      blocks.push({ paras: [touched.length >= 25
        ? 'You did it — or very nearly: ' + touched.length + ' of thirty evenings spent watching your own attention. That alone sets you apart. Almost no one does the slow thing for a month.'
        : 'Over these thirty days you came back ' + touched.length + ' times. Not every evening — and that was never the point. You kept returning, and returning is the whole of it.'] });
      if (themes.length) {
        var topl = themes.slice(0, 3).map(function (x) { return x.t.label + ' (' + x.c + (x.c === 1 ? ' day' : ' days') + ')'; });
        blocks.push({ heading: 'What kept pulling at you', paras: ['Across the month, your attention was pulled most often by ' + listJoin(topl) + '. Naming a thing that many times isn’t failure — it’s a map. You now know, in your own words, where your attention goes when no one is watching.'] });
      }
      var g = growth(); if (g) blocks.push({ heading: 'What shifted', paras: [g] });
      if (grat.length) blocks.push({ heading: 'Where you were present', paras: ['You also kept catching the good — the moments your attention landed where it belonged:', grat.slice(-3).map(function (x) { return '“' + clip(x) + '”'; }).join('   ·   '), 'Hold onto these. They are what all of it was for.'] });
      if (res.length) blocks.push({ heading: 'What you resolved', paras: ['Night after night you set small fences. Among them:', res.slice(-4).map(function (x) { return '“' + clip(x) + '”'; }).join('   ·   '), 'Keep the one that still has weight. A single fence, kept, is worth more than ten intended.'] });
      blocks.push({ paras: ['The thirty days end, but the five movements don’t. You can pray them for the rest of your life, in a few honest minutes a night. You’ve proven you can stay. Go on staying — present to God, to the people in front of you, and to your own one life, which is happening right now.'] });
      return { title: 'Your thirty days', blocks: blocks };
    }

    // weekly
    blocks.push({ paras: ['You spent ' + touched.length + ' of these seven days with the practice. ' +
      (touched.length >= 5 ? 'That’s a real rhythm.' : (touched.length >= 3 ? 'A good start — the rhythm is forming.' : 'Even a few honest looks change how you see.'))] });
    if (themes.length) {
      var tl = themes.slice(0, 2).map(function (x) { return x.t.label + ' (' + x.c + (x.c === 1 ? ' day' : ' days') + ')'; });
      blocks.push({ paras: ['What pulled at you most this week: ' + listJoin(tl) + '. Watch for it again — what you can see, you no longer obey blindly.'] });
    }
    var gw = growth(); if (gw) blocks.push({ paras: [gw] });
    if (grat.length) blocks.push({ paras: ['And where you were present: “' + clip(grat[grat.length - 1]) + '” Attention given in love is the most human thing you do.'] });
    if (res.length) blocks.push({ paras: ['Carry one fence into next week: “' + clip(res[res.length - 1]) + '”'] });
    blocks.push({ paras: ['Rest. Begin again tomorrow.'] });
    return { title: 'This week, looked back on', blocks: blocks };
  }

  function renderCourseReview() {
    if (!attnUnlocked()) return renderUnlock();
    var r = state.review || { from: 1, to: 30, kind: 'final', label: 'Your 30 days' };
    var data = buildRangeReview(r.from, r.to, r.kind);
    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack">' +
      '<div class="es-kicker">' + esc(r.label) + '</div>' +
      '<h1 class="serif">' + esc(data.title) + '</h1>' +
      '<p class="muted small">Gathered only from your own words, here on this device — a mirror, never a verdict.</p>' +
      '<div class="card reflection">' +
        data.blocks.map(function (b) {
          return (b.heading ? '<h3 class="serif" style="margin:16px 0 6px">' + esc(b.heading) + '</h3>' : '') +
            b.paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
        }).join('') +
      '</div>' +
      '<button class="btn quiet block" data-action="go" data-view="course">All 30 days</button>' +
      '</div>';
  }

  // Assemble everything the person wrote across the 30 days + the full review, as plain text.
  function attnExportText() {
    var d = load(K.attn, {}); var days = d.days || {};
    var L = ['Stillness', 'Review', 'Recognition', 'Reckoning & Gratitude', 'Resolve'];
    var out = [];
    out.push('THE ATTENTION EXAMEN — my thirty days');
    out.push('Saved from Examen AI · https://drseantobin.github.io/examen/');
    out.push('');
    var fr = buildRangeReview(1, 30, 'final');
    out.push('—— ' + fr.title + ' ——'); out.push('');
    fr.blocks.forEach(function (b) {
      if (b.heading) out.push(b.heading.toUpperCase());
      b.paras.forEach(function (p) { out.push(p); });
      out.push('');
    });
    out.push('======================================'); out.push('');
    AX.days.forEach(function (day) {
      var r = days[day.day]; if (!r) return;
      var ex = r.ex || {};
      var any = L.some(function (_, i) { return (ex[i] || '').trim(); }) || (r.notes || '').trim();
      if (!any) return;
      out.push('DAY ' + day.day + ' — ' + day.title);
      L.forEach(function (name, i) { var v = (ex[i] || '').trim(); if (v) out.push(name + ': ' + v); });
      if ((r.notes || '').trim()) out.push('Notes: ' + r.notes.trim());
      out.push('');
    });
    return out.join('\n');
  }
  function downloadEngagement() {
    try {
      var blob = new Blob([attnExportText()], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'attention-examen-my-thirty-days.txt';
      document.body.appendChild(a); a.click();
      setTimeout(function () { try { URL.revokeObjectURL(url); a.remove(); } catch (e) {} }, 1000);
      toast('Saved to your device ⬇️');
    } catch (e) { toast('Couldn’t download here'); }
  }

  function renderCourseRestart() {
    if (!attnUnlocked()) return renderUnlock();
    app.innerHTML =
      backbar('The Attention Examen') +
      '<div class="stack">' +
      '<h1 class="serif">Begin again</h1>' +
      '<p class="lede">You’ve walked the thirty days. The practice is meant to be returned to — you can start a fresh round whenever you’re ready.</p>' +
      '<div class="callout privacy"><span class="co-ico">⬇️</span><div class="co-body"><strong>Keep what you wrote first.</strong> Beginning again clears your daily entries from this device. Download your thirty days — every day, and the full review — so they’re always yours.</div></div>' +
      '<button class="btn block" data-action="download-engagement">Download my thirty days</button>' +
      '<button class="btn danger block" data-action="confirm-restart">Begin a new thirty days</button>' +
      '<button class="btn quiet block" data-action="go" data-view="course">Not now</button>' +
      '</div>';
  }

  /* ---- end-of-day reflection (generated ON-DEVICE from the user's own entries) ----
     This is NOT an LLM call and nothing leaves the device. It reads what the person
     wrote in the day's five movements + notes, detects attention themes, reflects
     their own words back, tracks recurring patterns across days, and offers gentle,
     formation-grounded encouragement. A mirror, not a verdict. */
  function buildDayReflection(n) {
    var data = load(K.attn, {});
    var rec = (data.days && data.days[n]) || { ex: {}, notes: '' };
    var ex = rec.ex || {};
    var get = function (i) { return (ex[i] || '').trim(); };
    var movementNames = ['Stillness', 'Review', 'Recognition', 'Reckoning & Gratitude', 'Resolve'];
    var resolve = get(4), gratitude = get(3);
    var all = [get(0), get(1), get(2), get(3), get(4), (rec.notes || '')].join('  \n  ');
    var low = all.toLowerCase();
    var answered = [0, 1, 2, 3, 4].filter(function (i) { return get(i); });
    var blanks = [0, 1, 2, 3, 4].filter(function (i) { return !get(i); });
    var wordCount = (all.match(/\S+/g) || []).length;

    var hits = ATTN_THEMES.filter(function (t) { return t.rx.test(low); });
    var paras = [];

    var prevTouched = n > 1 ? attnDayTouched(n - 1) : true;
    if (n === 1) paras.push("You took the first honest look — and the first is the hardest. You didn’t try to fix anything; you just watched. That is exactly right.");
    else if (!prevTouched) paras.push("You came back. In a practice built on returning, that matters more than any unbroken streak. A saint is not someone who never wandered, but someone who returned one more time than they left.");
    else paras.push("Day " + n + " done. You’re staying with it — and staying is the whole of it.");

    if (hits.length) {
      paras.push(hits[0].note);
      if (hits[1]) paras.push("There was also " + hits[1].label + " in what you wrote. Two pulls in one day isn’t failure — it’s a clearer map of where your attention actually lives.");
    } else if (answered.length) {
      paras.push("You looked honestly at where your attention went today. You don’t need a dramatic finding — the watching itself is changing you.");
    }

    if (gratitude) {
      var snip = gratitude.length > 150 ? gratitude.slice(0, 147).trim() + "…" : gratitude;
      paras.push("And you named where grace broke through: “" + snip + "” Hold onto that. Attention given in love is the most human thing you do — and the one thing the feed can never give back.");
    } else if (/grateful|gratitude|thank|present|presence|prayer|pray|silence|silent|family|wife|husband|\bson\b|daughter|kids|friend|nature|walk|\bmass\b|rosary|\bgod\b|jesus/.test(low)) {
      paras.push("There’s gratitude and presence threaded through what you wrote. Notice that those moments cost you nothing but your attention — the very thing being fought over all day.");
    } else {
      paras.push("If you can, tomorrow name one moment you were truly present — a face you actually saw. The examen isn’t only about what stole you; it’s about catching the good, too.");
    }

    if (hits.length) {
      var rx = hits[0].rx, label = hits[0].label, count = 0;
      for (var i = 1; i <= n; i++) {
        var r = data.days && data.days[i]; if (!r) continue;
        var txt = [(r.ex && r.ex[0]) || '', (r.ex && r.ex[1]) || '', (r.ex && r.ex[2]) || '', (r.ex && r.ex[3]) || '', (r.ex && r.ex[4]) || '', r.notes || ''].join(' ').toLowerCase();
        if (rx.test(txt)) count++;
      }
      if (count >= 2) {
        var ord = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][count] || (count + 'th');
        paras.push("This is the " + ord + " day " + label + " has surfaced. The recurrence is the gift: your attention has a habit, and you’re learning its exact shape. Named habits loosen; unnamed ones run the show.");
      }
    }

    if (answered.length === 0) {
      paras = ["You opened today but didn’t write yet — and that’s allowed; some days you just sit with it. When you’re ready, even one honest line will surprise you. The simplest place to start is the last movement: a single small fence for tomorrow."];
    } else if (blanks.length >= 2) {
      var missing = blanks.map(function (i) { return movementNames[i]; }).slice(0, 2).join(" and ");
      paras.push("You moved through " + answered.length + " of the five movements. No pressure to fill them all — but a sentence in " + missing + " is often where the surprise hides.");
    } else if (blanks.length === 0 && wordCount > 40) {
      paras.push("You gave all five movements honest attention today. That depth — Stillness through Resolve — is where the change actually lives.");
    }

    return { paras: paras, custody: resolve || null, hasResolve: !!resolve };
  }

  function renderCourseReflection() {
    var total = AX.days.length;
    var n = Math.max(1, Math.min(state.dayNum || 1, total));
    var day = AX.days[n - 1];
    var r = buildDayReflection(n);
    app.innerHTML =
      backbar('Day ' + n) +
      '<div class="stack">' +
      '<div class="es-kicker">Day ' + n + ' · ' + esc(titleCase(day.title)) + '</div>' +
      '<h1 class="serif">A reflection on today</h1>' +
      '<p class="muted small">Drawn only from what you wrote, here on this device — a mirror held up, never a verdict.</p>' +
      '<div class="card reflection">' +
        r.paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '</div>' +
      (r.hasResolve ?
        '<div class="callout"><span class="co-ico">🕯️</span><div class="co-body"><strong>Your custody for tomorrow, in your words:</strong><br>“' + esc(r.custody) + '”<br><span class="small muted">Keep just this one. Small fences make large freedoms.</span></div></div>'
        :
        '<div class="callout privacy"><span class="co-ico">🕯️</span><div class="co-body">Before you close: choose one small, concrete fence for tomorrow — “no phone before prayer,” say. One is enough.</div></div>') +
      '<div class="stepbar">' +
        '<button class="btn ghost" data-action="open-day" data-day="' + n + '">Back to today</button>' +
        (n < total ? '<button class="btn" data-action="open-day" data-day="' + (n + 1) + '">Continue — Day ' + (n + 1) + '</button>'
                   : '<button class="btn" data-action="go" data-view="course">Finish the 30 days</button>') +
      '</div>' +
      '<button class="btn quiet block" data-action="go" data-view="course">All 30 days</button>' +
      '</div>';
  }

  function splitLabel(s) {
    var m = /^([^:]{1,40}):\s*(.*)$/.exec(s || '');
    if (m) return { label: m[1].trim(), text: m[2].trim() };
    return { label: '', text: s };
  }
  function titleCase(s) {
    if (!s) return '';
    return s.replace(/\S+/g, function (w) {
      if (w.length <= 3 && /^(the|of|a|an|and|to|in|on|for)$/i.test(w)) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).replace(/^./, function (c) { return c.toUpperCase(); });
  }

  /* ------------------------------------------------------------- SETTINGS */
  function renderSettings() {
    var theme = rawGet(K.theme) || 'auto';
    app.innerHTML =
      backbar('Home') +
      '<div class="stack">' +
      '<h1 class="serif">Settings</h1>' +

      '<div class="card"><h3>Who this is for</h3>' +
        '<p class="muted small">Shapes the language and questions.</p>' +
        '<div class="age-grid">' +
          AGES.map(function (a) {
            return '<button class="age-card" data-action="set-age" data-age="' + a.id + '" data-stay="1" aria-pressed="' + (state.age === a.id) + '">' +
              '<div class="ac-emoji">' + a.emoji + '</div><div class="ac-name">' + esc(a.name) + '</div>' +
              '<div class="ac-age">' + esc(a.age) + '</div></button>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="card"><h3>Appearance</h3>' +
        '<div class="row wrap">' +
          ['auto', 'light', 'dark'].map(function (t) {
            return '<button class="btn ' + (theme === t ? '' : 'ghost') + ' small" data-action="set-theme" data-theme="' + t + '">' +
              t.charAt(0).toUpperCase() + t.slice(1) + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="card"><h3>Your privacy</h3>' +
        '<p class="small muted">Everything you write in Examen AI lives only in this browser, on this device. Nothing is ever uploaded. If you clear your browser data — or tap below — it is gone for good.</p>' +
        '<p class="small muted">The one exception is the optional <strong>mic / “talk it out”</strong> button: voice typing uses your device’s speech recognition. On most browsers that sends the audio to the device maker (Apple/Google) to transcribe — like the keyboard’s mic key. The resulting text stays here. Typing is always fully private.</p>' +
        '<button class="btn danger block" data-action="erase-all">Erase everything from this device</button>' +
      '</div>' +

      '<div class="card"><h3>About</h3>' +
        '<p class="small muted">Examen AI is a private companion for examining your conscience, preparing for the Sacrament of Reconciliation, and praying a nightly examen. It prepares you — it is not the sacrament, and it is no substitute for a priest or spiritual director. When in doubt, or if anything here troubles your peace, speak with a good confessor. God’s mercy is always greater than our sin.</p>' +
      '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------- TAB BAR */
  var TABS = [
    { route: 'home', view: 'home', label: 'Home', icon: 'home' },
    { route: 'exam', view: 'lens', label: 'Examine', icon: 'check' },
    { route: 'list', view: 'list', label: 'My List', icon: 'list' },
    { route: 'examen', view: 'examen', label: 'Examen', icon: 'moon' },
    { route: 'course', view: 'course', label: 'Attention', icon: 'book' },
    { route: 'settings', view: 'settings', label: 'Settings', icon: 'gear' }
  ];
  function renderTabs() {
    var bar = document.getElementById('tabbar');
    if (!bar) return;
    if (!state.age || state.view === 'onboard') { bar.hidden = true; return; }
    bar.hidden = false;
    var active = {
      home: 'home', lens: 'exam', sectionlist: 'exam', section: 'exam',
      list: 'list', examen: 'examen', examenhistory: 'examen', guide: 'home', settings: 'settings',
      course: 'course', courseintro: 'course', coursehowto: 'course', courseday: 'course', coursereflect: 'course', coursereview: 'course', courserestart: 'course', unlock: 'course', unlocked: 'course'
    }[state.view] || 'home';
    bar.innerHTML = TABS.filter(function (t) { return t.view !== 'course' || AX; }).map(function (t) {
      return '<button class="tab" data-action="tab" data-view="' + t.view + '"' +
        (t.route === active ? ' aria-current="page"' : '') + '>' +
        '<span class="tab-ico">' + ico(t.icon) + '</span><span>' + t.label + '</span></button>';
    }).join('');
  }

  /* --------------------------------------------------------------- RENDER */
  function render() {
    stopDictation();
    if (!state.age) { state.view = 'onboard'; renderOnboard(); renderTabs(); return; }
    switch (state.view) {
      case 'home': renderHome(); break;
      case 'lens': renderLens(); break;
      case 'sectionlist': renderSectionList(); break;
      case 'section': renderSection(); break;
      case 'list': renderList(); break;
      case 'guide': renderGuide(); break;
      case 'examen': renderExamen(); break;
      case 'examenhistory': renderExamenHistory(); break;
      case 'course': AX ? renderCourse() : renderHome(); break;
      case 'courseintro': renderCourseIntro(); break;
      case 'coursehowto': renderCourseHowTo(); break;
      case 'courseday': renderCourseDay(); break;
      case 'coursereflect': renderCourseReflection(); break;
      case 'coursereview': renderCourseReview(); break;
      case 'courserestart': renderCourseRestart(); break;
      case 'unlock': renderUnlock(); break;
      case 'unlocked': renderUnlocked(); break;
      case 'settings': renderSettings(); break;
      default: renderHome();
    }
    renderTabs();
    enhanceTextareas();
  }

  /* ----------------------------------------------------- VOICE ("talk it out")
     A tiny mic on each writing box. Uses the browser/device SpeechRecognition to
     turn speech into text. IMPORTANT: on most browsers the AUDIO is sent to the
     device maker (Apple/Google) to be transcribed — like the keyboard's mic key.
     The resulting TEXT stays on-device like everything else. Shown only where
     supported; first use asks for an explicit, honest OK. Typing stays fully private. */
  var SR = (typeof window !== 'undefined') && (window.SpeechRecognition || window.webkitSpeechRecognition);
  var recog = null, recogTA = null, recogBtn = null;
  function stopDictation() {
    if (recogBtn) { try { recogBtn.classList.remove('listening'); } catch (e) {} }
    if (recog) { try { recog.onend = null; recog.onresult = null; recog.stop(); } catch (e) {} }
    recog = null; recogTA = null; recogBtn = null;
  }
  function startDictation(ta, btn) {
    stopDictation();
    try {
      recog = new SR();
      recog.lang = 'en-US'; recog.continuous = true; recog.interimResults = true;
      recogTA = ta; recogBtn = btn; btn.classList.add('listening');
      recog.onresult = function (e) {
        var add = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) add += e.results[i][0].transcript;
        }
        add = add.trim();
        if (add) {
          var sep = ta.value && !/\s$/.test(ta.value) ? ' ' : '';
          ta.value = ta.value + sep + add;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };
      recog.onerror = function () { stopDictation(); };
      recog.onend = function () { stopDictation(); };
      recog.start();
    } catch (e) { stopDictation(); }
  }
  function enhanceTextareas() {
    if (!SR || !app) return;
    var tas = app.querySelectorAll('textarea.reflect');
    Array.prototype.forEach.call(tas, function (ta) {
      if (ta.id === 'unlockCode' || ta.getAttribute('data-mic')) return;
      ta.setAttribute('data-mic', '1');
      var wrap = document.createElement('span');
      wrap.className = 'ta-wrap';
      ta.parentNode.insertBefore(wrap, ta);
      wrap.appendChild(ta);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'mic-btn';
      btn.setAttribute('data-action', 'mic');
      btn.setAttribute('aria-label', 'Talk it out (voice typing)');
      btn.setAttribute('title', 'Talk it out');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>';
      wrap.appendChild(btn);
    });
  }

  /* --------------------------------------------------------------- TOAST */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ------------------------------------------------------- EVENT DELEGATION */
  function onClick(e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var action = t.getAttribute('data-action');

    if (action === 'back') return back();
    if (action === 'mic') {
      var wrap = t.closest('.ta-wrap');
      var ta = wrap && wrap.querySelector('textarea');
      if (!ta) return;
      if (recogTA === ta) { stopDictation(); return; }   // tap again to stop
      if (!rawGet(K.voiceAck)) {
        var ok = confirm(
          'Talk it out — a note on privacy.\n\n' +
          'Voice typing uses your device’s built-in speech recognition to turn what you say into text. ' +
          'On most phones and browsers that means the audio is sent to the device maker (such as Apple or Google) ' +
          'to be transcribed — the same as the mic key on your keyboard. The words it writes stay here on your ' +
          'device, like everything else. You can always just type instead, which is completely private.\n\n' +
          'Use voice typing?'
        );
        if (!ok) return;
        rawSet(K.voiceAck, '1');
      }
      startDictation(ta, t);
      return;
    }
    if (action === 'tab') { var v = t.getAttribute('data-view'); state.stack = []; return go(v, { noPush: true }); }
    if (action === 'go') return go(t.getAttribute('data-view'));

    if (action === 'set-age') {
      var age = t.getAttribute('data-age');
      state.age = age; rawSet(K.age, age);
      if (t.getAttribute('data-stay')) { toast('Saved'); render(); }
      else { rawSet(K.seenIntro, '1'); state.stack = []; go('home', { noPush: true }); }
      return;
    }
    if (action === 'open-lens') {
      state.lens = t.getAttribute('data-lens');
      state.sectionIndex = 0;
      return go('sectionlist');
    }
    if (action === 'open-section') {
      return go('section', { sectionIndex: parseInt(t.getAttribute('data-index'), 10) || 0 });
    }
    if (action === 'step') {
      var dir = parseInt(t.getAttribute('data-dir'), 10);
      state.sectionIndex += dir;
      return go('section', { noPush: true, sectionIndex: state.sectionIndex });
    }
    if (action === 'toggle-check') {
      var secs = lensSections();
      var s = secs[state.sectionIndex];
      var ci = t.getAttribute('data-ci');
      var d = eocData();
      var rec = sectionRecord(d, s.id);
      if (!rec.checked) rec.checked = {};
      rec.checked[ci] = !rec.checked[ci];
      save(K.eoc, d);
      t.setAttribute('aria-pressed', String(!!rec.checked[ci]));
      return;
    }
    if (action === 'set-contrition') {
      var key = t.getAttribute('data-key');
      var box = document.getElementById('acText');
      if (box && CONTRITION[key]) box.textContent = CONTRITION[key].text;
      return;
    }
    if (action === 'mark-confession') {
      var nice = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      rawSet(K.lastConf, nice);
      toast('Noted: ' + nice);
      return;
    }
    if (action === 'print') { window.print(); return; }
    if (action === 'clear-list') {
      if (confirm('Clear your whole confession list from this device? Your sins are forgiven — this just wipes your notes. This cannot be undone.')) {
        try { localStorage.removeItem(K.eoc); } catch (e) {}
        toast('Cleared — go in peace 🕊️');
        return go('home', { noPush: true });
      }
      return;
    }
    if (action === 'set-theme') {
      var th = t.getAttribute('data-theme');
      if (th === 'auto') { try { localStorage.removeItem(K.theme); } catch (e) {} document.documentElement.removeAttribute('data-theme'); }
      else { rawSet(K.theme, th); document.documentElement.setAttribute('data-theme', th); }
      render();
      return;
    }
    if (action === 'erase-all') {
      if (confirm('Erase everything Examen AI has stored on this device — your examinations, lists, and examens? This cannot be undone.')) {
        Object.keys(K).forEach(function (k) { try { localStorage.removeItem(K[k]); } catch (e) {} });
        state.age = null; state.stack = [];
        document.documentElement.removeAttribute('data-theme');
        toast('Erased');
        return render();
      }
      return;
    }
    if (action === 'examen-history') return go('examenhistory');
    if (action === 'reflect-day') { return go('coursereflect'); }
    if (action === 'download-engagement') { downloadEngagement(); return; }
    if (action === 'confirm-restart') {
      if (confirm('Begin a new thirty days?\n\nThis clears your current daily entries from this device so you can start fresh. Your unlock stays — you won’t pay again. If you want to keep what you wrote, download it first.')) {
        var dd = load(K.attn, {}); dd.days = {}; save(K.attn, dd);  // keep unlock (separate key) + introSeen
        toast('A fresh thirty days — begin when ready 🕯️');
        state.stack = [];
        return go('course', { noPush: true });
      }
      return;
    }
    if (action === 'open-review') {
      state.review = {
        from: parseInt(t.getAttribute('data-from'), 10),
        to: parseInt(t.getAttribute('data-to'), 10),
        kind: t.getAttribute('data-kind'),
        label: t.getAttribute('data-label')
      };
      return go('coursereview');
    }
    if (action === 'begin-course-reading') { setAttnIntroSeen(); return go('courseintro'); }
    if (action === 'skip-course-intro') { setAttnIntroSeen(); return go('course', { noPush: true }); }
    if (action === 'open-day') {
      setAttnIntroSeen();
      state.dayNum = parseInt(t.getAttribute('data-day'), 10) || 1;
      return go('courseday');
    }
    if (action === 'day-step') {
      var dd = parseInt(t.getAttribute('data-dir'), 10);
      state.dayNum = (state.dayNum || 1) + dd;
      return go('courseday', { noPush: true });
    }
    if (action === 'buy') {
      if (ATTN_CONFIG.storeUrl && typeof window.open === 'function') window.open(ATTN_CONFIG.storeUrl, '_blank', 'noopener');
      return;
    }
    if (action === 'try-unlock') {
      var input = document.getElementById('unlockCode');
      var msg = document.getElementById('unlockMsg');
      var code = input ? (input.value || '').trim() : '';
      if (!code) { setUnlockMsg(msg, 'Enter your unlock code first.', true); return; }
      if (ATTN_CONFIG.gumroadProductId) verifyGumroad(code, msg);   // real license-key check
      else finishUnlock(validateOfflineCode(code), msg);            // offline fallback until live
      return;
    }
  }

  function setUnlockMsg(msg, text, isError) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = isError ? 'var(--red-ink)' : 'var(--ink-faint)';
  }
  function finishUnlock(ok, msg) {
    if (ok) {
      rawSet(ATTN_UNLOCK_KEY, '1');
      state.stack = [];
      return go('unlocked', { noPush: true });
    }
    setUnlockMsg(msg, 'That code didn’t work. Check the receipt email and try again.', true);
  }
  // Verify a Gumroad license key. Public endpoint, no secret needed; the only
  // network call the app ever makes, and only at unlock time. Reflections never leave.
  function verifyGumroad(key, msg) {
    setUnlockMsg(msg, 'Checking your code…', false);
    if (typeof fetch !== 'function') { setUnlockMsg(msg, 'Can’t verify here — please try again online.', true); return; }
    var pid = encodeURIComponent(ATTN_CONFIG.gumroadProductId);
    fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // send both identifier forms (same value) so verification works regardless of which
      // parameter Gumroad keys on; increment_uses_count=false so re-checks don't burn uses.
      body: 'product_id=' + pid + '&product_permalink=' + pid +
            '&license_key=' + encodeURIComponent(key) +
            '&increment_uses_count=false'
    }).then(function (r) { return r.json(); })
      .then(function (d) { finishUnlock(!!(d && d.success), msg); })
      .catch(function () { setUnlockMsg(msg, 'Couldn’t reach the store — check your connection and try again.', true); });
  }

  /* ----------------------------------------------------------------- INIT */
  function init() {
    app = document.getElementById('app');
    document.addEventListener('click', onClick);
    state.view = state.age ? 'home' : 'onboard';
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
