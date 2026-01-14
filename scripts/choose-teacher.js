const teachersContainer = document.getElementById("teachers-list")
const matchedTeachers = JSON.parse(localStorage.getItem("matched-teachers")) || [];
const teachersAmount = matchedTeachers.length;

console.log(matchedTeachers);

if (teachersAmount === 0) {
    document.getElementById("header-text").innerText = "ไม่พบครูที่สามารถจับคู่กับคุณได้"
} else {
    for (let i = 1; i <= teachersAmount; i++) {
        const teacherId = document.getElementById(`teacher-${i}`);
        const teacherName = document.getElementById(`teacher-name-${i}`);
        const submitBtn = document.getElementById(`btn-teacher-${i}`);

        teacherId.classList.remove("hide-teacher-card");
        teacherName.innerText = matchedTeachers[i - 1].name;
        submitBtn.addEventListener("click", () => {
            console.log(`You choose teacher ${i}`);
            console.log(`Name: ${matchedTeachers[i - 1].name}`);
        });

    }
}

