import { supabase } from '../supabase-cilent.js';
import * as checkAuth from './check-auth.js';

const formError = document.getElementById('formError');
if (formError) { formError.textContent = ''; formError.classList.remove('visible'); }

// const userLoggedIn = await checkAuth.checkIfUserAlreadyLoggedIn(formError);
// if (!userLoggedIn) { window.location.href = '/'; }

document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const setupBtn = document.getElementById('setup-btn');
    const originalBtnText = setupBtn.textContent;
    setupBtn.textContent = "กำลังบันทึกข้อมูล...";
    
    const studentId = document.getElementById('studentId').value;
    const studentFirstName = document.getElementById('studentFirstName').value;
    const studentLastName = document.getElementById('studentLastName').value;
    const studentClass = document.getElementById('studentClass').value;
    const studentNumber = document.getElementById('studentNumber').value;

    const { error } = await supabase
        .from('user_info')
        .insert([
            {
                student_id: studentId,
                first_name: studentFirstName,
                last_name: studentLastName,
                class: studentClass,
                number: studentNumber
            }
        ]);

    if (error) {
        formError.textContent = 'เกิดข้อผิดพลาด โปรดติดต่อแอดมิน: ' + error.message;
        formError.classList.add('visible');
        setupBtn.textContent = originalBtnText;
        return;
    } else {
        window.location.href = '/dashboard/';
    }
});