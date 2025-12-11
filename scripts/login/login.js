import { supabase } from "../supabase-cilent.js";

// Login function
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const signInBtn = document.getElementById('login-btn');
    signInBtn.textContent = "กำลังเข้าสู่ระบบ..."
    
    const studentEmail = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    // const rememberMe = document.getElementById('rememberMe').checked;

    console.log('Attempting login for:', studentEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: studentEmail,
        password: password
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        window.location.href = '/dashboard/';
    }
});