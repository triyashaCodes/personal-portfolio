'use strict';

// ─── Tab navigation ───

const tabs = document.querySelectorAll('.editor-tab');
const pages = document.querySelectorAll('.page');
const activityBtns = document.querySelectorAll('.activity-btn[data-activity]');
const breadcrumb = document.getElementById('breadcrumb-current');

function switchTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === tabName));
  activityBtns.forEach(b => b.classList.toggle('active', b.dataset.activity === tabName));
  if (breadcrumb) breadcrumb.textContent = tabName === 'terminal' ? 'terminal.sh' : tabName + '.md';
  generateLineNumbers();

  if (tabName === 'experience') setTimeout(animateTimeline, 80);
  if (tabName === 'terminal') setTimeout(() => termInput && termInput.focus(), 50);
}

tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
activityBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.activity)));

// ─── Line numbers ───

function generateLineNumbers() {
  const activePage = document.querySelector('.page.active:not(.page-terminal)');
  if (!activePage) return;
  const lnEl = activePage.querySelector('.line-numbers');
  if (!lnEl) return;
  const content = activePage.querySelector('.page-content');
  if (!content) return;
  const lineHeight = 24.5;
  const count = Math.max(Math.ceil(content.scrollHeight / lineHeight), 30);
  let html = '';
  for (let i = 1; i <= count; i++) {
    html += `<div style="padding:0 12px;line-height:${lineHeight}px">${i}</div>`;
  }
  lnEl.innerHTML = html;
}

// ─── Timeline animations ───

function animateTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const timeline = document.querySelector('.timeline');
  items.forEach(item => item.classList.remove('visible'));
  if (timeline) timeline.classList.remove('line-drawn');
  items.forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 90));
  if (timeline) setTimeout(() => timeline.classList.add('line-drawn'), 150);
}

// ─── Terminal ───

const termOutput = document.getElementById('terminalOutput');
const termInput  = document.getElementById('terminalInput');
const termHistory = [];
let historyIdx = -1;

const COMMANDS = {
  help: cmdHelp,
  whoami: cmdWhoami,
  'cat about.txt': cmdAbout,
  'cat experience.txt': cmdExperience,
  'ls projects/': cmdProjects,
  'ls projects': cmdProjects,
  skills: cmdSkills,
  social: cmdSocial,
  'open resume': cmdResume,
  './open-resume': cmdResume,
  clear: cmdClear,
  echo: cmdEcho,
};

function termPrint(text, cls = 'out') {
  const line = document.createElement('div');
  line.className = `term-line ${cls}`;
  line.textContent = text;
  termOutput.appendChild(line);
}

function termBlank() {
  const line = document.createElement('span');
  line.className = 'term-line blank';
  termOutput.appendChild(line);
}

function termScroll() {
  termOutput.scrollTop = termOutput.scrollHeight;
  const wrap = document.querySelector('.terminal-wrap');
  if (wrap) wrap.scrollTop = wrap.scrollHeight;
}

function runCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;

  termHistory.unshift(cmd);
  historyIdx = -1;

  // echo the command
  termPrint(cmd, 'cmd');

  // match
  const lower = cmd.toLowerCase();
  const echoMatch = lower.startsWith('echo ');

  if (echoMatch) {
    cmdEcho(cmd.slice(5));
  } else if (COMMANDS[lower]) {
    COMMANDS[lower]();
  } else {
    termPrint(`bash: ${cmd}: command not found`, 'err');
    termPrint(`type 'help' to see available commands`, 'dim');
  }
  termBlank();
  termScroll();
}

function cmdHelp() {
  termBlank();
  termPrint('Available commands:', 'teal');
  termBlank();
  const cmds = [
    ['whoami',              'who is this person'],
    ['cat about.txt',       'read the about section'],
    ['cat experience.txt',  'read full experience'],
    ['ls projects/',        'list projects'],
    ['skills',              'print tech stack'],
    ['social',              'show links'],
    ['open resume',         'open resume PDF'],
    ['clear',               'clear the terminal'],
    ['echo <text>',         'echo text back'],
  ];
  cmds.forEach(([name, desc]) => {
    termPrint(`  ${name.padEnd(24)}${desc}`, 'out');
  });
}

function cmdWhoami() {
  termBlank();
  termPrint('Triyasha Ghosh Dastidar', 'fn');
  termPrint('AI Engineer @ llmda · Santa Clara, CA', 'out');
  termPrint('Columbia MS CS · Ex-Nutanix · BITS Pilani', 'dim');
}

function cmdAbout() {
  termBlank();
  termPrint('# about.txt', 'accent');
  termBlank();
  termPrint('Teaching AI to read semiconductor documentation so humans don\'t have to.', 'out');
  termBlank();
  termPrint('Founding engineer at llmda, building multi-agent RAG systems for the chip', 'out');
  termPrint('design industry. Previously at Nutanix, where I shipped ML pipelines that', 'out');
  termPrint('cut OOM triage time by 50%. Columbia CS grad, forever curious about the gap', 'out');
  termPrint('between "it works in the notebook" and "it works in production."', 'out');
  termBlank();
  termPrint('Let\'s talk agentic systems, ML infra, or why your evals are lying to you.', 'dim');
}

function cmdExperience() {
  termBlank();
  const entries = [
    { date: 'Feb 2026 – Present', role: 'AI Engineer',                   org: 'llmda Inc',                       tag: '[current]' },
    { date: 'Sep 2025 – Dec 2025', role: 'ML Engineer Intern',           org: 'llmda Inc',                       tag: '[intern]'  },
    { date: 'May 2025 – Aug 2025', role: 'AI Software Engineer Intern',  org: 'Nutanix',                         tag: '[intern]'  },
    { date: 'Aug 2024 – Dec 2025', role: 'MS Computer Science',          org: 'Columbia University',              tag: '[edu]'     },
    { date: 'Jul 2022 – Jul 2024', role: 'Member of Technical Staff 2',  org: 'Nutanix',                         tag: '[work]'    },
    { date: 'Aug 2021 – Jun 2022', role: 'Software Development Intern',  org: 'Nutanix',                         tag: '[intern]'  },
    { date: 'Oct 2020 – Jan 2022', role: 'Research Intern',              org: 'AIISC, Univ. of South Carolina',  tag: '[research]'},
    { date: 'Aug 2017 – Jul 2022', role: 'B.E. CS + M.Sc. Chemistry',   org: 'BITS Pilani',                     tag: '[edu]'     },
  ];
  entries.forEach(e => {
    termPrint(`${e.tag.padEnd(12)} ${e.date.padEnd(24)} ${e.role} @ ${e.org}`, 'out');
  });
}

function cmdProjects() {
  termBlank();
  termPrint('projects/', 'fn');
  const projects = [
    'multi-agent-rag/      [llmda · production]',
    'memory-pipeline/      [Nutanix · 50% faster OOM triage]',
    'ai-security-rec/      [🏆 Nutanix hackathon winner]',
    'NextWordPrediction/   [LSTM + Attention]',
    'AutoPromptGenie/      [LLM prompt optimization]',
    'collab-filtering/     [recommender systems]',
  ];
  projects.forEach(p => termPrint(`  ${p}`, 'out'));
}

function cmdSkills() {
  termBlank();
  termPrint('languages   Python · Golang · C++ · JavaScript · Java', 'kw');
  termPrint('ai / ml     RAG · Multi-agent · PyTorch · XGBoost · BERT · RoBERTa', 'accent');
  termPrint('infra       AWS · GCP · Kubernetes · Docker · Prometheus · Grafana', 'teal');
  termPrint('data        SQL · BigQuery · Knowledge Graphs', 'fn');
}

function cmdSocial() {
  termBlank();
  termPrint('GitHub         github.com/triyashaCodes', 'out');
  termPrint('LinkedIn       linkedin.com/in/triyasha-gd', 'out');
  termPrint('Google Scholar scholar.google.com/citations?user=FaNgf2YAAAAJ', 'out');
  termPrint('Email          tg2936@columbia.edu', 'out');
}

function cmdResume() {
  termPrint('Opening resume.pdf...', 'teal');
  setTimeout(() => window.open('./assets/docs/Triyasha Ghosh Dastidar.pdf', '_blank'), 400);
}

function cmdClear() {
  termOutput.innerHTML = '';
}

function cmdEcho(text) {
  termPrint(text || '', 'out');
}

function termBoot() {
  termOutput.innerHTML = '';
  const lines = [
    { text: 'triyasha-portfolio v2.0 — shell ready', cls: 'teal' },
    { text: 'Type \'help\' for available commands.', cls: 'dim' },
  ];
  lines.forEach((l, i) => setTimeout(() => { termPrint(l.text, l.cls); termScroll(); }, i * 120));
}

if (termInput) {
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      runCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < termHistory.length - 1) {
        historyIdx++;
        termInput.value = termHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = termHistory[historyIdx];
      } else {
        historyIdx = -1;
        termInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // simple tab complete
      const partial = termInput.value.toLowerCase();
      const match = Object.keys(COMMANDS).find(k => k.startsWith(partial) && k !== partial);
      if (match) termInput.value = match;
    }
  });

  // click anywhere in terminal to focus
  document.querySelector('.page-terminal')?.addEventListener('click', () => termInput.focus());
}

// ─── Command Palette ───

const paletteOverlay = document.getElementById('paletteOverlay');
const paletteInput   = document.getElementById('paletteInput');
const paletteList    = document.getElementById('paletteList');
const paletteBtn     = document.getElementById('paletteBtn');

const PALETTE_ITEMS = [
  { icon: '◉', label: 'About',        hint: 'about.md',       action: () => switchTab('about') },
  { icon: '◈', label: 'Experience',   hint: 'experience.md',  action: () => switchTab('experience') },
  { icon: '<>', label: 'Projects',     hint: 'projects.md',    action: () => switchTab('projects') },
  { icon: '$_', label: 'Terminal',     hint: 'terminal.sh',    action: () => switchTab('terminal') },
  { icon: '↗', label: 'Open Resume',  hint: 'resume.pdf',     action: () => window.open('./assets/docs/Triyasha Ghosh Dastidar.pdf', '_blank') },
  { icon: '⌥', label: 'GitHub',       hint: 'github.com/triyashaCodes',        action: () => window.open('https://github.com/triyashaCodes', '_blank') },
  { icon: 'in', label: 'LinkedIn',    hint: 'linkedin.com/in/triyasha-gd',     action: () => window.open('http://linkedin.com/in/triyasha-gd/', '_blank') },
  { icon: '✉', label: 'Email',        hint: 'tg2936@columbia.edu',             action: () => location.href = 'mailto:tg2936@columbia.edu' },
];

let paletteSelected = 0;
let paletteFiltered = [...PALETTE_ITEMS];

function openPalette() {
  paletteOverlay.classList.add('open');
  paletteInput.value = '';
  paletteSelected = 0;
  renderPalette('');
  setTimeout(() => paletteInput.focus(), 30);
}

function closePalette() {
  paletteOverlay.classList.remove('open');
}

function renderPalette(query) {
  const q = query.toLowerCase();
  paletteFiltered = PALETTE_ITEMS.filter(item =>
    item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
  );

  if (!paletteFiltered.length) {
    paletteList.innerHTML = `<li class="palette-empty">No commands found</li>`;
    return;
  }

  paletteList.innerHTML = paletteFiltered.map((item, i) => `
    <li class="palette-item ${i === paletteSelected ? 'selected' : ''}" data-idx="${i}">
      <div class="palette-item-icon">${item.icon}</div>
      <div class="palette-item-label">
        <strong>${item.label}</strong>
        <span>${item.hint}</span>
      </div>
      <span class="palette-item-hint">↵</span>
    </li>
  `).join('');

  paletteList.querySelectorAll('.palette-item').forEach(el => {
    el.addEventListener('click', () => {
      paletteFiltered[+el.dataset.idx].action();
      closePalette();
    });
    el.addEventListener('mouseenter', () => {
      paletteSelected = +el.dataset.idx;
      renderPalette(paletteInput.value);
    });
  });
}

paletteInput?.addEventListener('input', e => {
  paletteSelected = 0;
  renderPalette(e.target.value);
});

paletteInput?.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePalette(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); paletteSelected = Math.min(paletteSelected + 1, paletteFiltered.length - 1); renderPalette(paletteInput.value); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); paletteSelected = Math.max(paletteSelected - 1, 0); renderPalette(paletteInput.value); }
  if (e.key === 'Enter' && paletteFiltered[paletteSelected]) {
    paletteFiltered[paletteSelected].action();
    closePalette();
  }
});

paletteOverlay?.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
paletteBtn?.addEventListener('click', openPalette);

// ⌘K / Ctrl+K
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    paletteOverlay.classList.contains('open') ? closePalette() : openPalette();
  }
  if (e.key === 'Escape' && paletteOverlay?.classList.contains('open')) closePalette();
});

// ─── Init ───

window.addEventListener('load', () => {
  generateLineNumbers();
  termBoot();
});
