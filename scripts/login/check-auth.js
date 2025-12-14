import { supabase } from "../supabase-cilent.js";

export async function checkIfUserAlreadyLoggedIn(fieldToPutError) {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        await redirectToNextPage(user.id, fieldToPutError);
    } else {
        // use for the pages that need to redirect to other pages if not logged in
        return false;
    }
}

export async function redirectToNextPage(usedIdSession, fieldToPutError) {
    const UserAlreadySetup = await checkIfUserHaveToSetup(usedIdSession, fieldToPutError);
    if (UserAlreadySetup === null) {
        return;
    } else if (UserAlreadySetup) {
        window.location.href = '/dashboard/';
    } else {
        window.location.href = '/login/setup-user.html';
    }
}

export async function checkIfUserHaveToSetup(usedIdSession, fieldToPutError) {
    const { data, error } = await supabase
        .from('user_info')
        .select('user_id')
        .eq('user_id', usedIdSession)
        .maybeSingle();

    if (error) {
        fieldToPutError.textContent = 'เกิดข้อผิดพลาด โปรดติดต่อแอดมิน: ' + error.message;
        fieldToPutError.classList.add('visible');
        return null;
    }

    if (data) {
        return true;
    } else {
        return false;
    }
}