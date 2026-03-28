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

// ===== INIT =====
checkSession();
