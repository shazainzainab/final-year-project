// Sign-in Button Redirect
document.querySelector('.signin-btn').addEventListener('click', function() {
  window.location.href = "Sign in.html";
});

// Destination Dropdown Logic
const input = document.getElementById('destination-input');
const dropdown = document.getElementById('destination-list');
const arrow = document.getElementById('dropdown-arrow');

input.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  arrow.style.transform = dropdown.style.display === 'block'
    ? 'translateY(-50%) rotate(180deg)'
    : 'translateY(-50%) rotate(0deg)';
});

document.querySelectorAll('#destination-list li').forEach(item => {
  item.addEventListener('click', () => {
    input.value = item.textContent;
    dropdown.style.display = 'none';
    arrow.style.transform = 'translateY(-50%) rotate(0deg)';
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!document.querySelector('.input-wrapper').contains(e.target)) {
    dropdown.style.display = 'none';
    arrow.style.transform = 'translateY(-50%) rotate(0deg)';
  }
});

// Date Picker Logic
const datePicker = document.getElementById('date-picker');
datePicker.addEventListener('change', () => {
  console.log("Selected Date:", datePicker.value);
});

// Days Counter Logic
const decreaseBtn = document.querySelector('button[aria-label="Decrease days"]');
const increaseBtn = document.querySelector('button[aria-label="Increase days"]');
const counterValue = document.querySelector('.counter-value');
let days = parseInt(counterValue.textContent);

decreaseBtn.addEventListener('click', () => {
    if (days > 1) {
        days--;
        counterValue.textContent = days;
    }
});

increaseBtn.addEventListener('click', () => {
    days++;
    counterValue.textContent = days;
});

// Budget Radio Buttons Logic
const budgetRadios = document.querySelectorAll('input[name="budget"]');
budgetRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    console.log("Selected Budget:", radio.nextElementSibling.querySelector('.card-title').textContent);
  });
});

// Companion Radio Buttons Logic
const companionRadios = document.querySelectorAll('input[name="companion"]');
companionRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    console.log("Travel Companion:", radio.nextElementSibling.querySelector('.card-title').textContent);
  });
});

// Activities Checkbox Logic
const activities = document.querySelectorAll('input[name="activity"]');
activities.forEach(activity => {
  activity.addEventListener('change', () => {
    let selected = [];
    activities.forEach(act => {
      if (act.checked) {
        selected.push(act.nextElementSibling.querySelector('.card-title-bold').textContent);
      }
    });
    console.log("Selected Activities:", selected.join(", "));
  });
});

// Food Radio Button Logic
const foodRadios = document.querySelectorAll('input[name="food"]');
foodRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    console.log("Food Preference:", radio.parentElement.querySelector('.radio-label').textContent);
  });
});

// TextArea (More Preferences)
const textarea = document.querySelector('.form-textarea');
textarea.addEventListener('input', () => {
  console.log("Additional Preferences:", textarea.value);
});

// Form Submit Handler (optional log to test)
const form = document.querySelector('.trip-form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent default form submission
  alert('Form Submitted Successfully!');
});
