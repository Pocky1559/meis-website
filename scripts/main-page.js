import { supabase } from "/scripts/supabase-cilent.js";

async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    

    if (user) {
        window.location.href = "/dashboard/";
    } else {
        // temporary redirect to login page until main page is created
        window.location.href = "/login/";
    }
}

checkAuth();