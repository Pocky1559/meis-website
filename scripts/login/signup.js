import { supabase } from "../supabase-cilent.js";

// Login function
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentEmail = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    } else {
        
    }

    // console.log('Attempting login for:', studentEmail);

    // const { data, error } = await supabase.auth.signInWithPassword({
    //     email: studentEmail,
    //     password: password
    // });

    // if (error) {
    //     alert("Login failed: " + error.message);
    // } else {
    //     window.location.href = '/dashboard/';
    // }
});