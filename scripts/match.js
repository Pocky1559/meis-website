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

  const submitBtn = document.getElementById('login-btn');
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
    localStorage.setItem('match_selection', JSON.stringify(payload));
    // success
    window.location.href = '/dashboard/';
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
