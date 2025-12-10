import { supabase } from "../supabase-cilent.js";

// Login function
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentEmail = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    console.log('Attempting login for:', studentEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: studentEmail,
        password: password
    });

    console.log(data, error);
});