let DATA = null;
let REVERSE_WORDS = {};

// Initialize application
async function init() {
    try {
        const response = await fetch('app/data.json');
        DATA = await response.json();
        
        // Build reverse lookup for word-to-number
        Object.entries(DATA.WORDS_0_TO_99).forEach(([key, val]) => {
            REVERSE_WORDS[val] = BigInt(key);
        });

        setupEventListeners();
        renderLegends();
        renderNumberWords();
    } catch (error) {
        console.error("Failed to load converter data:", error);
    }
}

function setupEventListeners() {
    const n2w = document.getElementById('numToWordInput');
    const w2n = document.getElementById('wordToNumInput');
    const n2s = document.getElementById('numToSanskritInput');

    n2w.addEventListener('input', () => {
        const val = banglaToEnglishDigits(n2w.value).replace(/[^0-9]/g, '');
        const resultEl = document.getElementById('numToWordResult');
        const copyBtn = document.getElementById('copyBtn1');
        
        if (!val) {
            resultEl.innerText = "অপেক্ষা করছি...";
            resultEl.classList.add('text-slate-400', 'italic');
            copyBtn.classList.add('hidden');
            return;
        }

        const result = numberToBanglaWords(val);
        resultEl.innerText = result;
        resultEl.classList.remove('text-slate-400', 'italic');
        copyBtn.classList.remove('hidden');
    });

    w2n.addEventListener('input', () => {
        const val = w2n.value;
        const resultEl = document.getElementById('wordToNumResult');
        const copyBtn = document.getElementById('copyBtn2');

        if (!val.trim()) {
            resultEl.innerText = "অপেক্ষা করছি...";
            resultEl.classList.add('text-slate-400', 'italic');
            copyBtn.classList.add('hidden');
            return;
        }

        const result = banglaWordsToNumber(val);
        if (result && result !== "0") {
            resultEl.innerText = englishToBanglaDigits(result);
            resultEl.classList.remove('text-slate-400', 'italic');
            copyBtn.classList.remove('hidden');
        } else {
            resultEl.innerHTML = "<a href=\"#numberToWordList\">অকার্যকর বানান, সঠিক বানান এর জন্য\nনিচের পূর্ণাঙ্গ তালিকাটি দেখুন।</a>";
        }
    });

    n2s.addEventListener('input', () => {
        const val = banglaToEnglishDigits(n2s.value).replace(/[^0-9]/g, '');
        const resultEl = document.getElementById('numToSanskritResult');
        const copyBtn = document.getElementById('copyBtn3');

        if (!val) {
            resultEl.innerText = "অপেক্ষা করছি...";
            resultEl.classList.add('text-slate-400', 'italic');
            copyBtn.classList.add('hidden');
            return;
        }

        const result = numberToSanskritWords(val);
        resultEl.innerText = result;
        resultEl.classList.remove('text-slate-400', 'italic');
        copyBtn.classList.remove('hidden');
    });

    // Copy buttons
    document.getElementById('copyBtn1').onclick = () => copyText('numToWordResult');
    document.getElementById('copyBtn2').onclick = () => copyText('wordToNumResult');
    document.getElementById('copyBtn3').onclick = () => copyText('numToSanskritResult');
}

// Logic: Number to Bangla Words
function numberToBanglaWords(numStr) {
    let n = BigInt(numStr);
    if (n === 0n) return DATA.WORDS_0_TO_99["0"];

    const KOTI = 10000000n;
    const LOKKHO = 100000n;
    const HAJAR = 1000n;
    const SHOTOK = 100n;

    function convert(val) {
        let result = "";
        if (val >= KOTI) {
            result += convert(val / KOTI) + " কোটি ";
            val %= KOTI;
        }
        if (val >= LOKKHO) {
            result += DATA.WORDS_0_TO_99[Number(val / LOKKHO).toString()] + " লক্ষ ";
            val %= LOKKHO;
        }
        if (val >= HAJAR) {
            result += DATA.WORDS_0_TO_99[Number(val / HAJAR).toString()] + " হাজার ";
            val %= HAJAR;
        }
        if (val >= SHOTOK) {
            result += DATA.WORDS_0_TO_99[Number(val / SHOTOK).toString()] + " শত ";
            val %= SHOTOK;
        }
        if (val > 0n) {
            result += DATA.WORDS_0_TO_99[Number(val).toString()];
        }
        return result.trim();
    }
    return convert(n).replace(/\s+/g, ' ');
}

// Logic: Word to Number (Fixed for massive recursive Koti)
function banglaWordsToNumber(words) {
    const clean = words.trim().replace(/[,।]/g, '').replace(/ এবং | ও /g, ' ').replace(/\s+/g, ' ');
    const tokens = clean.split(' ');
    
    let total = 0n;
    let temp = 0n;
    let hasValue = false;

    for (const token of tokens) {
        const numVal = REVERSE_WORDS[token];
        const unitValStr = DATA.UNIT_WORDS[token];
        const unitVal = unitValStr ? BigInt(unitValStr) : null;

        if (numVal !== undefined) {
            temp += numVal;
            hasValue = true;
        } else if (unitVal !== null) {
            if (unitVal === 10000000n) { // Koti
                if (!hasValue && total > 0n) {
                    total *= unitVal;
                } else {
                    total = (total + (temp || 1n)) * unitVal;
                }
                temp = 0n;
                hasValue = false;
            } else {
                total += (temp || 1n) * unitVal;
                temp = 0n;
                hasValue = false;
            }
        }
    }
    return (total + temp).toString();
}

function numberToSanskritWords(numStr) {
    let n = BigInt(numStr);
    if (n === 0n) return DATA.WORDS_0_TO_99["0"];

    let result = [];
    let remaining = n;

    for (const unit of DATA.SANSKRIT_UNITS) {
        const unitVal = BigInt(unit.value);
        if (remaining >= unitVal) {
            let count = remaining / unitVal;
            result.push(`${numberToBanglaWords(count.toString())} ${unit.label}`);
            remaining %= unitVal;
        }
    }

    if (remaining > 0n) {
        result.push(DATA.WORDS_0_TO_99[Number(remaining).toString()]);
    }

    return result.join(' ').replace(/\s+/g, ' ').trim();
}

// Digit Conversion Helpers
function englishToBanglaDigits(str) {
    return str.split('').map(c => {
        const idx = DATA.ENGLISH_NUMBERS.indexOf(c);
        return idx !== -1 ? DATA.BANGLA_NUMBERS[idx] : c;
    }).join('');
}

function banglaToEnglishDigits(str) {
    return str.split('').map(c => {
        const idx = DATA.BANGLA_NUMBERS.indexOf(c);
        return idx !== -1 ? DATA.ENGLISH_NUMBERS[idx] : c;
    }).join('');
}

// UI Helpers
function clearField(id) {
    document.getElementById(id).value = '';
    document.getElementById(id).dispatchEvent(new Event('input'));
}

async function copyText(id) {
    const text = document.getElementById(id).innerText;
    if (text === "অপেক্ষা করছি...") return;
    await navigator.clipboard.writeText(text);
    const parent = document.getElementById(id).parentElement;
    parent.classList.add('copied-flash');
    setTimeout(() => parent.classList.remove('copied-flash'), 1000);
}

function renderLegends() {
    const standardEl = document.getElementById('standardLegend');
    const standardItems = [
        {l: 'একক', p: '১', d: '1'}, 
        {l: 'দশক', p: '১০', d: '10'}, 
        {l: 'শতক', p: '১০০', d: '10^2'}, 
        {l: 'হাজার', p: '১,০০০', d: '10^3'}, 
        {l: 'লক্ষ', p: '১,০০,০০০', d: '10^5'}, 
        {l: 'কোটি', p: '১,০০,০০,০০০', d: '10^7'}
    ];

    standardEl.innerHTML = standardItems.map(item => `
        <div class="legend-item p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center">
            <span class="font-bold text-emerald-800 text-lg">${item.l}</span>
            <span class="text-xs text-emerald-600 font-bold">${item.p}</span>
            <span class="text-[9px] text-slate-400 mt-1 uppercase">${item.d}</span>
        </div>
    `).join('');

    const sanskritEl = document.getElementById('sanskritLegend');
    sanskritEl.innerHTML = DATA.SANSKRIT_UNITS.slice(0, 12).map(unit => `
        <div class="legend-item p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
            <span class="font-bold text-slate-700 text-sm">${unit.label}</span>
            <span class="text-[10px] text-slate-500 font-mono">10^${unit.power}</span>
        </div>
    `).join('');
}

function renderNumberWords() {
    const gridEl = document.getElementById('numberWordsGrid');
    let html = '';
    
    // Render 1 to 99
    for(let i = 1; i <= 99; i++) {
        const banglaNum = englishToBanglaDigits(i.toString());
        const word = DATA.WORDS_0_TO_99[i.toString()];
        
        html += `
            <div class="number-word-card p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center hover:bg-blue-50 hover:border-blue-200 transition-all cursor-default">
                <span class="text-xs font-bold text-slate-400 mb-1">${banglaNum}</span>
                <span class="text-sm font-semibold text-slate-800">${word}</span>
            </div>
        `;
    }
    
    gridEl.innerHTML = html;
}

init();