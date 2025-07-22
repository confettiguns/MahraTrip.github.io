// CONFIG: Replace with your Supabase credentials before deploying
const SUPABASE_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIwNDY0OSwiZXhwIjoyMDY4NzgwNjQ5fQ.a8d1MoI5uVbwS7HchvFs9HIrTnbwB4McMsS0Yg4dMG8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('signupForm');
const reasonDiv = document.getElementById('reasonDiv');
const yayField = document.getElementById('yay_field');
const popup = document.getElementById('popupMessage');
const submitBtn = document.getElementById('submitBtn');

const comingRadios = form.elements['coming'];

// Show/hide reason textarea with animation
for (const input of comingRadios) {
  input.addEventListener('change', () => {
    if (input.value === 'no' && input.checked) {
      reasonDiv.classList.remove('hidden');
      form.reason.required = true;
      yayField.value = '';
      // Animate smoothly
      reasonDiv.style.animation = 'fadeInSlideDown 0.3s ease forwards';
    } else if (input.value === 'yes' && input.checked) {
      reasonDiv.style.animation = 'fadeOutSlideUp 0.3s ease forwards';
      setTimeout(() => {
        reasonDiv.classList.add('hidden');
        form.reason.value = '';
        form.reason.required = false;
        yayField.value = 'Yay.';
      }, 280);
    }
  });
}

// Animations for reasonDiv
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`@keyframes fadeInSlideDown {
  0% {opacity: 0; transform: translateY(-15px);}
  100% {opacity: 1; transform: translateY(0);}
}`, styleSheet.cssRules.length);

styleSheet.insertRule(`@keyframes fadeOutSlideUp {
  0% {opacity: 1; transform: translateY(0);}
  100% {opacity: 0; transform: translateY(-15px);}
}`, styleSheet.cssRules.length);


// Prevent double submission & handle form submit
let submitted = false;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (submitted) return;
  submitted = true;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const first_name = form.first_name.value.trim();
  const last_name = form.last_name.value.trim();
  const coming = form.coming.value === 'yes';
  const reason = coming ? 'Yay.' : form.reason.value.trim();

  const { error } = await supabase.from('signups').insert([
    {
      first_name,
      last_name,
      coming,
      reason,
    },
  ]);

  if (error) {
    alert('Submission error: ' + error.message);
    submitted = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    return;
  }

  // Show popup
  popup.style.display = 'block';

  // Reset form after short delay
  setTimeout(() => {
    popup.style.display = 'none';
    form.reset();
    reasonDiv.classList.add('hidden');
    submitted = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }, 2500);
});
