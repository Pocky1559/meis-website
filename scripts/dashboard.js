import { supabase } from "./supabase-cilent.js";
import * as checkAuth from "./login/check-auth.js";

const formError = document.getElementById('formError');
if (formError) { formError.textContent = ''; formError.classList.remove('visible'); }

const studentId = document.getElementById('studentId');
const studentFirstName = document.getElementById('studentFirstName');
const studentLastName = document.getElementById('studentLastName');
const studentClass = document.getElementById('studentClass');
const studentNumber = document.getElementById('studentNumber');
const teacherAvatar = document.getElementById('teacher-avatar');
const teacherName = document.getElementById('teacher-name');

init();

document.getElementById('logout-btn').addEventListener('click', async function() {
    await supabase.auth.signOut();
    window.location.href = '/login/';
});

async function init() {
    studentId.textContent = 'กำลังโหลดข้อมูล...';
    studentFirstName.textContent = 'กำลังโหลดข้อมูล...';
    studentLastName.textContent = 'กำลังโหลดข้อมูล...';
    studentClass.textContent = 'กำลังโหลดข้อมูล...';
    studentNumber.textContent = 'กำลังโหลดข้อมูล...';
    teacherName.textContent = 'กำลังโหลดข้อมูล...';
    
    // Load user data
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = '/login/';
        return;
    }

    const { data, error } = await supabase
        .from('user_info')
        .select('*')

    
    if (error) {
        formError.textContent = 'เกิดข้อผิดพลาด โปรดติดต่อแอดมิน: ' + error.message;
        formError.classList.add('visible');
        studentId.textContent = 'เกิดข้อผิดพลาด';
        studentFirstName.textContent = 'เกิดข้อผิดพลาด';
        studentLastName.textContent = 'เกิดข้อผิดพลาด';
        studentClass.textContent = 'เกิดข้อผิดพลาด';
        studentNumber.textContent = 'เกิดข้อผิดพลาด';
        teacherName.textContent = 'เกิดข้อผิดพลาด';
        return;
    }

    studentId.textContent = data[0].student_id;
    studentFirstName.textContent = data[0].first_name;
    studentLastName.textContent = data[0].last_name;
    studentClass.textContent = data[0].class;
    studentNumber.textContent = data[0].number;

    if (data[0].is_match === false) {
        teacherName.textContent = 'กรุณากดจับคู่ เพื่อจับคู่คุณครู';
    } else {
        teacherName.textContent = data[0].matched_teacher;
    }
}