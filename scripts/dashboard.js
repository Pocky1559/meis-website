const formError = document.getElementById('formError');
if (formError) { formError.textContent = ''; formError.classList.remove('visible'); }

// Placeholder user; replace with real auth logic (e.g. Supabase) later
const user = window.__CURRENT_USER || { id: 'local-placeholder' };

async function loadUserInfo() {
    const raw = localStorage.getItem(`user_info_${user.id}`);
    if (!raw) {
        return;
    }

    let data;
    try { data = JSON.parse(raw); } catch (e) { return; }

    const el = id => document.getElementById(id);
    if (el('studentId')) el('studentId').value = data.student_id ?? '';
    if (el('studentFirstName')) el('studentFirstName').value = data.first_name ?? '';
    if (el('studentLastName')) el('studentLastName').value = data.last_name ?? '';
    if (el('studentClass')) el('studentClass').value = data.class ?? '';
    if (el('studentNumber')) el('studentNumber').value = data.number ?? '';
}

await loadUserInfo();

const accountForm = document.getElementById('accountForm');
if (accountForm) {
    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updateBtn = document.getElementById('update-btn');
        const originalText = updateBtn ? updateBtn.textContent : '';
        if (updateBtn) updateBtn.textContent = 'กำลังบันทึก...';

        const payload = {
            student_id: document.getElementById('studentId')?.value ?? '',
            first_name: document.getElementById('studentFirstName')?.value ?? '',
            last_name: document.getElementById('studentLastName')?.value ?? '',
            class: document.getElementById('studentClass')?.value ?? '',
            number: document.getElementById('studentNumber')?.value ?? ''
        };

        try {
            localStorage.setItem(`user_info_${user.id}`, JSON.stringify(payload));
        } catch (err) {
            if (formError) { formError.textContent = 'เกิดข้อผิดพลาด: ' + err.message; formError.classList.add('visible'); }
            if (updateBtn) updateBtn.textContent = originalText;
            return;
        }

        if (updateBtn) updateBtn.textContent = 'บันทึกแล้ว';
        setTimeout(() => { if (updateBtn) updateBtn.textContent = originalText; }, 1500);
    });
}

const signOutBtn = document.getElementById('sign-out-button');
if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
        try { delete window.__CURRENT_USER; } catch (e) {}
        window.location.href = '/login/';
    });
}

const useMatching = document.getElementById('use-matching');
if (useMatching) {
    useMatching.addEventListener('click', () => {
        window.location.href = '/';
    });
}
