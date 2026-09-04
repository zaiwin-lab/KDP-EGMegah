/* Four-language support for the public surfaces. House names stay as proper
   nouns in every language. Anything without a translation falls back to
   English rather than showing a key.

   NOTE: BM, ZH and Iban copy should be reviewed by a native speaker before
   this goes to production. The fourth language is Iban (jaku Iban), the
   language most widely spoken alongside Malay in Bau and the rest of
   Sarawak, so it carries the Malaysian flag like Bahasa Malaysia does. */

export const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', short: 'EN' },
  { code: 'bm', flag: '🇲🇾', name: 'Bahasa Malaysia', short: 'BM' },
  { code: 'zh', flag: '🇨🇳', name: '中文', short: 'ZH' },
  { code: 'iba', flag: '🇲🇾', name: 'Jaku Iban', short: 'IBA' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

type Dict = Record<string, string>;

const en: Dict = {
  'credit.line':
    'This Digital Experience is Part of the {brand} Innovation Ecosystem',
  'help.pill': 'Ask anything · 24/7',
  'wa.pill': 'WhatsApp 011-2846 5813',
  'homes.note':
    'Floor areas and prices are as published by EG Megah Holdings and are indicative. Final figures depend on land conditions, finishes and specification at the time of construction.',
  'tech.eyebrow': 'Teknologi EG Megah',
  'tech.title': 'The difference is inside the wall.',
  'tech.lead':
    'Every standard model is built with lightweight aircrete poured on site into high-precision modular formwork. That gives a single monolithic wall full of micro air pockets, which is what produces the numbers below.',
  'tech.certs': 'Certified by',
  'tech.steps': 'How you come to own one',
  'nav.homes': 'The homes',
  'nav.partnership': 'Partnership',
  'nav.signin': 'Sign in',

  'hero.badge': 'Made for members of KPSM Bau Berhad',
  'hero.title': 'Your land already holds a vision.',
  'hero.lead':
    'A guided home-building journey for KPSM members, from land verification and home selection to construction updates and key handover. Your cooperative built this with EGMH and KOBIS so that you never have to chase anyone for an answer about your own house.',
  'hero.cta': 'Enter the member portal',
  'hero.cta2': 'Who is behind this',
  'hero.egmh': 'Designs and builds',
  'hero.kobis': 'Runs the platform',
  'hero.kpsm': 'Governs the payments',

  'homes.title': 'Four paths. One delivery standard.',
  'homes.lead':
    "EGMH's own catalogue, configured for the member profiles, lot conditions and financing reality in Bau. Prices are indicative. The real figure is fixed only after EGMH visits your land and issues a written quotation, so nothing here commits you to anything.",
  'homes.builtup': 'Built-up',
  'homes.bedrooms': 'Bedrooms',
  'homes.bathrooms': 'Bathrooms',
  'homes.from': 'from',
  'homes.priced': 'Priced after the site visit',
  'homes.youdecide': 'You decide',

  'members.eyebrow': 'Members of KPSM Bau',
  'members.title': 'This is not open to the public. It was built for you.',
  'members.p1':
    'Your cooperative negotiated this on your behalf. Everything here, from the price of the house to the way the money is released, exists because you are a KPSM Bau member and not a walk-in customer.',
  'members.p2':
    'Your neighbours are building through the same programme, on the same terms, with the same people answering the phone.',
  'members.b1t': 'Member pricing',
  'members.b1b': 'A cooperative rate negotiated for the whole programme, not quoted to you alone at the gate.',
  'members.b2t': 'Your money stays governed',
  'members.b2b': 'KPSM holds and releases the staged payments. EGMH is paid for work that has been checked, not in advance.',
  'members.b3t': 'A named person, not a hotline',
  'members.b3b': 'One coordinator who knows your project, reachable by phone, from the first form to your keys.',
  'members.b4t': 'Asked once, never again',
  'members.b4b': 'Your membership, identity and land details are captured once and reused across every form.',

  'partners.title': 'Three organisations, each doing what it is accountable for.',
  'partners.lead':
    'A house is built by one party, financed through another and lived in by a third. This platform is the shared record all three work from, so you never have to take a step on trust alone, or repeat yourself to anyone.',
  'partners.cta': 'Read the full introduction',

  'journey.title': 'Six stages, and you always know which one you are in.',
  'journey.lead':
    'Building a house involves a cooperative, a builder and a lot of paperwork. The portal keeps all of it in one place, in plain language, and tells you when something is genuinely needed from you.',

  'pay.title': 'Money moves in four releases, and never without a person signing for it.',
  'pay.p1':
    'KPSM manages the staged payments to EGMH on your behalf. Each release follows the same visible route, and you can see exactly where it has reached.',
  'pay.p2':
    'The platform can read your documents and draft your updates. It cannot approve a payment, certify construction work, or make a decision about your contract. Those stay with named people at KPSM, KOBIS and EGMH, and each one leaves an audit record.',
  'pay.r1t': 'Mobilisation and contract commencement',
  'pay.r1b': 'The contract is signed and EGMH moves onto your land.',
  'pay.r2t': 'Foundation and structural milestone',
  'pay.r2b': 'The foundation and main structure are complete and checked.',
  'pay.r3t': 'Roofing, enclosure, services and finishes',
  'pay.r3b': 'The roof is on, the house is closed up, wiring and water are in.',
  'pay.r4t': 'Completion, inspection, rectification and handover',
  'pay.r4b': 'After the joint inspection, any repairs, and your keys.',

  'aud.title': 'Everyone works from your record. You are the one it belongs to.',
  'aud.a1t': 'You, the member',
  'aud.a1b': 'One place that answers where your house is, what is done, what is next, and whether anything is needed from you.',
  'aud.a2t': 'KPSM Bau',
  'aud.a2b': 'Membership standing, a governed payment facility, and an audit record behind every authorisation.',
  'aud.a3t': 'KOBIS Berhad',
  'aud.a3b': 'Coordination, records and service monitoring, without chasing four parties for the same information.',
  'aud.a4t': 'EGMH',
  'aud.a4b': 'Qualified demand, productised delivery, and progress reported once instead of repeated on the phone.',
  'aud.note': 'Not a KPSM member yet? Speak to your cooperative office first.',

  'footer.disclaimer':
    'A demonstration platform for the KPSM Bau member home-building programme. The members, land titles, prices and payment records shown are illustrative and do not describe a real project.',
  'footer.operated': 'Operated by',
  'footer.about': 'About the partnership',

  'help.title': 'AI Help · 24/7',
  'help.sub': 'Answers in plain language, any time',
  'help.intro': 'Common questions, answered plainly. For anything about your own project, your coordinator is the fastest route.',
  'help.close': 'Close',
  'help.talk': 'Talk to a person instead',

  'wa.title': 'WhatsApp',
  'wa.sub': 'Ready to help',
};

const bm: Dict = {
  'credit.line':
    'Pengalaman Digital Ini Sebahagian daripada Ekosistem Inovasi {brand}',
  'help.pill': 'Tanya apa sahaja · 24/7',
  'wa.pill': 'WhatsApp 011-2846 5813',
  'homes.note':
    'Keluasan lantai dan harga adalah seperti yang diterbitkan oleh EG Megah Holdings dan merupakan anggaran. Angka muktamad bergantung kepada keadaan tanah, kemasan dan spesifikasi pada masa pembinaan.',
  'tech.eyebrow': 'Teknologi EG Megah',
  'tech.title': 'Perbezaannya ada di dalam dinding.',
  'tech.lead':
    'Setiap model standard dibina menggunakan konkrit ringan aircrete yang dituang terus di tapak ke dalam acuan modular berketepatan tinggi. Ia menghasilkan dinding monolit dengan jutaan rongga mikro udara — punca kepada angka di bawah.',
  'tech.certs': 'Disahkan oleh',
  'tech.steps': 'Cara anda memilikinya',
  'nav.homes': 'Rumah kami',
  'nav.partnership': 'Perkongsian',
  'nav.signin': 'Log masuk',

  'hero.badge': 'Dibina untuk ahli KPSM Bau Berhad',
  'hero.title': 'Tanah anda sudah menyimpan satu impian.',
  'hero.lead':
    'Perjalanan pembinaan rumah berpandu untuk ahli KPSM, daripada pengesahan tanah dan pemilihan rumah sehingga kemas kini pembinaan dan penyerahan kunci. Koperasi anda membina ini bersama EGMH dan KOBIS supaya anda tidak perlu mengejar sesiapa untuk mendapatkan jawapan tentang rumah anda sendiri.',
  'hero.cta': 'Masuk portal ahli',
  'hero.cta2': 'Siapa di sebalik ini',
  'hero.egmh': 'Mereka bentuk dan membina',
  'hero.kobis': 'Mengendalikan platform',
  'hero.kpsm': 'Mentadbir pembayaran',

  'homes.title': 'Empat pilihan. Satu piawaian penyerahan.',
  'homes.lead':
    'Katalog EGMH sendiri, disesuaikan dengan profil ahli, keadaan lot dan realiti pembiayaan di Bau. Harga adalah anggaran. Angka sebenar hanya ditetapkan selepas EGMH melawat tanah anda dan mengeluarkan sebut harga bertulis, jadi tiada apa-apa di sini yang mengikat anda.',
  'homes.builtup': 'Keluasan binaan',
  'homes.bedrooms': 'Bilik tidur',
  'homes.bathrooms': 'Bilik air',
  'homes.from': 'dari',
  'homes.priced': 'Harga selepas lawatan tapak',
  'homes.youdecide': 'Anda tentukan',

  'members.eyebrow': 'Ahli KPSM Bau',
  'members.title': 'Ini bukan untuk orang awam. Ia dibina untuk anda.',
  'members.p1':
    'Koperasi anda telah merundingkannya bagi pihak anda. Segala-galanya di sini, daripada harga rumah sehingga cara wang dilepaskan, wujud kerana anda seorang ahli KPSM Bau dan bukan pelanggan biasa.',
  'members.p2':
    'Jiran anda turut membina melalui program yang sama, dengan terma yang sama, dan orang yang sama menjawab panggilan.',
  'members.b1t': 'Harga khas ahli',
  'members.b1b': 'Kadar koperasi yang dirundingkan untuk keseluruhan program, bukan sebut harga yang diberi kepada anda seorang.',
  'members.b2t': 'Wang anda kekal ditadbir',
  'members.b2b': 'KPSM memegang dan melepaskan bayaran berperingkat. EGMH dibayar untuk kerja yang telah disemak, bukan lebih awal.',
  'members.b3t': 'Seorang yang bernama, bukan talian panggilan',
  'members.b3b': 'Seorang penyelaras yang mengenali projek anda, boleh dihubungi melalui telefon, dari borang pertama sehingga kunci anda.',
  'members.b4t': 'Ditanya sekali, tidak berulang',
  'members.b4b': 'Maklumat keahlian, identiti dan tanah anda diambil sekali dan digunakan semula dalam setiap borang.',

  'partners.title': 'Tiga organisasi, setiap satu melaksanakan tanggungjawabnya.',
  'partners.lead':
    'Sebuah rumah dibina oleh satu pihak, dibiayai melalui pihak lain dan didiami oleh pihak ketiga. Platform ini ialah rekod bersama yang digunakan ketiga-tiganya, supaya anda tidak perlu melangkah atas kepercayaan semata-mata, atau mengulang cerita kepada sesiapa.',
  'partners.cta': 'Baca pengenalan penuh',

  'journey.title': 'Enam peringkat, dan anda sentiasa tahu di mana anda berada.',
  'journey.lead':
    'Membina rumah melibatkan koperasi, kontraktor dan banyak kertas kerja. Portal ini menyimpan semuanya di satu tempat, dalam bahasa yang mudah, dan memberitahu anda apabila sesuatu benar-benar diperlukan daripada anda.',

  'pay.title': 'Wang bergerak dalam empat pelepasan, dan tidak pernah tanpa tandatangan seseorang.',
  'pay.p1':
    'KPSM menguruskan bayaran berperingkat kepada EGMH bagi pihak anda. Setiap pelepasan mengikut laluan yang sama dan boleh dilihat, dan anda tahu dengan tepat di mana ia sampai.',
  'pay.p2':
    'Platform ini boleh membaca dokumen anda dan merangka kemas kini anda. Ia tidak boleh meluluskan bayaran, mengesahkan kerja pembinaan, atau membuat keputusan mengenai kontrak anda. Semua itu kekal di tangan individu bernama di KPSM, KOBIS dan EGMH, dan setiap satu meninggalkan rekod audit.',
  'pay.r1t': 'Mobilisasi dan permulaan kontrak',
  'pay.r1b': 'Kontrak ditandatangani dan EGMH masuk ke tanah anda.',
  'pay.r2t': 'Asas dan pencapaian struktur',
  'pay.r2b': 'Asas dan struktur utama siap dan telah disemak.',
  'pay.r3t': 'Bumbung, penutupan, perkhidmatan dan kemasan',
  'pay.r3b': 'Bumbung sudah dipasang, rumah ditutup, pendawaian dan air sudah ada.',
  'pay.r4t': 'Penyiapan, pemeriksaan, pembaikan dan penyerahan',
  'pay.r4b': 'Selepas pemeriksaan bersama, sebarang pembaikan, dan kunci anda.',

  'aud.title': 'Semua orang bekerja daripada rekod anda. Andalah pemiliknya.',
  'aud.a1t': 'Anda, sang ahli',
  'aud.a1b': 'Satu tempat yang menjawab di mana rumah anda, apa yang siap, apa yang seterusnya, dan sama ada ada apa-apa diperlukan daripada anda.',
  'aud.a2t': 'KPSM Bau',
  'aud.a2b': 'Taraf keahlian, kemudahan bayaran yang ditadbir, dan rekod audit di sebalik setiap kebenaran.',
  'aud.a3t': 'KOBIS Berhad',
  'aud.a3b': 'Penyelarasan, rekod dan pemantauan perkhidmatan, tanpa perlu mengejar empat pihak untuk maklumat yang sama.',
  'aud.a4t': 'EGMH',
  'aud.a4b': 'Permintaan yang layak, penyerahan berpakej, dan kemajuan dilaporkan sekali dan bukan diulang melalui telefon.',
  'aud.note': 'Belum menjadi ahli KPSM? Hubungi pejabat koperasi anda dahulu.',

  'footer.disclaimer':
    'Platform demonstrasi untuk program pembinaan rumah ahli KPSM Bau. Ahli, hak milik tanah, harga dan rekod pembayaran yang dipaparkan adalah ilustrasi dan tidak menggambarkan projek sebenar.',
  'footer.operated': 'Dikendalikan oleh',
  'footer.about': 'Mengenai perkongsian',

  'help.title': 'Bantuan AI · 24/7',
  'help.sub': 'Jawapan dalam bahasa mudah, bila-bila masa',
  'help.intro': 'Soalan lazim, dijawab dengan mudah. Untuk apa-apa mengenai projek anda sendiri, penyelaras anda adalah jalan terpantas.',
  'help.close': 'Tutup',
  'help.talk': 'Bercakap dengan seseorang',

  'wa.title': 'WhatsApp',
  'wa.sub': 'Sedia membantu',
};

const zh: Dict = {
  'credit.line': '此数字体验是 {brand} 创新生态系统的一部分',
  'help.pill': '随时提问 · 全天候',
  'wa.pill': 'WhatsApp 011-2846 5813',
  'homes.note': '建筑面积与价格均依 EG Megah Holdings 公布为准，仅供参考。最终数字取决于土地状况、装修与施工时的规格。',
  'tech.eyebrow': 'EG Megah 技术',
  'tech.title': '差别，就在墙体之内。',
  'tech.lead':
    '每一款标准房型都采用现场浇筑的轻质 aircrete 混凝土，配合高精度模块化模板成型。由此形成布满微气孔的整体式墙体，这正是下列数据的来源。',
  'tech.certs': '认证机构',
  'tech.steps': '如何拥有一间',
  'nav.homes': '房型',
  'nav.partnership': '合作伙伴',
  'nav.signin': '登录',

  'hero.badge': '专为 KPSM Bau Berhad 社员打造',
  'hero.title': '您的土地，早已承载着一个愿景。',
  'hero.lead':
    '为 KPSM 社员提供的建屋全程指引，从土地核验、房型选择，到施工进度更新与交钥匙。您的合作社与 EGMH 及 KOBIS 共同建立这个平台，让您无需再四处追问自己房子的进展。',
  'hero.cta': '进入社员平台',
  'hero.cta2': '了解我们是谁',
  'hero.egmh': '设计与施工',
  'hero.kobis': '平台营运',
  'hero.kpsm': '付款监管',

  'homes.title': '四种选择，同一交付标准。',
  'homes.lead':
    'EGMH 自有房型目录，依照 Bau 地区社员情况、地段条件与融资实况配置。价格仅供参考，实际金额须待 EGMH 实地勘察并出具书面报价后确定，因此此处内容不构成任何约束。',
  'homes.builtup': '建筑面积',
  'homes.bedrooms': '卧室',
  'homes.bathrooms': '浴室',
  'homes.from': '起价',
  'homes.priced': '实地勘察后定价',
  'homes.youdecide': '由您决定',

  'members.eyebrow': 'KPSM Bau 社员',
  'members.title': '这不对外开放。它是为您而建的。',
  'members.p1':
    '您的合作社代表您完成了谈判。这里的一切，从房价到放款方式，都是因为您是 KPSM Bau 的社员，而不是上门客户。',
  'members.p2': '您的邻居也在同一个计划下建屋，条件相同，接电话的也是同一批人。',
  'members.b1t': '社员专属价格',
  'members.b1b': '为整个计划谈定的合作社价格，而非单独向您开出的报价。',
  'members.b2t': '您的钱始终受监管',
  'members.b2b': 'KPSM 保管并分阶段放款。EGMH 只就已查验的工程收款，不预先支付。',
  'members.b3t': '一位有名有姓的专人，而非客服热线',
  'members.b3b': '一位了解您项目的协调员，可直接致电，从第一份表格到交付钥匙。',
  'members.b4t': '只问一次，不再重复',
  'members.b4b': '您的社员资格、身份与土地资料只需填写一次，之后每份表格自动沿用。',

  'partners.title': '三个机构，各司其职，各负其责。',
  'partners.lead':
    '房子由一方兴建、经另一方融资、由第三方居住。这个平台是三方共用的同一份记录，让您无需仅凭信任迈出每一步，也无需向任何人重复说明。',
  'partners.cta': '阅读完整介绍',

  'journey.title': '六个阶段，您随时知道自己走到哪里。',
  'journey.lead':
    '建一间房子牵涉合作社、承建商和大量文件。这个平台把一切集中在一处，用平实的语言呈现，并在真正需要您处理时才通知您。',

  'pay.title': '款项分四次拨付，且必有专人签署。',
  'pay.p1': 'KPSM 代表您管理支付给 EGMH 的分期款项。每一次拨付都走同一条可见流程，您能清楚看到进行到哪一步。',
  'pay.p2':
    '平台可以读取您的文件并草拟进度说明，但它不能批准付款、验收工程，或就您的合约做出决定。这些始终由 KPSM、KOBIS 与 EGMH 的具名人员负责，且每一项都会留下审计记录。',
  'pay.r1t': '动员与合约生效',
  'pay.r1b': '合约签署，EGMH 进场施工。',
  'pay.r2t': '地基与主体结构节点',
  'pay.r2b': '地基与主体结构完成并通过查验。',
  'pay.r3t': '屋顶、封闭、水电与装修',
  'pay.r3b': '屋顶完成，房屋封闭，水电到位。',
  'pay.r4t': '竣工、验收、修补与交付',
  'pay.r4b': '在联合验收、修补完成之后，交付您的钥匙。',

  'aud.title': '所有人都依据您的记录办事。这份记录属于您。',
  'aud.a1t': '您，社员本人',
  'aud.a1b': '一个地方就能回答：房子进展如何、已完成什么、下一步是什么、是否需要您处理什么。',
  'aud.a2t': 'KPSM Bau',
  'aud.a2b': '社员资格、受监管的付款安排，以及每次授权背后的审计记录。',
  'aud.a3t': 'KOBIS Berhad',
  'aud.a3b': '协调、记录与服务监督，无需为同一份资料追问四方。',
  'aud.a4t': 'EGMH',
  'aud.a4b': '合格的需求、产品化的交付，进度只需汇报一次，不必在电话里反复重复。',
  'aud.note': '还不是 KPSM 社员？请先联系您的合作社办事处。',

  'footer.disclaimer':
    '本平台为 KPSM Bau 社员建屋计划的示范版本。所显示的社员、地契、价格与付款记录均为示意，并不代表真实项目。',
  'footer.operated': '营运方',
  'footer.about': '关于合作伙伴',

  'help.title': 'AI 协助 · 全天候',
  'help.sub': '随时以平实语言解答',
  'help.intro': '常见问题，简单作答。若涉及您自己的项目，联系协调员是最快的途径。',
  'help.close': '关闭',
  'help.talk': '改为联系真人',

  'wa.title': 'WhatsApp',
  'wa.sub': '随时为您服务',
};

const iba: Dict = {
  'credit.line': 'Pengalaman Digital Tu Sebagi ari Ekosistem Inovasi {brand}',
  'help.pill': 'Tanya sebarang utai · 24/7',
  'wa.pill': 'WhatsApp 011-2846 5813',
  'homes.note':
    'Luas rumah enggau rega nya ke udah dipansutka EG Megah Holdings, lalu semina nunjukka kira-kira. Angka ti amat begantung ba pekara tanah, penyudi enggau spesifikasi ba maya rumah digaga.',
  'tech.eyebrow': 'Teknologi EG Megah',
  'tech.title': 'Penyerakup iya bisi dalam dinding.',
  'tech.lead':
    'Genap model standard digaga ngena aircrete ti lempung, dituang ba tanah nuan empu dalam acuan modular ti amat tepat. Nya ngasuh dinding nya nyadi siti ngerembai ti penuh enggau lubang angin ti mit, lalu nya meh ngasuh angka ba baruh tu pegai.',
  'tech.certs': 'Disahka ulih',
  'tech.steps': 'Baka ni nuan bempu siti',
  'nav.homes': 'Rumah kami',
  'nav.partnership': 'Pekaban',
  'nav.signin': 'Tama',

  'hero.badge': 'Digaga ke ahli KPSM Bau Berhad',
  'hero.title': 'Tanah nuan udah bisi mimpi ba dalam.',
  'hero.lead':
    'Pejalai ngaga rumah ti dipandu ke ahli KPSM, berengkah ari pengesahan tanah enggau milih rumah, nyentuk ngagai berita pengawa ngaga enggau nyerahka kunci. Koperasi nuan ngaga tu enggau EGMH lalu KOBIS, ngambika nuan nadai kala patut nguber orang minta saut pasal rumah nuan empu.',
  'hero.cta': 'Tama ngagai portal ahli',
  'hero.cta2': 'Sapa ba belakang tu',
  'hero.egmh': 'Nyipta lalu ngaga',
  'hero.kobis': 'Ngintu platform',
  'hero.kpsm': 'Ngatur bayaran',

  'homes.title': 'Empat jalai. Siti standard penyerah.',
  'homes.lead':
    'Katalog EGMH empu, ti diatur nitihka pekara ahli, gaya lot enggau chara pinjam duit di Bau. Rega nya semina kira-kira. Angka ti amat semina ditetapka udah EGMH datai ninjau tanah nuan lalu meri sebut rega ba surat, nya alai nadai utai ditu ti ngikat nuan.',
  'homes.builtup': 'Luas rumah',
  'homes.bedrooms': 'Bilik tinduk',
  'homes.bathrooms': 'Bilik mandi',
  'homes.from': 'ari',
  'homes.priced': 'Rega ditetapka udah ninjau tanah',
  'homes.youdecide': 'Nuan ke mutuska',

  'members.eyebrow': 'Ahli KPSM Bau',
  'members.title': 'Tu ukai dibuka ngagai orang mayuh. Tu digaga ke nuan.',
  'members.p1':
    'Koperasi nuan berandau pasal tu ke penguntung nuan. Semua utai ditu, berengkah ari rega rumah nyentuk ngagai chara duit dilepaska, bisi laban nuan tu ahli KPSM Bau, ukai pembeli ti semina tama ari pintu.',
  'members.p2':
    'Bala jerani nuan mega ngaga rumah nengah program ti sama, ngena sarat ti sama, enggau orang ti sama nyaut talipun.',
  'members.b1t': 'Rega ahli',
  'members.b1b': 'Rega koperasi ti dirandau ke satu program, ukai disebut ngagai nuan siku-siku ba pintu.',
  'members.b2t': 'Duit nuan tetap dijaga',
  'members.b2b': 'KPSM megai lalu nglepaska bayaran tikas-tikas. EGMH dibayar ke pengawa ti udah dipeda, ukai dulu ari nya.',
  'members.b3t': 'Siku orang ti bisi nama, ukai talipun am',
  'members.b3b': 'Siku penyelaras ti nemu projek nuan, ulih ditalipun, ari borang ti keterubah nyentuk ngagai kunci nuan.',
  'members.b4t': 'Ditanya sekali, nadai agi diulang',
  'members.b4b': 'Pekara keahlian, diri empu enggau tanah nuan diambi sekali aja lalu dikena baru ba genap borang.',

  'partners.title': 'Tiga buah pekunsi, genap iku ngintu pengawa iya empu.',
  'partners.lead':
    'Rumah digaga siku, dibayar nengah siku bukai, lalu diau siku ti ketiga. Platform tu nyadi rekod ti dikunsi sida ke tiga, ngambika nuan nadai patut bejalai ngena pengarap aja, tauka ngulang jaku ngagai orang.',
  'partners.cta': 'Bacha penerang ti penuh',

  'journey.title': 'Nam tikas, lalu nuan seruran nemu ba ni nuan diatu.',
  'journey.lead':
    'Ngaga rumah nyakup koperasi, tukang ngaga enggau mayuh surat. Portal tu nyimpan semua nya ba siti endur, ngena jaku ti mudah, lalu madah ngagai nuan lebuh bisi utai ti amat diguna ari nuan.',

  'pay.title': 'Duit bejalai dalam empat pelepas, lalu nadai kala nadai orang ti nandatangan.',
  'pay.p1':
    'KPSM ngintu bayaran tikas-tikas ngagai EGMH ke penguntung nuan. Genap pelepas nitihka jalai ti sama sereta ulih dipeda, lalu nuan ulih meda ba ni iya udah datai.',
  'pay.p2':
    'Platform tu ulih macha surat nuan lalu ngaga draf berita nuan. Iya enda ulih nerima bayaran, nyahka pengawa ngaga, tauka mutuska pekara kontrak nuan. Nya semua tetap ba orang ti bisi nama ba KPSM, KOBIS enggau EGMH, lalu genap siti ninggalka rekod audit.',
  'pay.r1t': 'Berengkah kereja enggau kontrak bekuasa',
  'pay.r1b': 'Kontrak udah ditandatangan lalu EGMH tama ngagai tanah nuan.',
  'pay.r2t': 'Pemesai enggau tikas struktur',
  'pay.r2b': 'Pemesai enggau struktur besai udah tembu lalu udah dipeda.',
  'pay.r3t': 'Atap, dinding, servis enggau penyudi',
  'pay.r3b': 'Atap udah tepasang, rumah udah tertutup, wayar enggau ai udah tama.',
  'pay.r4t': 'Penembu, pemeda, pembetul enggau nyerahka kunci',
  'pay.r4b': 'Udah pemeda sama-sama, sebarang pembetul, lalu kunci nuan.',

  'aud.title': 'Semua orang bekereja ari rekod nuan. Nuan ke bempu iya.',
  'aud.a1t': 'Nuan, ahli nya',
  'aud.a1b': 'Siti endur ti nyaut ba ni rumah nuan, nama ti udah tembu, nama ti datai ila, enggau kati bisi utai diguna ari nuan.',
  'aud.a2t': 'KPSM Bau',
  'aud.a2b': 'Pekara keahlian, kemudahan bayaran ti diintu, enggau rekod audit ba belakang genap kuasa ti diberi.',
  'aud.a3t': 'KOBIS Berhad',
  'aud.a3b': 'Penyelaras, rekod enggau pemeda servis, nadai patut nguber empat pihak minta berita ti sama.',
  'aud.a4t': 'EGMH',
  'aud.a4b': 'Peminta ti ngena, penyerah ti berpakej, enggau pemansang ti dipadah sekali, ukai diulang ba talipun.',
  'aud.note': 'Apin nyadi ahli KPSM? Bejaku enggau opis koperasi nuan dulu.',

  'footer.disclaimer':
    'Platform demonstrasi ke program ngaga rumah ahli KPSM Bau. Ahli, surat tanah, rega enggau rekod bayaran ti dipandangka ditu semina chunto lalu ukai nunjukka projek ti amat.',
  'footer.operated': 'Diintu ulih',
  'footer.about': 'Pasal pekaban tu',

  'help.title': 'Tulung AI · 24/7',
  'help.sub': 'Saut ngena jaku ti mudah, sebilang maya',
  'help.intro': 'Tanya ti suah ditanya, disaut ngena jaku ti mudah. Ke sebarang utai pasal projek nuan empu, penyelaras nuan meh jalai ti pantas.',
  'help.close': 'Tutup',
  'help.talk': 'Bejaku enggau orang',

  'wa.title': 'WhatsApp',
  'wa.sub': 'Sedia nulung',
};

export const DICTIONARIES: Record<Lang, Dict> = { en, bm, zh, iba };
