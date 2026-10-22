import { Router } from './router.js';
import { dialog, toast } from './dialog.js';
import { registerServiceWorker } from './pwa.js';

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const IPADataFallback = {
    vowels: [
        { symbol: 'iː', description: 'صوت طويل، الفم مفتوح قليلاً، اللسان مرتفع للأمام', examples: ['see', 'bee', 'tree'] },
        { symbol: 'ɪ', description: 'صوت قصير، اللسان مرتفع قليلاً للأمام', examples: ['sit', 'big', 'fish'] },
        { symbol: 'e', description: 'صوت متوسط، الفم مفتوح بشكل معتدل', examples: ['bed', 'red', 'pen'] },
        { symbol: 'æ', description: 'صوت قصير، الفم مفتوح للأسفل', examples: ['cat', 'hat', 'man'] },
        { symbol: 'ɑː', description: 'صوت طويل، الفم مفتوح بالكامل', examples: ['car', 'father', 'star'] },
        { symbol: 'ɒ', description: 'صوت قصير، الشفاه مستديرة', examples: ['hot', 'dog', 'lot'] },
        { symbol: 'ɔː', description: 'صوت طويل، الشفاه مستديرة', examples: ['saw', 'law', 'thought'] },
        { symbol: 'ʊ', description: 'صوت قصير، الشفاه مستديرة قليلاً', examples: ['book', 'look', 'put'] },
        { symbol: 'uː', description: 'صوت طويل، الشفاه مستديرة بالكامل', examples: ['food', 'moon', 'blue'] },
        { symbol: 'ʌ', description: 'صوت قصير، اللسان في المنتصف', examples: ['cup', 'sun', 'bus'] },
        { symbol: 'ɜː', description: 'صوت طويل، الشفاه محايدة', examples: ['bird', 'her', 'turn'] },
        { symbol: 'ə', description: 'أقصر صوت في الإنجليزية (schwa)', examples: ['about', 'banana', 'sofa'] },
    ],
    consonants: [
        { symbol: 'p', description: 'صوت انفجاري، الشفتان تنغلقان ثم تنفتحان', examples: ['pen', 'paper', 'cup'] },
        { symbol: 'b', description: 'صوت انفجاري مجهور', examples: ['book', 'baby', 'web'] },
        { symbol: 't', description: 'صوت انفجاري، اللسان يلامس الأسنان', examples: ['tea', 'table', 'cat'] },
        { symbol: 'd', description: 'صوت انفجاري مجهور', examples: ['dog', 'door', 'red'] },
        { symbol: 'k', description: 'صوت انفجاري، الجزء الخلفي من اللسان', examples: ['cat', 'kite', 'back'] },
        { symbol: 'g', description: 'صوت انفجاري مجهور', examples: ['go', 'big', 'girl'] },
        { symbol: 'f', description: 'صوت احتكاكي، الأسنان على الشفة', examples: ['fish', 'phone', 'leaf'] },
        { symbol: 'v', description: 'صوت احتكاكي مجهور', examples: ['voice', 'very', 'love'] },
        { symbol: 'θ', description: 'صوت بين الأسنان', examples: ['think', 'three', 'mouth'] },
        { symbol: 'ð', description: 'صوت بين الأسنان مجهور', examples: ['this', 'mother', 'breathe'] },
        { symbol: 's', description: 'صوت صفير', examples: ['see', 'sun', 'bus'] },
        { symbol: 'z', description: 'صوت صفير مجهور', examples: ['zoo', 'zero', 'is'] },
        { symbol: 'ʃ', description: 'صوت ش', examples: ['she', 'fish', 'ship'] },
        { symbol: 'ʒ', description: 'صوت مجهور شبيه بالش', examples: ['vision', 'measure', 'beige'] },
        { symbol: 'h', description: 'صوت هوائي', examples: ['hat', 'house', 'hello'] },
        { symbol: 'm', description: 'صوت أنفي، الشفتان تنغلقان', examples: ['man', 'mother', 'room'] },
        { symbol: 'n', description: 'صوت أنفي، اللسان يلامس الأسنان', examples: ['no', 'name', 'sun'] },
        { symbol: 'ŋ', description: 'صوت أنفي، الجزء الخلفي للسان', examples: ['sing', 'ring', 'long'] },
        { symbol: 'l', description: 'صوت جانبي', examples: ['love', 'light', 'ball'] },
        { symbol: 'r', description: 'صوت لثوي', examples: ['red', 'run', 'car'] },
        { symbol: 'j', description: 'صوت شبه صامت (y)', examples: ['yes', 'you', 'yellow'] },
        { symbol: 'w', description: 'صوت شبه صامت، الشفتان مستديرتان', examples: ['we', 'water', 'want'] },
        { symbol: 'tʃ', description: 'صوت مركب (تش)', examples: ['church', 'chair', 'watch'] },
        { symbol: 'dʒ', description: 'صوت مركب (ج)', examples: ['judge', 'job', 'age'] },
    ],
    diphthongs: [
        { symbol: 'eɪ', description: 'صوت مزدوج يبدأ e وينتهي ɪ', examples: ['say', 'day', 'make'] },
        { symbol: 'aɪ', description: 'صوت مزدوج يبدأ a وينتهي ɪ', examples: ['my', 'eye', 'time'] },
        { symbol: 'ɔɪ', description: 'صوت مزدوج يبدأ ɔ وينتهي ɪ', examples: ['boy', 'toy', 'joy'] },
        { symbol: 'əʊ', description: 'صوت مزدوج يبدأ ə وينتهي ʊ', examples: ['go', 'no', 'home'] },
        { symbol: 'aʊ', description: 'صوت مزدوج يبدأ a وينتهي ʊ', examples: ['now', 'how', 'cow'] },
        { symbol: 'ɪə', description: 'صوت مزدوج يبدأ ɪ وينتهي ə', examples: ['here', 'near', 'fear'] },
        { symbol: 'eə', description: 'صوت مزدوج يبدأ e وينتهي ə', examples: ['hair', 'care', 'air'] },
        { symbol: 'ʊə', description: 'صوت مزدوج يبدأ ʊ وينتهي ə', examples: ['pure', 'cure', 'tour'] },
    ],
    homophones: [
        { word: 'sea', homophones: ['see'] },
        { word: 'to', homophones: ['two', 'too'] },
        { word: 'there', homophones: ['their', "they're"] },
        { word: 'be', homophones: ['bee'] },
        { word: 'flower', homophones: ['flour'] },
        { word: 'knight', homophones: ['night'] },
        { word: 'right', homophones: ['write', 'rite'] },
        { word: 'pair', homophones: ['pear', 'pare'] },
    ],
};

const WordsFallback = [
    { word: 'think', ipa: '/θɪŋk/' }, { word: 'this', ipa: '/ðɪs/' },
    { word: 'cat', ipa: '/kæt/' }, { word: 'dog', ipa: '/dɒɡ/' },
    { word: 'fish', ipa: '/fɪʃ/' }, { word: 'house', ipa: '/haʊs/' },
    { word: 'beautiful', ipa: '/ˈbjuːtɪfəl/' }, { word: 'phone', ipa: '/fəʊn/' },
    { word: 'mother', ipa: '/ˈmʌðə/' }, { word: 'father', ipa: '/ˈfɑːðə/' },
    { word: 'school', ipa: '/skuːl/' }, { word: 'water', ipa: '/ˈwɔːtə/' },
    { word: 'sun', ipa: '/sʌn/' }, { word: 'moon', ipa: '/muːn/' },
    { word: 'boy', ipa: '/bɔɪ/' }, { word: 'say', ipa: '/seɪ/' },
    { word: 'my', ipa: '/maɪ/' }, { word: 'go', ipa: '/ɡəʊ/' },
    { word: 'now', ipa: '/naʊ/' }, { word: 'here', ipa: '/hɪə/' },
    { word: 'hair', ipa: '/heə/' }, { word: 'pure', ipa: '/pjʊə/' },
    { word: 'bird', ipa: '/bɜːd/' }, { word: 'car', ipa: '/kɑː/' },
    { word: 'book', ipa: '/bʊk/' }, { word: 'tree', ipa: '/triː/' },
];

const LocalIPADict = {
    'think': '/θɪŋk/', 'this': '/ðɪs/', 'cat': '/kæt/', 'dog': '/dɒɡ/',
    'fish': '/fɪʃ/', 'house': '/haʊs/', 'beautiful': '/ˈbjuːtɪfəl/',
    'phone': '/fəʊn/', 'mother': '/ˈmʌðə/', 'father': '/ˈfɑːðə/',
    'school': '/skuːl/', 'hello': '/həˈləʊ/', 'world': '/wɜːld/',
    'water': '/ˈwɔːtə/', 'sun': '/sʌn/', 'moon': '/muːn/',
    'boy': '/bɔɪ/', 'toy': '/tɔɪ/', 'say': '/seɪ/', 'day': '/deɪ/',
    'my': '/maɪ/', 'eye': '/aɪ/', 'go': '/ɡəʊ/', 'no': '/nəʊ/',
    'now': '/naʊ/', 'here': '/hɪə/', 'near': '/nɪə/', 'hair': '/heə/',
    'pure': '/pjʊə/', 'bird': '/bɜːd/', 'car': '/kɑː/', 'bus': '/bʌs/',
    'book': '/bʊk/', 'pen': '/pen/', 'table': '/ˈteɪbəl/', 'chair': '/tʃeə/',
    'door': '/dɔː/', 'tree': '/triː/', 'flower': '/ˈflaʊə/',
    'sea': '/siː/', 'see': '/siː/', 'be': '/biː/', 'bee': '/biː/',
    'to': '/tuː/', 'too': '/tuː/', 'two': '/tuː/',
    'there': '/ðeə/', 'their': '/ðeə/', "they're": '/ðeə/',
    'knight': '/naɪt/', 'night': '/naɪt/',
    'right': '/raɪt/', 'write': '/raɪt/', 'rite': '/raɪt/',
    'pair': '/peə/', 'pear': '/peə/', 'pare': '/peə/',
    'flour': '/ˈflaʊə/',
};

class IPATrainer {
    constructor() {
        this.ipaData = null;
        this.wordsData = null;
        this.currentWord = '';
        this.currentIPA = '';
        this.userHistory = this.loadHistory();
        this.router = null;
        this.synth = window.speechSynthesis || null;
        this.recognition = null;
        this.trainingState = null;
        this.quizState = null;
        this.readyPromise = this.init();
    }

    async init() {
        try {
            this.applyTheme(localStorage.getItem('theme') || 'dark');
            await this.loadData();
            this.setupSpeechRecognition();
            this.setupGlobalEvents();
            this.initRouter();
            this.updateTopbarStats();
            this.checkUsername();
            try { registerServiceWorker(); } catch (e) {}
            if (window.__hideSplash) setTimeout(window.__hideSplash, 300);
        } catch (err) {
            console.error('Init error:', err);
            if (window.__hideSplash) window.__hideSplash();
            if (!this.ipaData) this.ipaData = IPADataFallback;
            if (!this.wordsData) this.wordsData = { words: WordsFallback };
        }
    }

    async loadData() {
        let ipa = null;
        let words = null;
        try {
            const res = await fetch('data/ipa.json', { cache: 'no-cache' });
            if (res.ok) ipa = await res.json();
        } catch (e) { console.warn('ipa.json failed', e); }
        try {
            const res = await fetch('data/words.json', { cache: 'no-cache' });
            if (res.ok) words = await res.json();
        } catch (e) { console.warn('words.json failed', e); }

        this.ipaData = (ipa && ipa.vowels) ? ipa : IPADataFallback;
        this.wordsData = (words && words.words) ? words : { words: WordsFallback };
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) {}
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === theme);
        });
    }

    setupSpeechRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognitionSupported = !!SR;
        this.recognition = null;
        this.recognitionBusy = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this._micStream = null;
        this._recognitionRetries = 0;

        if (SR) {
            const rec = new SR();
            rec.lang = 'en-US';
            rec.interimResults = false;
            rec.maxAlternatives = 1;
            rec.continuous = false;
            try { rec.serviceURI = 'https://www.google.com/speech-api/v2/recognize'; } catch (e) {}
            this.recognition = rec;
        }
    }

    async _requestMicrophonePermission() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return { ok: false, reason: 'unsupported' };
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
            });
            this._micStream = stream;
            return { ok: true, stream };
        } catch (err) {
            console.warn('Mic permission error:', err.name, err.message);
            let reason = 'unknown';
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') reason = 'denied';
            else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') reason = 'notfound';
            else if (err.name === 'NotReadableError') reason = 'inuse';
            else if (err.name === 'SecurityError') reason = 'security';
            return { ok: false, reason };
        }
    }

    _stopMicStream() {
        if (this._micStream) {
            try { this._micStream.getTracks().forEach(t => t.stop()); } catch (e) {}
            this._micStream = null;
        }
    }

    speak(text, rate = 0.9) {
        if (!this.synth) { toast.warning('المتصفح لا يدعم النطق'); return; }
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = rate;
        this.synth.speak(u);
    }

    setupGlobalEvents() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const closeBtn = document.getElementById('sidebarClose');

        const openSidebar = () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        };
        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        };

        menuToggle?.addEventListener('click', openSidebar);
        closeBtn?.addEventListener('click', closeSidebar);
        overlay?.addEventListener('click', closeSidebar);

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => this.applyTheme(btn.dataset.theme));
        });

        document.querySelectorAll('.bnav-item, .sidebar-nav .nav-item').forEach(el => {
            el.addEventListener('click', () => {
                const page = el.dataset.page;
                if (page) {
                    this.router.navigate(page);
                    if (window.innerWidth <= 768) closeSidebar();
                }
            });
        });

        document.getElementById('mainContent').addEventListener('click', (e) => {
            const chip = e.target.closest('.chip[data-word]');
            if (chip) {
                const input = document.getElementById('wordInput');
                if (input) input.value = chip.dataset.word;
                this.handleSearch();
            }
        });

        document.getElementById('mainContent').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.id === 'wordInput') {
                this.handleSearch();
            }
        });
    }

    initRouter() {
        this.router = new Router({
            container: document.getElementById('mainContent'),
            defaultRoute: 'home',
            onNavigate: () => {
                document.getElementById('sidebar')?.classList.remove('open');
                document.getElementById('sidebarOverlay')?.classList.remove('active');
            },
        });

        this.router
            .register('home', () => this.pageHome())
            .register('training', () => this.pageTraining())
            .register('quiz', () => this.pageQuiz())
            .register('dictionary', () => this.pageDictionary())
            .register('history', () => this.pageHistory())
            .register('about', () => this.pageAbout())
            .register('developer', () => this.pageDeveloper())
            .register('contributors', () => this.pageContributors())
            .register('support', () => this.pageSupport())
            .register('faq', () => this.pageFaq())
            .register('privacy', () => this.pagePrivacy())
            .register('terms', () => this.pageTerms())
            .register('license', () => this.pageLicense());

        const last = localStorage.getItem('lastPage') || 'home';
        this.router.navigate(last, { push: false });
    }

    loadHistory() {
        try {
            const raw = localStorage.getItem('ipa_history_v2');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { searches: [], quizzes: [], trainings: 0, totalPoints: 0, correctAnswers: 0 };
    }

    saveHistory() {
        try { localStorage.setItem('ipa_history_v2', JSON.stringify(this.userHistory)); } catch (e) {}
    }

    addPoints(n) {
        this.userHistory.totalPoints += n;
        this.saveHistory();
        this.updateTopbarStats();
    }

    updateTopbarStats() {
        const pts = document.getElementById('totalPoints');
        const lvl = document.getElementById('userLevel');
        if (pts) pts.textContent = this.userHistory.totalPoints;
        if (lvl) {
            const p = this.userHistory.totalPoints;
            let icon = 'fa-seedling', text = 'مبتدئ';
            if (p >= 600) { icon = 'fa-crown'; text = 'خبير'; }
            else if (p >= 300) { icon = 'fa-chart-line'; text = 'متقدم'; }
            else if (p >= 100) { icon = 'fa-graduation-cap'; text = 'متعلم'; }
            lvl.previousElementSibling?.remove();
            const iEl = document.createElement('i');
            iEl.className = `fas ${icon}`;
            lvl.parentElement.insertBefore(iEl, lvl);
            lvl.textContent = text;
        }
    }

    checkUsername() {
        const name = localStorage.getItem('userName');
        if (!name) {
            setTimeout(() => {
                dialog.show({
                    title: 'مرحباً بك',
                    icon: 'fa-user-plus',
                    content: '<p>أدخل اسمك لبدء الرحلة التعليمية</p>',
                    input: { type: 'text', placeholder: 'اسمك...', required: true },
                    confirmText: 'بدء',
                    cancelText: 'تخطي',
                }).then(v => {
                    if (v) {
                        localStorage.setItem('userName', v);
                        if (this.router.currentRoute === 'home') {
                            this.router.navigate('home', { push: false });
                        }
                    }
                });
            }, 500);
        }
    }

    async searchWord(word) {
        word = word.trim().toLowerCase();
        try {
            const res = await fetch(`${API_URL}${word}`);
            if (res.ok) {
                const data = await res.json();
                const ipa = data[0]?.phonetics?.find(p => p.text)?.text;
                if (ipa) return this.normalizeIPA(ipa);
            }
        } catch (e) {}
        if (this.wordsData?.words) {
            const found = this.wordsData.words.find(w => w.word.toLowerCase() === word);
            if (found) return this.normalizeIPA(found.ipa);
        }
        return LocalIPADict[word] || null;
    }

    normalizeIPA(ipa) {
        if (!ipa.startsWith('/') && !ipa.startsWith('[')) return `/${ipa}/`;
        return ipa;
    }

    parseIPA(ipaString) {
        const clean = ipaString.replace(/[\/\[\]ˈˌ()]/g, '').trim();
        const symbols = [];
        let i = 0;
        const isKnown = (s) =>
            this.ipaData.vowels.some(x => x.symbol === s) ||
            this.ipaData.consonants.some(x => x.symbol === s) ||
            this.ipaData.diphthongs.some(x => x.symbol === s);

        while (i < clean.length) {
            const two = clean.substr(i, 2);
            const three = clean.substr(i, 3);
            if (three.length === 3 && isKnown(three)) {
                symbols.push(three); i += 3; continue;
            }
            if (two.length === 2 && isKnown(two)) {
                symbols.push(two); i += 2; continue;
            }
            const ch = clean[i];
            const next = clean[i + 1];
            if (next === 'ː') {
                symbols.push(ch + 'ː'); i += 2; continue;
            }
            if (ch.trim()) symbols.push(ch);
            i++;
        }

        return {
            full: ipaString,
            symbols,
            start: symbols[0] || '-',
            middle: symbols.slice(1, -1).join('') || '-',
            end: symbols[symbols.length - 1] || '-',
        };
    }

    getSymbolData(symbol) {
        return this.ipaData.vowels.find(v => v.symbol === symbol) ||
            this.ipaData.consonants.find(c => c.symbol === symbol) ||
            this.ipaData.diphthongs.find(d => d.symbol === symbol) || null;
    }

    getSymbolType(symbol) {
        if (this.ipaData.vowels.some(v => v.symbol === symbol)) return 'متحرك';
        if (this.ipaData.consonants.some(c => c.symbol === symbol)) return 'ساكن';
        if (this.ipaData.diphthongs.some(d => d.symbol === symbol)) return 'مزدوج';
        return 'رمز';
    }

    getExampleForSymbol(symbol) {
        return this.getSymbolData(symbol)?.examples?.[0] || '';
    }

    /* ============ PAGES ============ */

    pageHome() {
        const name = localStorage.getItem('userName') || '';
        const greeting = name ? `مرحباً ${name}` : 'مرحباً بك';
        const suggestions = ['think', 'this', 'cat', 'dog', 'fish', 'house', 'beautiful', 'phone', 'hello', 'world', 'boy', 'my', 'go'];
        return `
            <div class="page">
                <div class="hero">
                    <h2 class="hero-greeting"><i class="fas fa-hand-peace"></i> ${greeting}</h2>
                    <p class="hero-subtitle">تعلم النطق الصحيح باستخدام الأبجدية الصوتية الدولية</p>
                    <div class="search-box">
                        <input type="text" id="wordInput" placeholder="مثال: think, beautiful, phone..." autocomplete="off" enterkeyhint="search">
                        <button id="searchBtn" class="btn-primary"><i class="fas fa-search"></i><span>بحث</span></button>
                    </div>
                    <div class="suggestions">
                        ${suggestions.map(w => `<button class="chip" data-word="${w}"><i class="fas fa-search"></i>${w}</button>`).join('')}
                    </div>
                </div>
                <div id="resultArea"></div>
            </div>
        `;
    }

    async handleSearch() {
        const input = document.getElementById('wordInput');
        if (!input) return;
        const word = input.value.trim();
        if (!word) { toast.warning('الرجاء إدخال كلمة'); return; }

        const btn = document.getElementById('searchBtn');
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

        try {
            const ipa = await this.searchWord(word);
            if (ipa) {
                this.currentWord = word.toLowerCase();
                this.currentIPA = ipa;
                this.renderResult(word.toLowerCase(), ipa);
                this.userHistory.searches.unshift({ word: word.toLowerCase(), ipa, date: new Date().toISOString() });
                if (this.userHistory.searches.length > 50) this.userHistory.searches.length = 50;
                this.saveHistory();
            } else {
                toast.error('لم يتم العثور على الكلمة');
            }
        } catch (e) {
            console.error(e);
            toast.error('حدث خطأ في البحث');
        } finally {
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-search"></i><span>بحث</span>'; }
        }
    }

    renderResult(word, ipa) {
        const area = document.getElementById('resultArea');
        if (!area) return;
        const parsed = this.parseIPA(ipa);
        area.innerHTML = `
            <div class="result-card">
                <div class="result-head">
                    <div>
                        <div class="result-word">${word}</div>
                        <div class="result-ipa">${ipa}</div>
                    </div>
                    <div class="result-actions">
                        <button class="action-btn" id="playBtn"><i class="fas fa-volume-up"></i> استمع</button>
                        <button class="action-btn" id="recBtn"><i class="fas fa-microphone"></i> سجل</button>
                    </div>
                </div>
                <div class="section-title"><i class="fas fa-chart-simple"></i> تحليل الصوت</div>
                <div class="breakdown-grid">
                    <div class="breakdown-cell">
                        <div class="breakdown-label">بداية</div>
                        <div class="breakdown-symbol">${parsed.start}</div>
                        <div class="breakdown-example">${this.getExampleForSymbol(parsed.start)}</div>
                    </div>
                    <div class="breakdown-arrow"><i class="fas fa-arrow-left"></i></div>
                    <div class="breakdown-cell">
                        <div class="breakdown-label">وسط</div>
                        <div class="breakdown-symbol">${parsed.middle}</div>
                    </div>
                    <div class="breakdown-arrow"><i class="fas fa-arrow-left"></i></div>
                    <div class="breakdown-cell">
                        <div class="breakdown-label">نهاية</div>
                        <div class="breakdown-symbol">${parsed.end}</div>
                        <div class="breakdown-example">${this.getExampleForSymbol(parsed.end)}</div>
                    </div>
                </div>
                <div class="section-title"><i class="fas fa-table-cells-large"></i> الرموز الصوتية</div>
                <div class="symbols-list">
                    ${parsed.symbols.map(s => `<button class="symbol-tag" data-sym="${s}">${s}<small>${this.getSymbolType(s)}</small></button>`).join('')}
                </div>
            </div>
        `;

        area.querySelector('#playBtn').addEventListener('click', () => this.speak(word));
        area.querySelector('#recBtn').addEventListener('click', () => this.openRecordModal());
        area.querySelectorAll('.symbol-tag').forEach(t => {
            t.addEventListener('click', () => this.showSymbolModal(t.dataset.sym));
        });
    }

    showSymbolModal(symbol) {
        const data = this.getSymbolData(symbol);
        if (!data) {
            dialog.alert('هذا الرمز غير موجود في القاموس');
            return;
        }
        dialog.show({
            title: `الرمز /${symbol}/`,
            icon: 'fa-microphone-alt',
            content: `
                <p>${data.description}</p>
                <ul class="dialog-examples-list">
                    ${data.examples.map(ex => `<li><i class="fas fa-language"></i>${ex}</li>`).join('')}
                </ul>
                <button class="btn-secondary" id="dlgPlay" style="width:100%;margin-top:8px">
                    <i class="fas fa-volume-up"></i> استمع
                </button>
            `,
            confirmText: 'إغلاق',
            cancelText: '',
        }).then(() => {});

        setTimeout(() => {
            document.getElementById('dlgPlay')?.addEventListener('click', () => {
                this.speak(data.examples?.[0] || symbol);
            });
        }, 60);
    }

    openRecordModal() {
        if (!this.currentWord) {
            toast.warning('ابحث عن كلمة أولاً');
            return;
        }
        const targetWord = this.currentWord;
        const hasRecognition = this.recognitionSupported;
        dialog.show({
            title: 'تسجيل النطق',
            icon: 'fa-microphone-alt',
            content: `
                <div style="text-align:center;padding:10px 0 16px">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px">الكلمة المستهدفة</div>
                    <div style="font-family:var(--font-mono);font-size:1.8rem;font-weight:800;color:var(--accent)">${targetWord}</div>
                </div>
                ${!hasRecognition ? `
                    <div class="record-result incorrect" style="display:flex">
                        <i class="fas fa-exclamation-triangle"></i>
                        متصفحك لا يدعم التعرف الصوتي التلقائي — ستحتاج للتقييم اليدوي
                    </div>
                ` : ''}
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:12px">
                    <i class="fas fa-info-circle"></i> سيطلب المتصفح إذن الميكروفون. اسمح به ثم انطق الكلمة.
                </p>
            `,
            confirmText: 'ابدأ التسجيل',
            cancelText: 'إغلاق',
        }).then((confirmed) => {
            if (confirmed === true) {
                this._startRecordingFlow(targetWord);
            }
        });
    }

    async _startRecordingFlow(targetWord) {
        const perm = await this._requestMicrophonePermission();
        if (!perm.ok) {
            this._showPermissionError(perm.reason);
            return;
        }
        if (!this.recognitionSupported || !this.recognition) {
            this._startManualRecording(targetWord);
            return;
        }
        this._trySpeechRecognition(targetWord);
    }

    _trySpeechRecognition(targetWord) {
        const rec = this.recognition;
        if (!rec) {
            this._startManualRecording(targetWord);
            return;
        }

        if (this.recognitionBusy) {
            try { rec.abort(); } catch (e) {}
            this.recognitionBusy = false;
        }

        const cleanTarget = targetWord.toLowerCase().trim();
        let finished = false;
        let hasReceivedResult = false;
        const cleanup = () => {
            this.recognitionBusy = false;
            this._stopMicStream();
        };
        const closeActiveDialogs = () => {
            document.querySelectorAll('.dialog-overlay.active').forEach(o => {
                o.classList.remove('active');
                setTimeout(() => { if (o.parentNode) o.parentNode.removeChild(o); }, 200);
            });
        };
        const finish = (spoken, source = 'auto') => {
            if (finished) return;
            finished = true;
            cleanup();
            closeActiveDialogs();
            this._evaluateRecording(spoken, cleanTarget, source);
        };

        rec.onresult = (event) => {
            hasReceivedResult = true;
            try {
                const spoken = (event.results[0][0].transcript || '').toLowerCase().trim();
                finish(spoken, 'auto');
            } catch (e) {
                console.error('Parse error:', e);
                finish('', 'auto');
            }
        };
        rec.onerror = (event) => {
            if (finished) return;
            const err = event.error;
            console.warn('Recognition error:', err, event.message || '');

            if (err === 'network') {
                finished = true;
                cleanup();
                closeActiveDialogs();
                this._fallbackToManualAfterNetworkError(targetWord);
                return;
            }
            if (err === 'no-speech') {
                finish('', 'auto');
                return;
            }
            if (err === 'not-allowed' || err === 'service-not-allowed') {
                finished = true;
                cleanup();
                closeActiveDialogs();
                this._showPermissionError('denied');
                return;
            }
            if (err === 'audio-capture') {
                finished = true;
                cleanup();
                closeActiveDialogs();
                this._showPermissionError('notfound');
                return;
            }
            if (err === 'aborted') {
                finished = true;
                cleanup();
                return;
            }
            finish('', 'auto');
        };
        rec.onend = () => {
            if (!finished && !hasReceivedResult) {
                finished = true;
                cleanup();
                this._evaluateRecording('', cleanTarget, 'auto');
            }
        };

        dialog.show({
            title: 'التسجيل نشط',
            icon: 'fa-microphone',
            content: `
                <div style="text-align:center;padding:8px 0 14px">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">انطق الآن</div>
                    <div style="font-family:var(--font-mono);font-size:1.8rem;font-weight:800;color:var(--accent)">${targetWord}</div>
                </div>
                <div class="record-animation">
                    <div class="record-mic"><i class="fas fa-microphone-alt"></i></div>
                    <div class="sound-waves"><span></span><span></span><span></span><span></span><span></span></div>
                    <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:10px">
                        <i class="fas fa-circle" style="color:var(--error);font-size:0.45rem"></i> جاري الاستماع...
                    </p>
                </div>
            `,
            confirmText: 'إيقاف',
            cancelText: '',
        });

        setTimeout(() => {
            try {
                rec.start();
                this.recognitionBusy = true;
            } catch (err) {
                if (err.name === 'InvalidStateError') {
                    try { rec.abort(); } catch (e) {}
                    setTimeout(() => {
                        try {
                            rec.start();
                            this.recognitionBusy = true;
                        } catch (e2) {
                            finished = true;
                            cleanup();
                            closeActiveDialogs();
                            this._fallbackToManualAfterNetworkError(targetWord);
                        }
                    }, 300);
                } else {
                    finished = true;
                    cleanup();
                    closeActiveDialogs();
                    console.error('start() failed:', err);
                    this._fallbackToManualAfterNetworkError(targetWord);
                }
            }
        }, 150);

        setTimeout(() => {
            if (!finished) {
                try { rec.stop(); } catch (e) {}
            }
        }, 12000);
    }

    _fallbackToManualAfterNetworkError(targetWord) {
        dialog.show({
            title: 'خادم التعرف غير متاح',
            icon: 'fa-wifi',
            content: `
                <div class="record-result incorrect" style="display:flex;margin-top:0">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div style="text-align:right">
                        <strong>خطأ شبكة في خدمة التعرف الصوتي</strong>
                        <div style="font-size:0.8rem;margin-top:4px">
                            خدمة التعرف في Chrome تحتاج اتصالاً بخوادم Google. قد يكون الاتصال محجوباً أو خلف VPN/جدار حماية.
                        </div>
                    </div>
                </div>
                <p style="margin-top:12px;font-size:0.85rem;color:var(--text-secondary)">
                    بديل: سنسجل صوتك ونشغّله لك لتقارن نطقك بالنطق الصحيح يدوياً.
                </p>
            `,
            confirmText: 'التسجيل اليدوي',
            cancelText: 'إلغاء',
        }).then(v => {
            if (v === true) this._startManualRecording(targetWord);
        });
    }

    _startManualRecording(targetWord) {
        if (!this._micStream) {
            this._requestMicrophonePermission().then(perm => {
                if (!perm.ok) { this._showPermissionError(perm.reason); return; }
                this._startManualRecording(targetWord);
            });
            return;
        }

        const Recorder = window.MediaRecorder;
        const mimeType = Recorder && [
            'audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg',
        ].find(type => Recorder.isTypeSupported(type));
        if (!Recorder || !mimeType) {
            this._stopMicStream();
            this._showManualEvaluation(targetWord);
            return;
        }

        try {
            const recorder = new Recorder(this._micStream, { mimeType });
            const chunks = [];
            let finished = false;
            recorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };
            recorder.onstop = () => {
                if (finished) return;
                finished = true;
                try {
                    const blob = new Blob(chunks, { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    this._showManualPlayback(url, targetWord);
                } catch (e) {
                    console.error('Blob error:', e);
                    this._showManualEvaluation(targetWord);
                }
                this._stopMicStream();
            };
            recorder.onerror = e => {
                console.error('Recorder error:', e);
                if (!finished) {
                    finished = true;
                    this._stopMicStream();
                    this._showManualEvaluation(targetWord);
                }
            };

            dialog.show({
                title: 'تسجيل يدوي',
                icon: 'fa-microphone',
                content: `
                    <div style="text-align:center;padding:8px 0 14px">
                        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">انطق</div>
                        <div style="font-family:var(--font-mono);font-size:1.8rem;font-weight:800;color:var(--accent)">${targetWord}</div>
                    </div>
                    <div class="record-animation">
                        <div class="record-mic"><i class="fas fa-microphone-alt"></i></div>
                        <div class="sound-waves"><span></span><span></span><span></span><span></span><span></span></div>
                        <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:10px">
                            <i class="fas fa-circle" style="color:var(--error);font-size:0.45rem"></i> جاري التسجيل... اضغط "إيقاف" عند الانتهاء
                        </p>
                    </div>
                `,
                confirmText: 'إيقاف التسجيل',
                cancelText: 'إلغاء',
            }).then(v => {
                if (recorder.state !== 'inactive') {
                    try { recorder.stop(); } catch (e) {}
                }
                if (v === null) {
                    finished = true;
                    this._stopMicStream();
                }
            });

            recorder.start();
            this.mediaRecorder = recorder;
            setTimeout(() => {
                if (!finished && recorder.state === 'recording') {
                    try { recorder.stop(); } catch (e) {}
                }
            }, 10000);
        } catch (err) {
            console.error('MediaRecorder error:', err);
            this._stopMicStream();
            this._showManualEvaluation(targetWord);
        }
    }

    _showManualPlayback(audioUrl, targetWord) {
        const audio = new Audio(audioUrl);
        dialog.show({
            title: 'مقارنة النطق',
            icon: 'fa-headphones',
            content: `
                <div style="text-align:center;padding:6px 0 14px">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">الكلمة</div>
                    <div style="font-family:var(--font-mono);font-size:1.6rem;font-weight:800;color:var(--accent)">${targetWord}</div>
                </div>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;text-align:center">
                    استمع لنطقك ثم قارنه بالنطق الصحيح
                </p>
                <div style="display:flex;flex-direction:column;gap:8px">
                    <button class="btn-secondary" id="playMine" style="width:100%"><i class="fas fa-play"></i> استمع لنطقي</button>
                    <button class="btn-primary" id="playRef" style="width:100%"><i class="fas fa-volume-up"></i> النطق الصحيح</button>
                </div>
                <p style="margin-top:14px;font-size:0.82rem;color:var(--text-secondary);text-align:center">هل نطقك مطابق؟</p>
            `,
            confirmText: 'نعم، صحيح',
            cancelText: 'لا، أحاول مرة أخرى',
        }).then(v => {
            try { audio.pause(); } catch (e) {}
            URL.revokeObjectURL(audioUrl);
            if (v === true) {
                this.addPoints(10);
                toast.success('ممتاز! +10 نقاط');
                this._recordManualSuccess(targetWord);
            } else if (v === false || v === null) {
                setTimeout(() => this._startManualRecording(targetWord), 200);
            }
        });

        setTimeout(() => {
            document.getElementById('playMine')?.addEventListener('click', () => {
                audio.currentTime = 0;
                audio.play().catch(() => toast.error('تعذر تشغيل التسجيل'));
            });
            document.getElementById('playRef')?.addEventListener('click', () => this.speak(targetWord, 0.85));
        }, 80);
    }

    _showManualEvaluation(targetWord) {
        dialog.show({
            title: 'تقييم يدوي',
            icon: 'fa-user-check',
            content: `
                <div style="text-align:center;padding:6px 0 14px">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">الكلمة</div>
                    <div style="font-family:var(--font-mono);font-size:1.6rem;font-weight:800;color:var(--accent)">${targetWord}</div>
                </div>
                <p style="font-size:0.85rem;color:var(--text-secondary);text-align:center">استمع للنطق الصحيح، كرر الكلمة، ثم قيّم نفسك.</p>
                <button class="btn-primary" id="playRefManual" style="width:100%;margin-top:10px"><i class="fas fa-volume-up"></i> النطق الصحيح</button>
            `,
            confirmText: 'نطقتها بشكل صحيح',
            cancelText: 'لم أنجح',
        }).then(v => {
            if (v === true) {
                this.addPoints(5);
                toast.success('أحسنت! +5 نقاط');
            }
        });
        setTimeout(() => {
            document.getElementById('playRefManual')?.addEventListener('click', () => this.speak(targetWord, 0.85));
        }, 80);
    }

    _recordManualSuccess(word) {
        try {
            this.userHistory.searches.unshift({ word, ipa: '—', date: new Date().toISOString() });
            if (this.userHistory.searches.length > 50) this.userHistory.searches.length = 50;
            this.saveHistory();
        } catch (e) {}
    }

    _evaluateRecording(spoken, target, source = 'auto') {
        const isCorrect = spoken && spoken === target;
        const isEmpty = !spoken;
        let title, icon, body;
        if (isCorrect) {
            title = 'نطق صحيح';
            icon = 'fa-check-circle';
            body = '<div class="record-result correct"><i class="fas fa-check-circle"></i> ممتاز! النطق مطابق</div>';
            this.addPoints(10);
        } else if (isEmpty) {
            title = 'لم يُسمع صوت';
            icon = 'fa-microphone-slash';
            body = '<div class="record-result incorrect"><i class="fas fa-microphone-slash"></i> لم يُلتقط أي صوت — تحدث بوضوح وأقرب للميكروفون</div>';
        } else {
            title = 'النطق غير مطابق';
            icon = 'fa-times-circle';
            body = `
                <div class="record-result incorrect"><i class="fas fa-times-circle"></i> النطق غير مطابق</div>
                <div style="margin-top:12px;padding:10px;background:var(--bg-elevated);border-radius:var(--radius-md);text-align:center">
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">قلت</div>
                    <div style="font-family:var(--font-mono);font-size:1rem;color:var(--error)">${spoken}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin:8px 0 4px">المطلوب</div>
                    <div style="font-family:var(--font-mono);font-size:1rem;color:var(--success)">${target}</div>
                </div>
            `;
        }
        dialog.show({
            title, icon, content: body,
            confirmText: isCorrect ? 'رائع' : 'إعادة المحاولة',
            cancelText: 'إغلاق',
        }).then(v => {
            if (!isCorrect && v === true) {
                setTimeout(() => {
                    if (source === 'auto' && this.recognition) this._trySpeechRecognition(target);
                    else this._startManualRecording(target);
                }, 250);
            }
        });
    }

    _showPermissionError(reason) {
        const messages = {
            denied: {
                title: 'إذن الميكروفون مرفوض',
                body: `
                    <p>تم رفض إذن الميكروفون. لإعادة التفعيل:</p>
                    <ul class="dialog-examples-list">
                        <li><i class="fas fa-check"></i> اضغط أيقونة القفل بجانب عنوان الموقع</li>
                        <li><i class="fas fa-check"></i> اختر "Site settings" أو "إعدادات الموقع"</li>
                        <li><i class="fas fa-check"></i> فعّل "Microphone"</li>
                        <li><i class="fas fa-check"></i> أعد تحميل الصفحة</li>
                    </ul>
                `,
            },
            notfound: { title: 'لا يوجد ميكروفون', body: '<p>لم يُعثر على جهاز ميكروفون. تحقق من التوصيلات.</p>' },
            inuse: { title: 'الميكروفون مشغول', body: '<p>تطبيق آخر يستخدم الميكروفون. أغلقه ثم حاول مجدداً.</p>' },
            security: { title: 'خطأ أمني', body: '<p>يجب تشغيل الموقع عبر <strong>HTTPS</strong> أو <strong>localhost</strong> لاستخدام الميكروفون.</p>' },
            unsupported: { title: 'غير مدعوم', body: '<p>متصفحك لا يدعم الوصول للميكروفون.</p>' },
            unknown: { title: 'خطأ غير معروف', body: '<p>تعذر الوصول للميكروفون.</p>' },
        };
        const m = messages[reason] || messages.unknown;
        dialog.show({ title: m.title, icon: 'fa-exclamation-triangle', content: m.body, confirmText: 'حسناً', cancelText: '' });
    }

    /* ============ TRAINING ============ */

    pageTraining() {
        this.trainingState = this.generateTrainingState();
        setTimeout(() => this.renderTrainingQuestion(), 0);
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-dumbbell"></i> التدريب</h2>
                    <p>استمع للصوت واختر الرمز الصحيح</p>
                </div>
                <div class="training-stats-bar">
                    <span><i class="fas fa-question-circle"></i> السؤال: <strong id="trainCurrent">1</strong>/<span id="trainTotal">10</span></span>
                    <span><i class="fas fa-star"></i> النقاط: <strong id="trainScore">0</strong></span>
                </div>
                <div id="trainingBody"></div>
            </div>
        `;
    }

    generateTrainingState() {
        const all = [
            ...this.ipaData.vowels.map(s => ({ ...s, kind: 'vowel' })),
            ...this.ipaData.consonants.map(s => ({ ...s, kind: 'consonant' })),
            ...this.ipaData.diphthongs.map(s => ({ ...s, kind: 'diphthong' })),
        ];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        const questions = shuffled.slice(0, Math.min(10, shuffled.length)).map(q => {
            const pool = all.filter(x => x.symbol !== q.symbol);
            const wrong = [...pool].sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.symbol);
            return { ...q, options: [q.symbol, ...wrong].sort(() => Math.random() - 0.5) };
        });
        return { questions, current: 0, score: 0 };
    }

    renderTrainingQuestion() {
        const body = document.getElementById('trainingBody');
        if (!body) return;
        const s = this.trainingState;
        const totalEl = document.getElementById('trainTotal');
        if (totalEl) totalEl.textContent = s.questions.length;

        if (s.current >= s.questions.length) {
            document.getElementById('trainCurrent').textContent = s.questions.length;
            document.getElementById('trainScore').textContent = s.score;
            body.innerHTML = `
                <div class="quiz-result-panel">
                    <i class="fas fa-trophy trophy"></i>
                    <h3>اكتمل التدريب!</h3>
                    <p class="score-line">النقاط: <strong>${s.score}</strong> / ${s.questions.length * 10}</p>
                    <p class="score-line">نسبة النجاح: <strong>${Math.round((s.score / (s.questions.length * 10)) * 100)}%</strong></p>
                    <button class="btn-primary" id="retryTrain" style="margin-top:14px">
                        <i class="fas fa-redo"></i> تدريب جديد
                    </button>
                </div>
            `;
            body.querySelector('#retryTrain')?.addEventListener('click', () => {
                this.trainingState = this.generateTrainingState();
                this.renderTrainingQuestion();
            });
            this.userHistory.trainings++;
            this.saveHistory();
            return;
        }

        const q = s.questions[s.current];
        document.getElementById('trainCurrent').textContent = s.current + 1;
        document.getElementById('trainScore').textContent = s.score;

        body.innerHTML = `
            <button class="play-btn-large" id="playTrainSound">
                <i class="fas fa-headphones"></i> استمع للصوت
            </button>
            <div class="options-grid">
                ${q.options.map(o => `<button class="option-btn" data-opt="${o}">${o}</button>`).join('')}
            </div>
            <div id="trainFeedback"></div>
            <button class="btn-next hidden" id="trainNext"><i class="fas fa-arrow-left"></i> التالي</button>
        `;

        body.querySelector('#playTrainSound').addEventListener('click', () => {
            const example = q.examples?.[0] || q.symbol;
            this.speak(example, 0.85);
        });

        body.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.dataset.opt;
                const correct = q.symbol;
                body.querySelectorAll('.option-btn').forEach(b => {
                    b.disabled = true;
                    if (b.dataset.opt === correct) b.classList.add('correct');
                    else if (b.dataset.opt === selected) b.classList.add('wrong');
                });
                const fb = body.querySelector('#trainFeedback');
                if (selected === correct) {
                    s.score += 10;
                    this.addPoints(10);
                    document.getElementById('trainScore').textContent = s.score;
                    fb.className = 'feedback-bar success';
                    fb.innerHTML = '<i class="fas fa-check-circle"></i> إجابة صحيحة! +10';
                } else {
                    fb.className = 'feedback-bar error';
                    fb.innerHTML = `<i class="fas fa-times-circle"></i> خطأ! الإجابة: ${correct}`;
                }
                const next = body.querySelector('#trainNext');
                next.classList.remove('hidden');
                next.addEventListener('click', () => {
                    s.current++;
                    this.renderTrainingQuestion();
                });
            });
        });
    }

    /* ============ QUIZ ============ */

    pageQuiz() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-pen-to-square"></i> الاختبارات</h2>
                    <p>اختبر معرفتك بالرموز الصوتية</p>
                </div>
                <div class="quiz-controls">
                    <select class="select-input" id="quizType">
                        <option value="multiple">اختيار من متعدد</option>
                        <option value="writing">كتابة الرمز بلوحة IPA</option>
                    </select>
                    <button class="btn-primary" id="startQuiz"><i class="fas fa-play"></i> بدء</button>
                </div>
                <div class="quiz-panel" id="quizPanel">
                    <div class="quiz-placeholder">
                        <i class="fas fa-trophy"></i>
                        <p>اختر نوع الاختبار واضغط بدء</p>
                    </div>
                </div>
            </div>
        `;
    }

    startQuiz(type) {
        const pool = this.wordsData.words.map(w => ({ word: w.word, ipa: w.ipa }));
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
        this.quizState = {
            type,
            questions: shuffled.map(q => {
                const wrongPool = [...new Set(pool.map(x => x.ipa))].filter(x => x !== q.ipa);
                const wrong = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3);
                return { ...q, options: [q.ipa, ...wrong].sort(() => Math.random() - 0.5) };
            }),
            current: 0,
            score: 0,
            writingBuffer: '',
        };
        this.renderQuizQuestion();
    }

    renderQuizQuestion() {
        const panel = document.getElementById('quizPanel');
        if (!panel) return;
        const s = this.quizState;
        if (!s) {
            panel.innerHTML = '<div class="quiz-placeholder"><i class="fas fa-trophy"></i><p>اختر نوع الاختبار واضغط بدء</p></div>';
            return;
        }
        if (s.current >= s.questions.length) {
            this.showQuizResult();
            return;
        }
        const q = s.questions[s.current];

        if (s.type === 'multiple') {
            panel.innerHTML = `
                <div class="quiz-question">
                    <button class="audio-play" id="quizAudio"><i class="fas fa-headphones"></i> استمع</button>
                    <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:4px">اختر الرمز الصحيح للكلمة:</p>
                    <div class="word-display">${q.word}</div>
                    <div class="quiz-options-list">
                        ${q.options.map(o => `<button class="quiz-option" data-opt="${o}">${o}</button>`).join('')}
                    </div>
                </div>
            `;
            panel.querySelector('#quizAudio').addEventListener('click', () => this.speak(q.word));
            panel.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const selected = btn.dataset.opt;
                    const correct = q.ipa;
                    if (selected === correct) {
                        s.score += 10;
                        this.addPoints(10);
                        toast.success('إجابة صحيحة! +10');
                    } else {
                        toast.error(`خطأ! الإجابة: ${correct}`);
                    }
                    s.current++;
                    this.renderQuizQuestion();
                });
            });
        } else {
            panel.innerHTML = `
                <div class="quiz-question">
                    <button class="audio-play" id="quizAudio"><i class="fas fa-headphones"></i> استمع</button>
                    <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:4px">اكتب الرمز الصوتي للكلمة:</p>
                    <div class="word-display">${q.word}</div>
                    <div class="quiz-answer-display" id="answerDisplay"></div>
                    <div class="ipa-keyboard" id="ipaKeyboard"></div>
                    <div class="quiz-submit-bar">
                        <button class="btn-secondary" id="clearAnswer"><i class="fas fa-eraser"></i> مسح</button>
                        <button class="btn-primary" id="submitAnswer"><i class="fas fa-check"></i> تحقق</button>
                    </div>
                </div>
            `;
            this.renderIPAKeyboard();
            this.updateAnswerDisplay();
            panel.querySelector('#quizAudio').addEventListener('click', () => this.speak(q.word));
            panel.querySelector('#clearAnswer').addEventListener('click', () => {
                s.writingBuffer = '';
                this.updateAnswerDisplay();
            });
            panel.querySelector('#submitAnswer').addEventListener('click', () => {
                const answer = '/' + s.writingBuffer + '/';
                const normalized = answer.replace(/[\/]/g, '');
                const correct = q.ipa.replace(/[\/ˈˌ]/g, '');
                const ok = normalized === correct;
                if (ok) {
                    s.score += 10;
                    this.addPoints(10);
                    toast.success('إجابة صحيحة! +10');
                } else {
                    toast.error(`خطأ! الإجابة: ${q.ipa}`);
                }
                s.current++;
                s.writingBuffer = '';
                this.renderQuizQuestion();
            });
        }
    }

    renderIPAKeyboard() {
        const kb = document.getElementById('ipaKeyboard');
        if (!kb) return;
        const groups = [
            ...this.ipaData.vowels.map(v => v.symbol),
            ...this.ipaData.consonants.map(c => c.symbol),
            ...this.ipaData.diphthongs.map(d => d.symbol),
            'ː', 'ˈ', 'ˌ',
        ];
        const unique = [...new Set(groups)];
        kb.innerHTML = unique.map(sym => {
            const isSpecial = ['ː', 'ˈ', 'ˌ'].includes(sym);
            return `<button class="kb-key ${isSpecial ? 'special' : ''}" data-key="${sym}">${sym}</button>`;
        }).join('');

        kb.querySelectorAll('.kb-key').forEach(btn => {
            btn.addEventListener('click', () => {
                const k = btn.dataset.key;
                if (this.quizState) {
                    this.quizState.writingBuffer += k;
                    this.updateAnswerDisplay();
                }
            });
        });
    }

    updateAnswerDisplay() {
        const el = document.getElementById('answerDisplay');
        if (!el || !this.quizState) return;
        el.textContent = this.quizState.writingBuffer || '—';
    }

    showQuizResult() {
        const panel = document.getElementById('quizPanel');
        if (!panel) return;
        const s = this.quizState;
        const total = s.questions.length * 10;
        const pct = Math.round((s.score / total) * 100);
        panel.innerHTML = `
            <div class="quiz-result-panel">
                <i class="fas fa-trophy trophy"></i>
                <h3>النتيجة النهائية</h3>
                <p class="score-line">النقاط: <strong>${s.score}</strong> / ${total}</p>
                <p class="score-line">النسبة: <strong>${pct}%</strong></p>
                <p class="score-line" style="margin-top:12px">${pct >= 70 ? 'أداء ممتاز! استمر' : 'واصل التدريب لتحسين نتيجتك'}</p>
                <button class="btn-primary" id="retryQuiz" style="margin-top:16px">
                    <i class="fas fa-redo"></i> اختبار جديد
                </button>
            </div>
        `;
        panel.querySelector('#retryQuiz').addEventListener('click', () => {
            this.quizState = null;
            this.renderQuizQuestion();
        });
        this.userHistory.quizzes.unshift({ score: s.score, percentage: pct, date: new Date().toISOString() });
        if (pct >= 70) this.userHistory.correctAnswers++;
        if (this.userHistory.quizzes.length > 50) this.userHistory.quizzes.length = 50;
        this.saveHistory();
    }

    /* ============ DICTIONARY ============ */

    pageDictionary() {
        setTimeout(() => this.renderDictionaryCards('all'), 0);
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-book"></i> قاموس الأصوات</h2>
                    <p>جميع رموز IPA مع أمثلتها</p>
                </div>
                <div class="filter-row">
                    <button class="filter-chip active" data-filter="all"><i class="fas fa-globe"></i> الكل</button>
                    <button class="filter-chip" data-filter="vowel"><i class="fas fa-circle"></i> متحركة</button>
                    <button class="filter-chip" data-filter="consonant"><i class="fas fa-square"></i> ساكنة</button>
                    <button class="filter-chip" data-filter="diphthong"><i class="fas fa-link"></i> مزدوجة</button>
                    <button class="filter-chip" data-filter="homophone"><i class="fas fa-headphones"></i> متجانسة</button>
                </div>
                <div class="dict-grid" id="dictGrid"></div>
            </div>
        `;
    }

    renderDictionaryCards(filter = 'all') {
        const grid = document.getElementById('dictGrid');
        if (!grid) return;

        document.querySelectorAll('.filter-chip').forEach(c => {
            c.classList.toggle('active', c.dataset.filter === filter);
            c.onclick = () => this.renderDictionaryCards(c.dataset.filter);
        });

        const items = [];
        this.ipaData.vowels.forEach(v => items.push({ ...v, category: 'vowel' }));
        this.ipaData.consonants.forEach(c => items.push({ ...c, category: 'consonant' }));
        this.ipaData.diphthongs.forEach(d => items.push({ ...d, category: 'diphthong' }));
        if (this.ipaData.homophones) {
            this.ipaData.homophones.forEach(h => items.push({
                symbol: h.word,
                description: `كلمات متشابهة النطق: ${h.word} = ${h.homophones.join('، ')}`,
                examples: [h.word, ...h.homophones],
                category: 'homophone',
            }));
        }

        const filtered = filter === 'all' ? items : items.filter(x => x.category === filter);

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i> لا توجد عناصر</div>';
            return;
        }

        grid.innerHTML = filtered.map(item => `
            <div class="dict-card" data-cat="${item.category}" data-sym="${item.symbol}">
                <div class="dict-symbol">${item.symbol}</div>
                <div class="dict-desc">${item.description || ''}</div>
                <div class="dict-examples"><i class="fas fa-list"></i> ${(item.examples || []).slice(0, 3).join(' / ')}</div>
                <button class="dict-play" data-play="${item.symbol}"><i class="fas fa-volume-up"></i> استمع</button>
            </div>
        `).join('');

        grid.querySelectorAll('.dict-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.dict-play')) return;
                const cat = card.dataset.cat;
                const sym = card.dataset.sym;
                if (cat === 'homophone') {
                    const data = items.find(x => x.symbol === sym);
                    if (data) {
                        dialog.show({
                            title: `الكلمات المتجانسة`,
                            icon: 'fa-headphones',
                            content: `
                                <p>${data.description}</p>
                                <button class="btn-secondary" id="dlgPlayH" style="width:100%;margin-top:8px">
                                    <i class="fas fa-volume-up"></i> استمع
                                </button>
                            `,
                            confirmText: 'إغلاق',
                            cancelText: '',
                        });
                        setTimeout(() => {
                            document.getElementById('dlgPlayH')?.addEventListener('click', () => this.speak(sym));
                        }, 60);
                    }
                } else {
                    this.showSymbolModal(sym);
                }
            });
        });

        grid.querySelectorAll('.dict-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const sym = btn.dataset.play;
                const data = this.getSymbolData(sym);
                this.speak(data?.examples?.[0] || sym);
            });
        });
    }

    /* ============ HISTORY ============ */

    pageHistory() {
        setTimeout(() => this.renderHistoryContent(), 0);
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-chart-line"></i> تقديمي</h2>
                    <p>تتبع تقدمك وإنجازاتك</p>
                </div>
                <div id="historyBody"></div>
            </div>
        `;
    }

    renderHistoryContent() {
        const body = document.getElementById('historyBody');
        if (!body) return;
        const h = this.userHistory;
        const rate = h.quizzes.length
            ? Math.round(h.quizzes.reduce((s, q) => s + q.percentage, 0) / h.quizzes.length)
            : 0;

        const vowelPct = Math.min(100, h.correctAnswers * 8);
        const consPct = Math.min(100, Math.round(h.totalPoints / 10));
        const dipPct = Math.min(100, Math.round(h.totalPoints / 8));

        body.innerHTML = `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-search"></i></div>
                    <div class="stat-meta"><div class="stat-num">${h.searches.length}</div><div class="stat-lbl">عمليات بحث</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-meta"><div class="stat-num">${h.correctAnswers}</div><div class="stat-lbl">إجابات صحيحة</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                    <div class="stat-meta"><div class="stat-num">${rate}%</div><div class="stat-lbl">نسبة النجاح</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-meta"><div class="stat-num">${h.totalPoints}</div><div class="stat-lbl">النقاط</div></div>
                </div>
            </div>

            <div class="history-block">
                <h4><i class="fas fa-clock-rotate-left"></i> سجل البحث</h4>
                <div class="history-list">
                    ${h.searches.length === 0
                        ? '<div class="empty-state"><i class="fas fa-info-circle"></i> لا يوجد سجل بحث</div>'
                        : h.searches.slice(0, 20).map(s => `
                            <div class="history-row">
                                <span class="hword"><i class="fas fa-language"></i>${s.word}</span>
                                <span class="hipa">${s.ipa}</span>
                                <span class="hdate">${new Date(s.date).toLocaleDateString('ar')}</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="history-block">
                <h4><i class="fas fa-medal"></i> نتائج الاختبارات</h4>
                <div class="history-list">
                    ${h.quizzes.length === 0
                        ? '<div class="empty-state"><i class="fas fa-info-circle"></i> لا يوجد اختبارات</div>'
                        : h.quizzes.slice(0, 20).map(q => `
                            <div class="history-row">
                                <span><i class="fas fa-star" style="color:var(--accent)"></i> ${q.score}</span>
                                <span class="hipa">${q.percentage}%</span>
                                <span class="hdate">${new Date(q.date).toLocaleDateString('ar')}</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="history-block">
                <h4><i class="fas fa-chart-simple"></i> تقدم التعلم</h4>
                <div class="progress-list">
                    <div class="progress-row">
                        <span><i class="fas fa-circle" style="color:var(--accent)"></i> متحركة</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${vowelPct}%"></div></div>
                        <span>${vowelPct}%</span>
                    </div>
                    <div class="progress-row">
                        <span><i class="fas fa-square" style="color:var(--accent)"></i> ساكنة</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${consPct}%"></div></div>
                        <span>${consPct}%</span>
                    </div>
                    <div class="progress-row">
                        <span><i class="fas fa-link" style="color:var(--accent)"></i> مزدوجة</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${dipPct}%"></div></div>
                        <span>${dipPct}%</span>
                    </div>
                </div>
            </div>

            <div class="history-block">
                <h4><i class="fas fa-award"></i> الإنجازات</h4>
                <div class="achievements-row">
                    <div class="achievement-tile ${h.searches.length >= 1 ? 'unlocked' : ''}">
                        <i class="fas fa-star"></i><span>أول بحث</span>
                    </div>
                    <div class="achievement-tile ${h.quizzes.length >= 1 ? 'unlocked' : ''}">
                        <i class="fas fa-trophy"></i><span>أول اختبار</span>
                    </div>
                    <div class="achievement-tile ${h.totalPoints >= 500 ? 'unlocked' : ''}">
                        <i class="fas fa-crown"></i><span>خبير الأصوات</span>
                    </div>
                </div>
            </div>

            <button class="btn-danger" id="resetHistoryBtn" style="margin-top:8px">
                <i class="fas fa-trash-alt"></i> مسح السجل
            </button>
        `;

        body.querySelector('#resetHistoryBtn').addEventListener('click', async () => {
            const ok = await dialog.confirm('هل تريد مسح جميع بياناتك؟', { danger: true, title: 'تأكيد المسح' });
            if (ok) {
                this.userHistory = { searches: [], quizzes: [], trainings: 0, totalPoints: 0, correctAnswers: 0 };
                this.saveHistory();
                this.updateTopbarStats();
                this.renderHistoryContent();
                toast.success('تم مسح السجل');
            }
        });
    }

    /* ============ CONTENT PAGES ============ */

    pageAbout() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-info-circle"></i> حول البرنامج</h2>
                    <p>معلومات عامة عن IPA Trainer</p>
                </div>
                <div class="content-card">
                    <p><strong>IPA Trainer v2.0.0</strong> هو تطبيق ويب تفاعلي متقدم لتعلم النطق الصحيح للغة الإنجليزية باستخدام الأبجدية الصوتية الدولية (International Phonetic Alphabet).</p>
                    <p>المميزات الرئيسية:</p>
                    <ul>
                        <li><i class="fas fa-search"></i> البحث الفوري عن نطق أي كلمة إنجليزية مع التحليل الصوتي</li>
                        <li><i class="fas fa-dumbbell"></i> تدريب تفاعلي على الرموز الصوتية مع نظام نقاط تحفيزي</li>
                        <li><i class="fas fa-pen-to-square"></i> اختبارات متعددة تشمل الاختيار المتعدد ولوحة مفاتيح IPA</li>
                        <li><i class="fas fa-microphone"></i> اختبار النطق باستخدام التعرف الصوتي المتقدم</li>
                        <li><i class="fas fa-book"></i> قاموس شامل لجميع الرموز الصوتية مع أمثلة</li>
                        <li><i class="fas fa-chart-line"></i> تتبع التقدم والإحصائيات والإنجازات</li>
                        <li><i class="fas fa-moon"></i> وضعان داكن وفاتح مع حفظ التفضيلات</li>
                        <li><i class="fas fa-wifi"></i> العمل دون اتصال (PWA) وإمكانية التثبيت كتطبيق</li>
                        <li><i class="fas fa-mobile-alt"></i> تصميم Mobile-First متجاوب بالكامل</li>
                    </ul>
                    <p style="margin-top:12px"><strong>الإصدار الحالي:</strong> 2.0.0</p>
                    <p><strong>الترخيص:</strong> MIT — مفتوح المصدر</p>
                </div>
            </div>
        `;
    }

    pageDeveloper() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-code"></i> حول المطور</h2>
                    <p>خلف الكواليس</p>
                </div>
                <div class="content-card developer-card">
                    <div class="developer-avatar"><i class="fas fa-laptop-code"></i></div>
                    <div class="developer-name">محمد الباقر</div>
                    <div class="developer-role">مطور برمجيات مستقل</div>
                    <p>متخصص في تطوير تطبيقات الويب التفاعلية، وتصميم تجارب مستخدم متميزة، وإنشاء تطبيقات الهواتف وبرامج سطح المكتب.</p>
                    <div class="social-links">
                        <a href="https://www.instagram.com/g6xs0r/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://github.com/wsl-iq" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="https://t.me/wsl_iq" target="_blank" rel="noopener" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
                        <a href="https://wsl-iq.github.io/" target="_blank" rel="noopener" aria-label="Website"><i class="fas fa-globe"></i></a>
                    </div>
                </div>
            </div>
        `;
    }

    pageContributors() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-users"></i> المساهمون</h2>
                    <p>فريق العمل</p>
                </div>
                <div class="content-card">
                    <p style="margin-bottom:14px">شكراً لكل من ساهم في إنجاز هذا المشروع:</p>
                    <ul class="team-list">
                        <li class="team-item">
                            <i class="fas fa-user-tie"></i>
                            <div class="team-body">
                                <div class="team-name">محمد الباقر سعد حاتم</div>
                                <div class="team-desc">المطور الرئيسي والمسؤول عن تصميم وبرمجة المشروع</div>
                            </div>
                        </li>
                        <li class="team-item">
                            <i class="fas fa-user"></i>
                            <div class="team-body">
                                <div class="team-name">نور محمد عبد الكريم</div>
                                <div class="team-desc">إعداد وتجميع الكلمات والمفردات اللغوية وتنظيمها بما يخدم محتوى المشروع</div>
                            </div>
                        </li>
                        <li class="team-item">
                            <i class="fas fa-user"></i>
                            <div class="team-body">
                                <div class="team-name">نبأ حسين محمد علي</div>
                                <div class="team-desc">إعداد وكتابة الرسم الصوتي (Phonetic Transcription) مع توضيح دقيق لطريقة النطق</div>
                            </div>
                        </li>
                        <li class="team-item">
                            <i class="fas fa-user"></i>
                            <div class="team-body">
                                <div class="team-name">مريم علي حسين</div>
                                <div class="team-desc">تصميم وتنظيم الأحرف بأسلوب تعليمي منهجي يسهم في تسهيل الفهم</div>
                            </div>
                        </li>
                        <li class="team-item">
                            <i class="fas fa-user"></i>
                            <div class="team-body">
                                <div class="team-name">نور عمر</div>
                                <div class="team-desc">المساهمة في جمع الأحرف الصوتية وقواعد النطق من مصادر المادة</div>
                            </div>
                        </li>
                        <li class="team-item">
                            <i class="fas fa-user"></i>
                            <div class="team-body">
                                <div class="team-name">ندى ياس</div>
                                <div class="team-desc">تجميع الكلمات التي تحتوي على الأصوات المختلفة</div>
                            </div>
                        </li>
                    </ul>
                    <div class="supervisor-box">
                        <strong>إشراف أكاديمي:</strong> د. سيران نجم<br>
                        جامعة الإمام جعفر الصادق (ع)<br>
                        كلية التربية — قسم اللغة الإنكليزية
                    </div>
                </div>
            </div>
        `;
    }

    pageSupport() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-headset"></i> الدعم الفني</h2>
                    <p>نحن هنا لمساعدتك</p>
                </div>
                <div class="content-card">
                    <p>إذا واجهت أي مشكلة أو كان لديك اقتراح، يمكنك التواصل معنا عبر:</p>
                    <div class="contact-block">
                        <i class="fas fa-envelope"></i>
                        <span>mr.mohammed.al.baqer@gmail.com</span>
                    </div>
                    <div class="contact-block">
                        <i class="fab fa-github"></i>
                        <span>github.com/wsl-iq</span>
                    </div>
                    <div class="contact-block">
                        <i class="fab fa-telegram"></i>
                        <span>@wsl_iq</span>
                    </div>
                    <p style="margin-top:14px;font-size:0.82rem">يمكنك أيضاً الإبلاغ عن الأخطاء مباشرة من داخل التطبيق:</p>
                    <button class="btn-primary" id="reportIssueBtn" style="width:100%;margin-top:10px">
                        <i class="fas fa-bug"></i> الإبلاغ عن مشكلة
                    </button>
                </div>
            </div>
        `;
    }

    pageFaq() {
        const faqs = [
            ['كيف أبحث عن نطق كلمة؟', 'استخدم شريط البحث في الصفحة الرئيسية، أدخل الكلمة الإنجليزية (مثل think) ثم اضغط زر البحث. ستحصل على رمز IPA مع تحليل كامل.'],
            ['هل يمكنني اختبار نطقي الشخصي؟', 'نعم، بعد البحث عن كلمة اضغط زر "سجل" وسيقوم المتصفح بالاستماع لك ومقارنة نطقك بالكلمة الصحيحة. تحتاج إلى منح إذن الميكروفون.'],
            ['كيف تعمل لوحة مفاتيح IPA في الاختبار؟', 'في الاختبار الكتابي، تظهر لوحة مفاتيح تحتوي على جميع رموز IPA. اضغط على الرموز لتركيب الإجابة ثم اضغط "تحقق".'],
            ['ما الفرق بين التدريب والاختبار؟', 'التدريب يعرض 10 أسئلة عشوائية مع تعليق فوري بعد كل إجابة. الاختبار يعرض 5 كلمات ويحسب النتيجة النهائية كنسبة مئوية.'],
            ['كيف يعمل نظام النقاط؟', 'تحصل على 10 نقاط لكل إجابة صحيحة في التدريب أو الاختبار. النقاط ترفع مستواك: مبتدئ (0-99) → متعلم (100-299) → متقدم (300-599) → خبير (600+).'],
            ['هل يمكنني استخدام التطبيق دون إنترنت؟', 'نعم، التطبيق يدعم العمل دون اتصال (PWA) بعد أول زيارة. البيانات الأساسية محفوظة محلياً.'],
            ['كيف أثبت التطبيق على جهازي؟', 'افتح الموقع في متصفح Chrome على الجوال أو الكمبيوتر. ستظهر لك أيقونة "تثبيت" في شريط العناوين، أو من قائمة المتصفح اختر "تثبيت التطبيق".'],
            ['أين تُحفظ بياناتي؟', 'جميع بياناتك (سجل البحث، النتائج، النقاط، اسمك) تُحفظ محلياً في متصفحك فقط. لا تُرسل لأي خادم خارجي.'],
            ['ماذا أفعل إذا لم يعمل الصوت؟', 'تأكد من تفعيل الصوت في جهازك ومن عدم كتم المتصفح. جرب متصفحاً آخر إن استمرت المشكلة.'],
            ['هل التطبيق مجاني؟', 'نعم، التطبيق مجاني بالكامل ولا يتطلب أي اشتراك أو تسجيل دخول.'],
            ['هل يعمل الميكروفون على جميع المتصفحات؟', 'يدعم التسجيل الصوتي في Chrome وEdge وSafari (إصدارات حديثة). Firefox لا يدعم حالياً.'],
            ['كيف أمسح جميع بياناتي؟', 'اذهب إلى صفحة "تقديمي" واضغط زر "مسح السجل" في الأسفل. سيُطلب منك التأكيد قبل المسح.'],
        ];
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-question-circle"></i> الأسئلة الشائعة</h2>
                    <p>إجابات لأكثر الأسئلة تكراراً</p>
                </div>
                <div class="faq-list" id="faqList">
                    ${faqs.map(([q, a]) => `
                        <div class="faq-entry">
                            <button class="faq-trigger">
                                <span>${q}</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="faq-body">${a}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    pagePrivacy() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-lock"></i> سياسة الخصوصية</h2>
                    <p>خصوصيتك أولويتنا</p>
                </div>
                <div class="content-card">
                    <p>نلتزم في IPA Trainer بحماية خصوصيتك بشكل كامل:</p>
                    <ul>
                        <li><i class="fas fa-check-circle"></i> لا نجمع أي بيانات شخصية تعريفية</li>
                        <li><i class="fas fa-check-circle"></i> جميع بياناتك تُحفظ محلياً في متصفحك فقط (LocalStorage)</li>
                        <li><i class="fas fa-check-circle"></i> لا نستخدم أي أدوات تتبع أو تحليلات خارجية</li>
                        <li><i class="fas fa-check-circle"></i> لا نشارك أي معلومات مع أطراف ثالثة</li>
                        <li><i class="fas fa-check-circle"></i> استخدام API القاموس يكون فقط للبحث عن الكلمات</li>
                        <li><i class="fas fa-check-circle"></i> يمكنك مسح جميع بياناتك في أي وقت</li>
                    </ul>
                    <p style="margin-top:12px"><strong>آخر تحديث:</strong> 2026-04-08</p>
                </div>
            </div>
        `;
    }

    pageTerms() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-file-contract"></i> سياسة الاستخدام</h2>
                    <p>شروط الاستخدام</p>
                </div>
                <div class="content-card">
                    <p>باستخدامك لـ IPA Trainer، فإنك توافق على:</p>
                    <ul>
                        <li><i class="fas fa-check-circle"></i> استخدام التطبيق للأغراض التعليمية المشروعة فقط</li>
                        <li><i class="fas fa-check-circle"></i> عدم إساءة استخدام خاصية التسجيل الصوتي</li>
                        <li><i class="fas fa-check-circle"></i> احترام حقوق الملكية الفكرية للمحتوى التعليمي</li>
                        <li><i class="fas fa-check-circle"></i> عدم محاولة اختراق التطبيق أو التلاعب بمنطقه</li>
                        <li><i class="fas fa-check-circle"></i> الإبلاغ عن أي أخطاء أو مشاكل بك حسن نية</li>
                        <li><i class="fas fa-check-circle"></i> تحمل مسؤولية استخدامك الشخصي للتطبيق</li>
                    </ul>
                    <p style="margin-top:12px">التطبيق يُقدم "كما هو" دون ضمانات صريحة أو ضمنية.</p>
                </div>
            </div>
        `;
    }

    pageLicense() {
        return `
            <div class="page">
                <div class="page-header">
                    <h2><i class="fas fa-certificate"></i> الترخيص</h2>
                    <p>MIT License</p>
                </div>
                <div class="content-card">
                    <p>هذا المشروع مرخص تحت رخصة MIT المفتوحة:</p>
                    <div class="license-block">MIT License

Copyright (c) 2025-2026 IPA Trainer

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.</div>
                    <p style="margin-top:12px">يُسمح باستخدام وتعديل وتوزيع البرنامج للأغراض التعليمية والتجارية مع ذكر المصدر.</p>
                </div>
            </div>
        `;
    }
}

document.addEventListener('click', (e) => {
    const searchBtn = e.target.closest('#searchBtn');
    if (searchBtn) window.ipaTrainer?.handleSearch();
    const startBtn = e.target.closest('#startQuiz');
    if (startBtn) {
        const type = document.getElementById('quizType')?.value || 'multiple';
        window.ipaTrainer?.startQuiz(type);
    }
    const faqTrig = e.target.closest('.faq-trigger');
    if (faqTrig) faqTrig.parentElement.classList.toggle('open');
    const reportBtn = e.target.closest('#reportIssueBtn');
    if (reportBtn) {
        dialog.show({
            title: 'الإبلاغ عن مشكلة',
            icon: 'fa-bug',
            content: '<p>صف المشكلة بالتفصيل:</p>',
            input: { type: 'textarea', placeholder: 'وصف المشكلة...', required: true },
            confirmText: 'إرسال',
            cancelText: 'إلغاء',
        }).then((v) => { if (v) toast.success('تم استلام البلاغ. شكراً لك!'); });
    }
});

async function boot() {
    try {
        if (document.readyState === 'loading') {
            await new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }));
        }
        const app = new IPATrainer();
        window.ipaTrainer = app;
        await app.readyPromise;
        if (window.__hideSplash) window.__hideSplash();
    } catch (err) {
        console.error('Boot error:', err);
        if (window.__hideSplash) window.__hideSplash();
        const container = document.getElementById('mainContent');
        if (container) {
            container.innerHTML = `
                <div class="page">
                    <div class="content-card" style="text-align:center;margin-top:20px">
                        <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:var(--error);margin-bottom:12px"></i>
                        <h3>تعذر تحميل التطبيق</h3>
                        <p style="color:var(--text-secondary);margin:10px 0">${err.message || 'خطأ غير معروف'}</p>
                        <button class="btn-primary" onclick="location.reload()" style="margin-top:12px">
                            <i class="fas fa-redo"></i> إعادة التحميل
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
} else {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
}

// setupSpeechRecognition()
// openRecordModal()
// doRecognition
// doRecognition(targetWord) {