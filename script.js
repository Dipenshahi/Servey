const form = document.getElementById('surveyForm');
const sections = document.querySelectorAll('.form-section');
let currentSection = 0;

function showSection(index) {
  sections.forEach((section, i) => {
    if (i === index) {
      section.classList.add('active');
      section.style.display = 'block';
      section.classList.add('fade-in');
      setTimeout(() => section.classList.remove('fade-in'), 600);
    } else {
      section.classList.remove('active');
      section.style.display = 'none';
    }
  });
}

document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Validate only inputs in the current section
    const inputs = sections[currentSection].querySelectorAll('input, textarea, select');
    let valid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        valid = false;
      }
    });
    if (valid) {
      currentSection++;
      if (currentSection >= sections.length - 1) currentSection = sections.length - 2;
      showSection(currentSection);
    } else {
      // Report validity on first invalid input
      for (const input of inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          break;
        }
      }
    }
  });
});

document.querySelectorAll('.prev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSection--;
    if (currentSection < 0) currentSection = 0;
    showSection(currentSection);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (form.checkValidity()) {
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        showSection(sections.length - 1);
        form.reset();
      } else {
        alert('Oops! There was a problem submitting your form');
      }
    }).catch(() => {
      alert('Oops! There was a problem submitting your form');
    });
  } else {
    form.reportValidity();
  }
});

showSection(currentSection);
