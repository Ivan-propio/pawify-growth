// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://krjpjmaziqbezjqhivvg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyanBqbWF6aXFiZXpqcWhpdnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTM5ODYsImV4cCI6MjA3NjE2OTk4Nn0.6giX13BDuzYFrN9gSL6nGXL--ftLHmEqVJyYLcIp7-s';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ===== STATE =====
let leads = [];
let filteredLeads = [];
let currentPage = 1;
const PAGE_SIZE = 25;
let sortCol = 'shelter_name';
let sortDir = 'asc';
let emailLang = 'es';
let emailTouch = 'touch1';

// ===== AUTH =====
async function checkSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        showApp(session.user);
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('loginError');

    btn.textContent = 'Entrando...';
    btn.disabled = true;
    errEl.textContent = '';

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        errEl.textContent = error.message;
        btn.textContent = 'Entrar';
        btn.disabled = false;
        return;
    }

    showApp(data.user);
}

async function handleLogout() {
    await sb.auth.signOut();
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
}

function showApp(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    document.getElementById('userInfo').textContent = user.email;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    loadLeads();
}

// ===== LOAD LEADS FROM SUPABASE =====
async function loadLeads() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '<tr><td colspan="10" class="loading"><div class="spinner"></div> Loading leads...</td></tr>';

    const { data, error } = await sb.from('outreach_shelters').select('*').order('shelter_name');

    if (error) {
        console.error('Supabase error:', error);
        toast('Error loading leads: ' + error.message, 'error');
        leads = [];
    } else {
        leads = data || [];
    }

    refreshAll();
    toast(`${leads.length} leads loaded from Supabase`, 'success');
}

// ===== SAVE LEAD =====
async function saveLead() {
    const name = document.getElementById('f_name').value.trim();
    const email = document.getElementById('f_email').value.trim();
    if (!name || !email) { toast('Name and email required', 'error'); return; }

    const lead = {
        shelter_name: name,
        email: email,
        country: document.getElementById('f_country').value.trim(),
        city: document.getElementById('f_city').value.trim(),
        phone: document.getElementById('f_phone').value.trim(),
        website: document.getElementById('f_website').value.trim(),
        status: document.getElementById('f_status').value,
        animal_types: document.getElementById('f_animal_types').value,
        notes: document.getElementById('f_notes').value.trim(),
    };

    const editId = document.getElementById('editId').value;

    if (editId) {
        // Update existing
        const { error } = await sb.from('outreach_shelters').update(lead).eq('id', editId);
        if (error) { toast('Error: ' + error.message, 'error'); return; }
        toast('Lead updated', 'success');
    } else {
        // Insert new
        lead.date_added = new Date().toISOString().slice(0, 10);
        lead.source = 'manual';
        const { error } = await sb.from('outreach_shelters').insert(lead);
        if (error) { toast('Error: ' + error.message, 'error'); return; }
        toast('Lead added', 'success');
    }

    closeModal();
    loadLeads();
}

async function deleteLead() {
    const editId = document.getElementById('editId').value;
    if (!editId || !confirm('Delete this lead?')) return;

    const { error } = await sb.from('outreach_shelters').delete().eq('id', editId);
    if (error) { toast('Error: ' + error.message, 'error'); return; }

    closeModal();
    loadLeads();
    toast('Lead deleted', 'success');
}

// ===== EXPORT CSV =====
function exportCSV() {
    const data = filteredLeads.length > 0 && filteredLeads.length !== leads.length ? filteredLeads : leads;
    const headers = ['shelter_name','country','city','email','phone','website','animal_types','status','date_added','last_contacted','notes'];
    const lines = [headers.join(',')];
    data.forEach(row => {
        lines.push(headers.map(h => `"${(row[h] || '').toString().replace(/"/g,'""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawify_leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${data.length} leads`, 'success');
}

// ===== TABS =====
function switchTab(tab, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'emails') renderEmailPreview();
    if (tab === 'social') initSocialMedia();
}

// ===== EMAIL PREVIEW =====
function setLang(lang, btn) {
    emailLang = lang;
    document.querySelectorAll('#langPills .email-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderEmailPreview();
}

function setTouch(touch, el) {
    emailTouch = touch;
    document.querySelectorAll('.seq-step').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    renderEmailPreview();
}

function renderEmailPreview() {
    const name = document.getElementById('previewName').value || 'Shelter Name';
    const city = document.getElementById('previewCity').value || 'your city';
    const templates = EMAIL_TEMPLATES[emailLang] || EMAIL_TEMPLATES.en;
    const tpl = templates[emailTouch] || templates.touch1;

    const subject = tpl.subject.replace(/\{name\}/g, name).replace(/\{city\}/g, city);
    const html = tpl.html.replace(/\{name\}/g, name).replace(/\{city\}/g, city);

    document.getElementById('emailSubject').textContent = subject;
    document.getElementById('emailTo').textContent = name.toLowerCase().replace(/\s+/g, '') + '@ejemplo.com';

    const touchLabels = { touch1: 'Touch 1 — Initial', touch2: 'Touch 2 — Follow-up', touch3: 'Touch 3 — Final' };
    document.getElementById('emailTouchBadge').textContent = touchLabels[emailTouch];

    const container = document.getElementById('emailBody');
    container.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '450px';
    container.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:16px;font-family:Arial,sans-serif;">' + html + '</body></html>');
    doc.close();
    setTimeout(() => { iframe.style.height = (doc.body.scrollHeight + 40) + 'px'; }, 150);
}

// ===== FILTERS =====
function populateFilters() {
    const countries = [...new Set(leads.map(l => l.country).filter(Boolean))].sort();
    const statuses = [...new Set(leads.map(l => l.status).filter(Boolean))].sort();

    const cf = document.getElementById('countryFilter');
    cf.innerHTML = '<option value="">All Countries</option>' + countries.map(c => `<option value="${c}">${c}</option>`).join('');
    const sf = document.getElementById('statusFilter');
    sf.innerHTML = '<option value="">All Statuses</option>' + statuses.map(s => `<option value="${s}">${formatStatus(s)}</option>`).join('');
}

function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const country = document.getElementById('countryFilter').value;
    const status = document.getElementById('statusFilter').value;

    filteredLeads = leads.filter(l => {
        if (country && l.country !== country) return false;
        if (status && l.status !== status) return false;
        if (search) {
            const haystack = [l.shelter_name, l.email, l.city, l.country, l.website, l.notes].join(' ').toLowerCase();
            if (!haystack.includes(search)) return false;
        }
        return true;
    });

    filteredLeads.sort((a, b) => {
        const va = (a[sortCol] || '').toString().toLowerCase();
        const vb = (b[sortCol] || '').toString().toLowerCase();
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    currentPage = 1;
    renderTable();
    document.getElementById('filteredCount').textContent = `(${filteredLeads.length} of ${leads.length})`;
}

// ===== KPIs =====
function renderKPIs() {
    const total = leads.length;
    const byStatus = {};
    leads.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
    const countries = new Set(leads.map(l => l.country).filter(Boolean)).size;
    const withEmail = leads.filter(l => l.email && l.email.includes('@')).length;

    document.getElementById('kpiGrid').innerHTML = `
        <div class="kpi-card"><div class="kpi-label">Total Leads</div><div class="kpi-value">${total}</div><div class="kpi-sub">${countries} countries</div></div>
        <div class="kpi-card green"><div class="kpi-label">With Email</div><div class="kpi-value">${withEmail}</div><div class="kpi-sub">${total > 0 ? Math.round(withEmail/total*100) : 0}%</div></div>
        <div class="kpi-card orange"><div class="kpi-label">Contacted</div><div class="kpi-value">${byStatus['contacted'] || 0}</div><div class="kpi-sub">${total > 0 ? Math.round((byStatus['contacted']||0)/total*100) : 0}%</div></div>
        <div class="kpi-card blue"><div class="kpi-label">New</div><div class="kpi-value">${byStatus['new'] || 0}</div><div class="kpi-sub">Ready to contact</div></div>
        <div class="kpi-card purple"><div class="kpi-label">Replied</div><div class="kpi-value">${(byStatus['replied']||0)+(byStatus['interested']||0)}</div><div class="kpi-sub">Interested: ${byStatus['interested']||0}</div></div>
        <div class="kpi-card green"><div class="kpi-label">Joined</div><div class="kpi-value">${byStatus['joined_pawify'] || 0}</div><div class="kpi-sub">${total > 0 ? Math.round((byStatus['joined_pawify']||0)/total*100) : 0}%</div></div>
    `;
}

// ===== FUNNEL =====
function renderFunnel() {
    const statuses = ['new','researching','contacted','follow_up_needed','replied','interested','onboarding','joined_pawify'];
    const colors = ['#3b82f6','#6366f1','#f59e0b','#fb923c','#10b981','#8b5cf6','#c084fc','#00B4B4'];
    const byStatus = {};
    leads.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
    const max = Math.max(...statuses.map(s => byStatus[s] || 0), 1);

    document.getElementById('funnelChart').innerHTML = statuses.map((s, i) => {
        const count = byStatus[s] || 0;
        const pct = Math.max((count / max) * 100, count > 0 ? 8 : 0);
        return `<div class="funnel-step"><div class="funnel-label">${formatStatus(s)}</div><div class="funnel-bar-wrap"><div class="funnel-bar" style="width:${pct}%;background:${colors[i]}">${count}</div></div></div>`;
    }).join('');
}

// ===== COUNTRY CHART =====
function renderCountryChart() {
    const byCountry = {};
    const flags = { 'Espana':'\u{1F1EA}\u{1F1F8}','España':'\u{1F1EA}\u{1F1F8}','Mexico':'\u{1F1F2}\u{1F1FD}','México':'\u{1F1F2}\u{1F1FD}','Argentina':'\u{1F1E6}\u{1F1F7}','Colombia':'\u{1F1E8}\u{1F1F4}','Chile':'\u{1F1E8}\u{1F1F1}','France':'\u{1F1EB}\u{1F1F7}','Portugal':'\u{1F1F5}\u{1F1F9}','Peru':'\u{1F1F5}\u{1F1EA}','Ecuador':'\u{1F1EA}\u{1F1E8}','Uruguay':'\u{1F1FA}\u{1F1FE}','Costa Rica':'\u{1F1E8}\u{1F1F7}' };
    leads.forEach(l => { if (l.country) byCountry[l.country] = (byCountry[l.country] || 0) + 1; });
    const sorted = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    document.getElementById('countryChart').innerHTML = sorted.map(([country, count]) => {
        const pct = (count / max) * 100;
        const flag = flags[country] || '\u{1F30D}';
        return `<div class="country-row"><div class="country-flag">${flag}</div><div class="country-name">${country}</div><div class="country-bar-wrap"><div class="country-bar" style="width:${pct}%">${count}</div></div></div>`;
    }).join('');
}

// ===== TABLE =====
const COLUMNS = [
    { key: 'shelter_name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
    { key: 'status', label: 'Status' },
    { key: 'date_added', label: 'Added' },
    { key: 'last_contacted', label: 'Last Contact' },
];

function renderTableHead() {
    document.getElementById('tableHead').innerHTML = COLUMNS.map(c => {
        const isActive = sortCol === c.key;
        const icon = isActive ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : '\u21C5';
        return `<th class="${isActive ? 'active' : ''}" onclick="toggleSort('${c.key}')">${c.label} <span class="sort-icon">${icon}</span></th>`;
    }).join('') + '<th></th>';
}

function renderTable() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filteredLeads.slice(start, start + PAGE_SIZE);
    const tbody = document.getElementById('tableBody');

    if (page.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--gray);">No leads found.</td></tr>';
    } else {
        tbody.innerHTML = page.map(lead => {
            return `<tr>
                <td><strong>${esc(lead.shelter_name)}</strong></td>
                <td>${esc(lead.country)}</td>
                <td>${esc(lead.city)}</td>
                <td><a class="email-link" href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td>
                <td>${esc(lead.phone)}</td>
                <td>${lead.website ? `<a href="${esc(lead.website)}" target="_blank" class="email-link">${esc(lead.website).replace(/https?:\/\//,'').slice(0,25)}</a>` : ''}</td>
                <td><span class="status-badge status-${lead.status}">${formatStatus(lead.status)}</span></td>
                <td>${esc(lead.date_added)}</td>
                <td>${esc(lead.last_contacted)}</td>
                <td><button class="btn btn-small btn-ghost" onclick='editLead(${JSON.stringify(lead.id)})'>Edit</button></td>
            </tr>`;
        }).join('');
    }

    renderPagination();
    document.getElementById('tableInfo').textContent = `${start+1}-${Math.min(start+PAGE_SIZE, filteredLeads.length)} of ${filteredLeads.length}`;
}

function renderPagination() {
    const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
    const container = document.getElementById('pagination');
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = '';
    if (currentPage > 1) html += `<button onclick="goPage(${currentPage-1})">\u2039</button>`;
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) {
            html += `<button class="${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
        } else if (Math.abs(p - currentPage) === 3) {
            html += `<button disabled>\u2026</button>`;
        }
    }
    if (currentPage < totalPages) html += `<button onclick="goPage(${currentPage+1})">\u203A</button>`;
    container.innerHTML = html;
}

function goPage(p) { currentPage = p; renderTable(); }
function toggleSort(col) {
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = 'asc'; }
    renderTableHead();
    applyFilters();
}

// ===== MODAL =====
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Lead';
    document.getElementById('editId').value = '';
    document.getElementById('deleteBtn').style.display = 'none';
    clearForm();
    document.getElementById('f_country').value = 'España';
    document.getElementById('f_status').value = 'new';
    document.getElementById('leadModal').classList.add('show');
}

function editLead(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    document.getElementById('modalTitle').textContent = 'Edit Lead';
    document.getElementById('editId').value = id;
    document.getElementById('deleteBtn').style.display = 'inline-flex';
    document.getElementById('f_name').value = lead.shelter_name || '';
    document.getElementById('f_email').value = lead.email || '';
    document.getElementById('f_country').value = lead.country || '';
    document.getElementById('f_city').value = lead.city || '';
    document.getElementById('f_phone').value = lead.phone || '';
    document.getElementById('f_website').value = lead.website || '';
    document.getElementById('f_animal_types').value = lead.animal_types || 'all';
    document.getElementById('f_status').value = lead.status || 'new';
    document.getElementById('f_notes').value = lead.notes || '';
    document.getElementById('leadModal').classList.add('show');
}

function closeModal() { document.getElementById('leadModal').classList.remove('show'); }
function clearForm() {
    ['f_name','f_email','f_country','f_city','f_phone','f_website','f_notes'].forEach(id => document.getElementById(id).value = '');
}

// ===== HELPERS =====
function formatStatus(s) {
    const map = { 'new':'New','researching':'Researching','contacted':'Contacted','follow_up_needed':'Follow-up','replied':'Replied','interested':'Interested','onboarding':'Onboarding','joined_pawify':'Joined','not_interested':'Not Interested' };
    return map[s] || s || '';
}

function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function toast(msg, type='') {
    const container = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function refreshAll() {
    populateFilters();
    renderKPIs();
    renderFunnel();
    renderCountryChart();
    renderTableHead();
    applyFilters();
}

// ===== EVENTS =====
document.getElementById('leadModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'n' && e.ctrlKey) { e.preventDefault(); openAddModal(); }
});

// ===== SOCIAL MEDIA =====
let smPosts = JSON.parse(localStorage.getItem('pawify_sm_posts') || '[]');
let smCalDate = new Date();
let smInitialized = false;

function saveSMData() {
    localStorage.setItem('pawify_sm_posts', JSON.stringify(smPosts));
}

function initSocialMedia() {
    updateSMKPIs();
    renderSMCalendar();
    renderSMPosts();
    if (!smInitialized) {
        const textarea = document.getElementById('smComposerText');
        if (textarea) {
            textarea.addEventListener('input', updateComposerPreview);
        }
        smInitialized = true;
    }
}

function switchSMSub(sub, btn) {
    document.querySelectorAll('.sm-subnav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sm-sub-content').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const el = document.getElementById('sm-' + sub);
    if (el) el.classList.add('active');
    if (sub === 'calendar') renderSMCalendar();
    if (sub === 'posts') renderSMPosts();
}

function updateSMKPIs() {
    const byStatus = { draft: 0, scheduled: 0, published: 0 };
    smPosts.forEach(p => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
    const el = (id) => document.getElementById(id);
    if (el('smScheduled')) el('smScheduled').textContent = byStatus.scheduled;
    if (el('smFollowers')) el('smFollowers').textContent = '0';
    if (el('smViews')) el('smViews').textContent = '0';
    if (el('smLikes')) el('smLikes').textContent = '0';
    if (el('smComments')) el('smComments').textContent = '0';
    if (el('smDms')) el('smDms').textContent = '0';
}

// --- Composer ---
function updateComposerPreview() {
    const text = document.getElementById('smComposerText').value;
    const captionEl = document.getElementById('smPreviewCaption');
    if (captionEl) {
        captionEl.innerHTML = '<strong>pawify.dev</strong> <span class="sm-phone-text">' + (text || 'Your caption will appear here...') + '</span>';
    }
}

function handleSMMedia(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('smMediaPreview');
        const placeholder = document.getElementById('smMediaPlaceholder');
        const phoneImg = document.getElementById('smPreviewImage');
        if (file.type.startsWith('image/')) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="preview">';
            if (phoneImg) phoneImg.innerHTML = '<img src="' + e.target.result + '" alt="preview">';
        } else {
            preview.innerHTML = '<p>Video selected: ' + file.name + '</p>';
        }
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function saveSMDraft() {
    const title = document.getElementById('smComposerText').value.trim();
    if (!title) { toast('Write something first', 'error'); return; }
    const platforms = [];
    document.querySelectorAll('.sm-platform-check input:checked').forEach(cb => platforms.push(cb.value));
    if (platforms.length === 0) { toast('Select at least one platform', 'error'); return; }

    const post = {
        id: Date.now(),
        text: title,
        platforms: platforms,
        hashtags: document.getElementById('smComposerHashtags').value.trim(),
        date: document.getElementById('smScheduleDate').value || null,
        status: 'draft',
        created: new Date().toISOString()
    };
    smPosts.push(post);
    saveSMData();
    updateSMKPIs();
    document.getElementById('smComposerText').value = '';
    document.getElementById('smComposerHashtags').value = '';
    document.getElementById('smScheduleDate').value = '';
    updateComposerPreview();
    toast('Draft saved', 'success');
}

function scheduleSMPost() {
    const title = document.getElementById('smComposerText').value.trim();
    const dateVal = document.getElementById('smScheduleDate').value;
    if (!title) { toast('Write something first', 'error'); return; }
    if (!dateVal) { toast('Select a date and time to schedule', 'error'); return; }
    const platforms = [];
    document.querySelectorAll('.sm-platform-check input:checked').forEach(cb => platforms.push(cb.value));
    if (platforms.length === 0) { toast('Select at least one platform', 'error'); return; }

    const post = {
        id: Date.now(),
        text: title,
        platforms: platforms,
        hashtags: document.getElementById('smComposerHashtags').value.trim(),
        date: dateVal,
        status: 'scheduled',
        created: new Date().toISOString()
    };
    smPosts.push(post);
    saveSMData();
    updateSMKPIs();
    document.getElementById('smComposerText').value = '';
    document.getElementById('smComposerHashtags').value = '';
    document.getElementById('smScheduleDate').value = '';
    updateComposerPreview();
    toast('Post scheduled!', 'success');
}

// --- Calendar ---
function renderSMCalendar() {
    const titleEl = document.getElementById('smCalTitle');
    const bodyEl = document.getElementById('smCalBody');
    if (!titleEl || !bodyEl) return;

    const year = smCalDate.getFullYear();
    const month = smCalDate.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    titleEl.textContent = monthNames[month] + ' ' + year;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    let html = '';
    // Previous month padding
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += '<div class="sm-cal-cell other-month"><div class="sm-cal-day-num">' + (prevLast - i) + '</div></div>';
    }
    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const isToday = dateStr === todayStr;
        const dayPosts = smPosts.filter(p => p.date && p.date.startsWith(dateStr));
        let postsHtml = dayPosts.map(p => '<div class="sm-cal-post ' + p.status + '" title="' + p.text.substring(0, 50) + '">' + p.platforms.join(', ') + '</div>').join('');
        html += '<div class="sm-cal-cell' + (isToday ? ' today' : '') + '"><div class="sm-cal-day-num">' + d + '</div>' + postsHtml + '</div>';
    }
    // Next month padding
    const totalCells = startDay + lastDay.getDate();
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        html += '<div class="sm-cal-cell other-month"><div class="sm-cal-day-num">' + i + '</div></div>';
    }
    bodyEl.innerHTML = html;
}

function smCalPrev() { smCalDate.setMonth(smCalDate.getMonth() - 1); renderSMCalendar(); }
function smCalNext() { smCalDate.setMonth(smCalDate.getMonth() + 1); renderSMCalendar(); }

// --- Posts List ---
function renderSMPosts() {
    const listEl = document.getElementById('smPostsList');
    if (!listEl) return;

    const statusFilter = document.getElementById('smPostFilter')?.value || 'all';
    const platformFilter = document.getElementById('smPlatformFilter')?.value || 'all';

    let filtered = smPosts.filter(p => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (platformFilter !== 'all' && !p.platforms.includes(platformFilter)) return false;
        return true;
    });

    filtered.sort((a, b) => new Date(b.created) - new Date(a.created));

    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="sm-empty-state"><span>&#x1F4DD;</span><p>No posts yet. Create your first post in the <a href="#" onclick="switchSMSub(\'composer\', document.querySelector(\'[onclick*=composer]\'));return false;">Composer</a>.</p></div>';
        return;
    }

    listEl.innerHTML = filtered.map(p => {
        const platformBadges = p.platforms.map(pl => '<span class="sm-platform-badge ' + pl + '">' + pl.charAt(0).toUpperCase() + pl.slice(1) + '</span>').join(' ');
        const dateStr = p.date ? new Date(p.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date';
        return '<div class="sm-post-item">' +
            '<div>' + platformBadges + '</div>' +
            '<div class="sm-post-content"><div class="sm-post-title">' + p.text.substring(0, 80) + '</div><div class="sm-post-date">' + dateStr + '</div></div>' +
            '<span class="sm-post-status ' + p.status + '">' + p.status + '</span>' +
            '<div class="sm-post-actions">' +
                '<button class="btn btn-ghost btn-small" onclick="editSMPost(' + p.id + ')">Edit</button>' +
                '<button class="btn btn-ghost btn-small" onclick="deleteSMPost(' + p.id + ')">Del</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function editSMPost(id) {
    const post = smPosts.find(p => p.id === id);
    if (!post) return;
    switchSMSub('composer', document.querySelector('[onclick*=composer]'));
    document.getElementById('smComposerText').value = post.text;
    document.getElementById('smComposerHashtags').value = post.hashtags || '';
    if (post.date) document.getElementById('smScheduleDate').value = post.date;
    document.querySelectorAll('.sm-platform-check input').forEach(cb => {
        cb.checked = post.platforms.includes(cb.value);
    });
    updateComposerPreview();
    // Remove original so re-saving creates updated version
    smPosts = smPosts.filter(p => p.id !== id);
    saveSMData();
}

function deleteSMPost(id) {
    if (!confirm('Delete this post?')) return;
    smPosts = smPosts.filter(p => p.id !== id);
    saveSMData();
    updateSMKPIs();
    renderSMPosts();
    renderSMCalendar();
    toast('Post deleted', 'success');
}

// ===== INIT =====
checkSession();
