import { supabase } from "../supabase-cilent.js";

// Login function
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const signUpBtn = document.getElementById('signup-btn');
    const originalBtnText = signUpBtn.textContent;

    const formError = document.getElementById('formError');
    if (formError) { formError.textContent = ''; formError.classList.remove('visible'); }
    
    const studentEmail = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;

    if (password !== confirmPassword) {
        formError.textContent = 'รหัสผ่านไม่ตรงกัน';
        formError.classList.add('visible');
        return;
    } else {
        signUpBtn.textContent = "กำลังสมัครบัญชี...";

        const { error } = await supabase.auth.signUp({
            email: studentEmail,
            password: password
        })

        if (error) {
            if (error.message == "User already registered") {
                formError.textContent = 'อีเมลนี้ถูกใช้งานแล้ว';
            } 
            else {
                formError.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
            }
            formError.classList.add('visible');
            signUpBtn.textContent = originalBtnText;
            return;
        } 
        
        else {
            window.location.href = '/login/setup-user.html';
        }
    }
});

// Password show/hide toggles
function initPasswordToggles() {
    const containers = document.querySelectorAll('.toggle-password-container');
    containers.forEach(container => {
        const btn = container.querySelector('.toggle-password');
        const checkbox = container.querySelector('.toggle-password-checkbox');
        if (!btn || !checkbox) return;
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        if (btn.dataset._hasListener) return;

        function updateVisibility(show) {
            if (show) {
                input.type = 'text';
                btn.textContent = 'ซ่อนรหัสผ่าน';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                input.type = 'password';
                btn.textContent = 'แสดงรหัสผ่าน';
                btn.setAttribute('aria-pressed', 'false');
            }
            checkbox.checked = show;
            input.focus();
        }

        checkbox.addEventListener('change', () => updateVisibility(checkbox.checked));
        btn.addEventListener('click', () => updateVisibility(!checkbox.checked));
        btn.dataset._hasListener = '1';
    });
}

initPasswordToggles();