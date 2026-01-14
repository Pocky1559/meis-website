import { supabase } from "./supabase-cilent.js";

const formError = document.getElementById('formError');
if (formError) { formError.textContent = ''; formError.classList.remove('visible'); }

const topicSelect = document.getElementById('topic');
const subtopicsContainer = document.getElementById('subtopics');
const form = document.getElementById('studentForm');
const projectInput = document.getElementById('projectName');

// load choices and populate topic select
async function loadChoices() {
  try {
    const res = await fetch('/dashboard/student_choice.json');
    const json = await res.json();

    if (!json || !json.IS_subjects) return;

    json.IS_subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.subject;
      opt.textContent = s.subject;
      topicSelect.appendChild(opt);
    });
  } catch (err) {
    if (formError) {
      formError.textContent = 'ไม่สามารถโหลดหัวข้อได้ โปรดรีเฟรชหน้า: ' + err.message;
      formError.classList.add('visible');
    }
  }
}

// when topic changes, render subtopics checkboxes
function renderSubtopicsForTopic(topic) {
  subtopicsContainer.innerHTML = '';
  if (!topic) return;

  fetch('/dashboard/student_choice.json')
    .then(r => r.json())
    .then(json => {
      const subject = json.IS_subjects.find(s => s.subject === topic);
      if (!subject) return;

      subject.segments.forEach((seg, idx) => {
        const id = `subtopic-${idx}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'checkbox-item';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.name = 'subtopics';
        input.value = seg;

        input.addEventListener('change', enforceSubtopicLimit);

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = seg;

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        subtopicsContainer.appendChild(wrapper);
      });
    })
    .catch(err => {
      if (formError) {
        formError.textContent = 'ไม่สามารถโหลดหัวข้อย่อยได้: ' + err.message;
        formError.classList.add('visible');
      }
    });
}

function enforceSubtopicLimit() {
  const checked = subtopicsContainer.querySelectorAll('input[type=checkbox]:checked').length;
  const boxes = Array.from(subtopicsContainer.querySelectorAll('input[type=checkbox]'));
  if (checked >= 3) {
    boxes.forEach(b => { if (!b.checked) b.disabled = true; });
  } else {
    boxes.forEach(b => b.disabled = false);
  }
}

function matchTeachers(teachers, subject, segments) {
  const results = [];

  const hasMatch = (teacherSegments = []) =>
    teacherSegments.some(s => segments.includes(s));

  // Main interest first
  for (const t of teachers) {
    const main = t.main_interest;
    if (
      main?.subject === subject &&
      hasMatch(main.segments)
    ) {
      results.push({ ...t, match_type: "main" });
    }
  }

  // Sub interest
  for (const t of teachers) {
    if (results.some(r => r.id === t.id)) continue;

    const subs = Array.isArray(t.sub_interest) ? t.sub_interest : [];
    for (const sub of subs) {
      if (
        sub.subject === subject &&
        hasMatch(sub.segments)
      ) {
        results.push({ ...t, match_type: "sub" });
        break;
      }
    }
  }

  return results;
}

async function requestTeacherData() {
  const { data, error } = await supabase
    .from('teacher-info')
    .select("id, name, main_interest, sub_interest");

  if (error) {
    formError.textContent = 'ไม่สามารถดึงข้อมูลครูได้: ' + error.message;
    formError.classList.add('visible');
    throw new Error(error.message);
  }

  return data;
}

// form submit handler
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const selectedTopic = topicSelect.value;
  const selectedSub = Array.from(subtopicsContainer.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
  const projectName = projectInput.value.trim();

  if (!selectedTopic) {
    formError.textContent = 'โปรดเลือกหัวข้อหลัก';
    formError.classList.add('visible');
    return;
  }

  if (selectedSub.length < 1 || selectedSub.length > 3) {
    formError.textContent = 'โปรดเลือกหัวข้อย่อยอย่างน้อย 1 และไม่เกิน 3';
    formError.classList.add('visible');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'กำลังบันทึก...';

  // Save selection locally until backend is ready
  try {
    const payload = {
      project_name: projectName,
      topic: selectedTopic,
      sub_topics: selectedSub,
      savedAt: new Date().toISOString()
    };
    console.log('User answers:', payload);

    const subject = payload.topic;
    const segments = payload.sub_topics;
    
    const teacherData = await requestTeacherData();

    const matchedTeachers = matchTeachers(teacherData, subject, segments);

    console.log('Matched Teachers:', matchedTeachers);

    // success
    // window.location.href = '/dashboard/';
  } catch (err) {
    formError.textContent = 'เกิดข้อผิดพลาดในการบันทึก โปรดลองใหม่: ' + err.message;
    formError.classList.add('visible');
    submitBtn.textContent = originalText;
    return;
  }
});

// init
loadChoices();

topicSelect.addEventListener('change', function() {
  renderSubtopicsForTopic(this.value);
});

// render initial subtopics if topic preselected
if (topicSelect.value) renderSubtopicsForTopic(topicSelect.value);
