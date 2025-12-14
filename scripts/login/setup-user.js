import { supabase } from '../supabase-cilent.js';

document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const studentFirstName = document.getElementById('studentFirstName').value;
    const studentLastName = document.getElementById('studentLastName').value;
    const studentClass = document.getElementById('studentClass').value;
    const studentNumber = document.getElementById('studentNumber').value;

    console.log('Student ID:', studentId);
    console.log('Student First Name:', studentFirstName);
    console.log('Student Last Name:', studentLastName);
    console.log('Student Class:', studentClass);
    console.log('Student Number:', studentNumber);
});