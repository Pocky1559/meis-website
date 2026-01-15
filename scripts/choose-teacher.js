import { supabase } from "./supabase-cilent.js";

const teachersContainer = document.getElementById("teachers-list")
const matchedTeachers = JSON.parse(localStorage.getItem("matched-teachers")) || [];
const projectName = localStorage.getItem("project-naeme") || "";
const teachersAmount = matchedTeachers.length;

console.log(matchedTeachers);

if (teachersAmount === 0) {
    document.getElementById("header-text").innerText = "ไม่พบครูที่สามารถจับคู่กับคุณได้"
} else {
    for (let i = 1; i <= teachersAmount; i++) {
        const teacherId = document.getElementById(`teacher-${i}`);
        const teacherName = document.getElementById(`teacher-name-${i}`);
        const submitBtn = document.getElementById(`btn-teacher-${i}`);
        const originalBtnText = submitBtn.textContent;

        const { data: { user }} = await supabase.auth.getUser();

        teacherId.classList.remove("hide-teacher-card");
        teacherName.innerText = matchedTeachers[i - 1].name;
        submitBtn.addEventListener("click", async () => {
            submitBtn.textContent = "กำลังบันทึก...";

            console.log(`You choose teacher ${i}`);
            console.log(`Name: ${matchedTeachers[i - 1].name}`);

            const { error: isMatchedError } = await supabase
                .from('user_info')
                .update({
                    is_match: true
                })
                .eq('user_id', user.id);

            if (isMatchedError) {
                throw new Error("Failed to update user match status: " + isMatchedError.message);
            }

            const { error: teacherError } = await supabase
                .from('user_info')
                .update({
                    matched_teacher: matchedTeachers[i - 1].name
                })
                .eq('user_id', user.id);

            if (teacherError) {
                throw new Error("Failed to update matched teacher: " + teacherError.message);
            }

            const { error: projectNameError } = await supabase
                .from('user_info')
                .update({
                    project_name: projectName
                })
                .eq('user_id', user.id);

            if (projectNameError) {
                throw new Error("Failed to update project name: " + projectNameError.message);
            }

            submitBtn.textContent = originalBtnText;

            window.location.href = '/dashboard/';
        });

    }
}

