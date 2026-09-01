/* Four-language support for the public surfaces. House names stay as proper
   nouns in every language. Anything without a translation falls back to
   English rather than showing a key.

   NOTE: BM, ZH and TA copy should be reviewed by a native speaker before
   this goes to production. */

export const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', short: 'EN' },
  { code: 'bm', flag: '🇲🇾', name: 'Bahasa Malaysia', short: 'BM' },
  { code: 'zh', flag: '🇨🇳', name: '中文', short: 'ZH' },
  { code: 'ta', flag: '🇮🇳', name: 'தமிழ்', short: 'TA' },
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

const ta: Dict = {
  'credit.line':
    'இந்த டிஜிட்டல் அனுபவம் {brand} கண்டுபிடிப்பு சூழலின் ஒரு பகுதி',
  'help.pill': 'எதுவும் கேளுங்கள் · 24/7',
  'wa.pill': 'WhatsApp 011-2846 5813',
  'homes.note':
    'தளப் பரப்பும் விலைகளும் EG Megah Holdings வெளியிட்டபடி; இவை தோராயமானவை. இறுதி எண்கள் நிலத்தின் நிலை, பூச்சு மற்றும் கட்டுமான நேரத்து விவரக்குறிப்பைப் பொறுத்தது.',
  'tech.eyebrow': 'EG Megah தொழில்நுட்பம்',
  'tech.title': 'வித்தியாசம் சுவருக்குள் இருக்கிறது.',
  'tech.lead':
    'ஒவ்வொரு நிலையான மாதிரியும் இடத்திலேயே ஊற்றப்படும் இலகுரக aircrete கான்கிரீட்டால், உயர் துல்லிய மட்டு வார்ப்புருவில் கட்டப்படுகிறது. இது நுண் காற்றுத் துளைகள் நிறைந்த ஒற்றைச் சுவரை உருவாக்குகிறது — கீழுள்ள எண்களுக்கு இதுவே காரணம்.',
  'tech.certs': 'சான்றளித்தவர்கள்',
  'tech.steps': 'இதை எப்படிச் சொந்தமாக்குவது',
  'nav.homes': 'வீடுகள்',
  'nav.partnership': 'கூட்டாண்மை',
  'nav.signin': 'உள்நுழைக',

  'hero.badge': 'KPSM Bau Berhad உறுப்பினர்களுக்காக உருவாக்கப்பட்டது',
  'hero.title': 'உங்கள் நிலம் ஏற்கெனவே ஒரு கனவைச் சுமக்கிறது.',
  'hero.lead':
    'KPSM உறுப்பினர்களுக்கான வழிகாட்டப்பட்ட வீடு கட்டும் பயணம் — நில சரிபார்ப்பு, வீடு தேர்வு முதல் கட்டுமான முன்னேற்றம் மற்றும் சாவி ஒப்படைப்பு வரை. உங்கள் வீட்டைப் பற்றிய பதிலுக்காக நீங்கள் யாரையும் துரத்த வேண்டியதில்லை என்பதற்காக, உங்கள் கூட்டுறவு சங்கம் EGMH மற்றும் KOBIS உடன் இணைந்து இதை உருவாக்கியது.',
  'hero.cta': 'உறுப்பினர் தளத்தில் நுழைக',
  'hero.cta2': 'இதன் பின்னால் யார்',
  'hero.egmh': 'வடிவமைத்து கட்டுகிறது',
  'hero.kobis': 'தளத்தை இயக்குகிறது',
  'hero.kpsm': 'கட்டணங்களை நிர்வகிக்கிறது',

  'homes.title': 'நான்கு வழிகள். ஒரே தரம்.',
  'homes.lead':
    'EGMH-இன் சொந்த வீட்டுத் தொகுப்பு, Bau பகுதி உறுப்பினர்கள், நிலப் பரப்பு மற்றும் நிதி நிலைமைக்கு ஏற்ப அமைக்கப்பட்டது. விலைகள் தோராயமானவை. EGMH உங்கள் நிலத்தைப் பார்வையிட்டு எழுத்துப்பூர்வ மதிப்பீடு வழங்கிய பின்னரே உண்மையான தொகை நிர்ணயிக்கப்படும்; எனவே இங்குள்ள எதுவும் உங்களைக் கட்டுப்படுத்தாது.',
  'homes.builtup': 'கட்டிட பரப்பு',
  'homes.bedrooms': 'படுக்கையறைகள்',
  'homes.bathrooms': 'குளியலறைகள்',
  'homes.from': 'இருந்து',
  'homes.priced': 'இட ஆய்வுக்குப் பின் விலை',
  'homes.youdecide': 'நீங்கள் முடிவு செய்யுங்கள்',

  'members.eyebrow': 'KPSM Bau உறுப்பினர்கள்',
  'members.title': 'இது பொதுமக்களுக்கானது அல்ல. இது உங்களுக்காகவே கட்டப்பட்டது.',
  'members.p1':
    'உங்கள் கூட்டுறவு சங்கம் உங்கள் சார்பாக இதைப் பேசி முடித்தது. வீட்டின் விலை முதல் பணம் விடுவிக்கப்படும் முறை வரை இங்குள்ள அனைத்தும், நீங்கள் ஒரு KPSM Bau உறுப்பினர் என்பதாலேயே உள்ளன — வெளியில் இருந்து வரும் வாடிக்கையாளர் அல்ல.',
  'members.p2':
    'உங்கள் அண்டை வீட்டாரும் இதே திட்டத்தின் கீழ், இதே நிபந்தனைகளில், தொலைபேசியில் பதிலளிக்கும் இதே நபர்களுடன் வீடு கட்டுகிறார்கள்.',
  'members.b1t': 'உறுப்பினர் விலை',
  'members.b1b': 'முழு திட்டத்திற்கும் பேசி முடிக்கப்பட்ட கூட்டுறவு விலை — உங்களுக்கு மட்டும் தனியாகச் சொல்லப்பட்ட விலை அல்ல.',
  'members.b2t': 'உங்கள் பணம் கண்காணிப்பில் இருக்கும்',
  'members.b2b': 'KPSM நிலைவாரியான கட்டணங்களை வைத்திருந்து விடுவிக்கிறது. சரிபார்க்கப்பட்ட வேலைக்கு மட்டுமே EGMH-க்குப் பணம் வழங்கப்படும், முன்கூட்டியே அல்ல.',
  'members.b3t': 'பெயர் தெரிந்த ஒருவர், அழைப்பு மையம் அல்ல',
  'members.b3b': 'உங்கள் திட்டத்தை அறிந்த ஒரு ஒருங்கிணைப்பாளர், முதல் படிவம் முதல் சாவி வரை தொலைபேசியில் கிடைப்பார்.',
  'members.b4t': 'ஒரு முறை கேட்டால் போதும்',
  'members.b4b': 'உங்கள் உறுப்பினர், அடையாள மற்றும் நில விவரங்கள் ஒரு முறை பெறப்பட்டு ஒவ்வொரு படிவத்திலும் மீண்டும் பயன்படுத்தப்படும்.',

  'partners.title': 'மூன்று நிறுவனங்கள், ஒவ்வொன்றும் தன் பொறுப்பை நிறைவேற்றுகிறது.',
  'partners.lead':
    'ஒரு வீட்டை ஒருவர் கட்டுகிறார், இன்னொருவர் மூலம் நிதி வருகிறது, மூன்றாமவர் அதில் வாழ்கிறார். இந்தத் தளம் மூவரும் பயன்படுத்தும் ஒரே பதிவு; எனவே நீங்கள் நம்பிக்கையை மட்டும் நம்பி எந்த அடியும் எடுக்க வேண்டியதில்லை, யாரிடமும் மீண்டும் விளக்க வேண்டியதில்லை.',
  'partners.cta': 'முழு அறிமுகத்தைப் படிக்க',

  'journey.title': 'ஆறு நிலைகள் — நீங்கள் எங்கே இருக்கிறீர்கள் என்பது எப்போதும் தெரியும்.',
  'journey.lead':
    'ஒரு வீடு கட்டுவதில் கூட்டுறவு சங்கம், கட்டுநர் மற்றும் ஏராளமான ஆவணங்கள் சம்பந்தப்படுகின்றன. இந்தத் தளம் அனைத்தையும் ஒரே இடத்தில், எளிய மொழியில் வைத்திருக்கிறது; உங்களிடமிருந்து உண்மையிலேயே ஏதேனும் தேவைப்படும்போது மட்டும் தெரிவிக்கிறது.',

  'pay.title': 'பணம் நான்கு தவணைகளில் நகரும் — ஒருவர் கையொப்பமிடாமல் ஒருபோதும் இல்லை.',
  'pay.p1':
    'உங்கள் சார்பாக EGMH-க்கான நிலைவாரியான கட்டணங்களை KPSM நிர்வகிக்கிறது. ஒவ்வொரு தவணையும் ஒரே தெளிவான வழியைப் பின்பற்றுகிறது; அது எங்கே சென்றுள்ளது என்பதை நீங்கள் துல்லியமாகப் பார்க்கலாம்.',
  'pay.p2':
    'இந்தத் தளம் உங்கள் ஆவணங்களைப் படித்து முன்னேற்றக் குறிப்புகளை வரையலாம். ஆனால் அது கட்டணத்தை அங்கீகரிக்கவோ, கட்டுமான வேலையைச் சான்றளிக்கவோ, உங்கள் ஒப்பந்தம் குறித்து முடிவெடுக்கவோ முடியாது. அவை KPSM, KOBIS மற்றும் EGMH-இல் பெயர் குறிப்பிடப்பட்ட நபர்களிடமே இருக்கும்; ஒவ்வொன்றும் தணிக்கைப் பதிவை விட்டுச் செல்லும்.',
  'pay.r1t': 'பணி தொடக்கம் மற்றும் ஒப்பந்தம்',
  'pay.r1b': 'ஒப்பந்தம் கையெழுத்தாகி EGMH உங்கள் நிலத்தில் பணியைத் தொடங்குகிறது.',
  'pay.r2t': 'அடித்தளம் மற்றும் கட்டமைப்பு நிலை',
  'pay.r2b': 'அடித்தளமும் முக்கியக் கட்டமைப்பும் முடிந்து சரிபார்க்கப்பட்டன.',
  'pay.r3t': 'கூரை, மூடல், சேவைகள் மற்றும் பூச்சு',
  'pay.r3b': 'கூரை அமைந்து, வீடு மூடப்பட்டு, மின்சாரமும் நீரும் பொருத்தப்பட்டன.',
  'pay.r4t': 'நிறைவு, ஆய்வு, திருத்தம் மற்றும் ஒப்படைப்பு',
  'pay.r4b': 'கூட்டு ஆய்வு, தேவையான திருத்தங்கள், பின்னர் உங்கள் சாவி.',

  'aud.title': 'அனைவரும் உங்கள் பதிவிலிருந்தே செயல்படுகிறார்கள். அது உங்களுடையது.',
  'aud.a1t': 'நீங்கள், உறுப்பினர்',
  'aud.a1b': 'உங்கள் வீடு எங்கே, என்ன முடிந்தது, அடுத்தது என்ன, உங்களிடமிருந்து ஏதேனும் தேவையா — அனைத்திற்கும் ஒரே இடத்தில் பதில்.',
  'aud.a2t': 'KPSM Bau',
  'aud.a2b': 'உறுப்பினர் நிலை, நிர்வகிக்கப்பட்ட கட்டண வசதி, ஒவ்வொரு அங்கீகாரத்தின் பின்னும் தணிக்கைப் பதிவு.',
  'aud.a3t': 'KOBIS Berhad',
  'aud.a3b': 'ஒருங்கிணைப்பு, பதிவுகள் மற்றும் சேவைக் கண்காணிப்பு — ஒரே தகவலுக்காக நான்கு தரப்பினரைத் துரத்தாமல்.',
  'aud.a4t': 'EGMH',
  'aud.a4b': 'தகுதியான தேவை, தொகுப்பாக்கப்பட்ட வழங்கல், முன்னேற்றம் ஒரு முறை பதிவாகும் — தொலைபேசியில் மீண்டும் சொல்ல வேண்டியதில்லை.',
  'aud.note': 'இன்னும் KPSM உறுப்பினர் அல்லவா? முதலில் உங்கள் கூட்டுறவு அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள்.',

  'footer.disclaimer':
    'KPSM Bau உறுப்பினர் வீடு கட்டும் திட்டத்திற்கான ஒரு விளக்கத் தளம். இங்கு காட்டப்படும் உறுப்பினர்கள், நிலப் பத்திரங்கள், விலைகள் மற்றும் கட்டணப் பதிவுகள் எடுத்துக்காட்டுகள் மட்டுமே; உண்மையான திட்டத்தை விவரிக்கவில்லை.',
  'footer.operated': 'இயக்குபவர்கள்',
  'footer.about': 'கூட்டாண்மை பற்றி',

  'help.title': 'AI உதவி · 24/7',
  'help.sub': 'எந்நேரமும் எளிய மொழியில் பதில்',
  'help.intro': 'பொதுவான கேள்விகள், எளிய பதில்கள். உங்கள் சொந்தத் திட்டம் குறித்த எதற்கும் உங்கள் ஒருங்கிணைப்பாளரே விரைவான வழி.',
  'help.close': 'மூடு',
  'help.talk': 'ஒரு நபருடன் பேச',

  'wa.title': 'WhatsApp',
  'wa.sub': 'உதவ தயார்',
};

export const DICTIONARIES: Record<Lang, Dict> = { en, bm, zh, ta };
