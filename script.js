const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const popup = document.getElementById('popupMessage');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const yayField = document.getElementById('yay_field');

  // Function to toggle reason box based on selected radio
  function toggleReasonBox() {
    const selected = form.querySelector('input[name="coming"]:checked');
    if (selected && selected.value === 'no') {
      reasonDiv.classList.remove('hidden');
      form.reason.required = true;
      yayField.value = '';
    } else {
      reasonDiv.classList.add('hidden');
      form.reason.value = '';
      form.reason.required = false;
      yayField.value = 'Yay.';
    }
  }

  // Attach event listeners to all "coming" radios for dynamic toggle
  const comingRadios = form.querySelectorAll('input[name="coming"]');
  comingRadios.forEach(radio => {
    radio.addEventListener('change', toggleReasonBox);
  });

  // Run toggle on page load in case of pre-selection/reset
  toggleReasonBox();

  // Simple client-side validation before submit
  function validateForm() {
    if (!form.first_name.value.trim()) {
      alert('Please enter your first name.');
      return false;
    }
    if (!form.last_name.value.trim()) {
      alert('Please enter your last name.');
      return false;
    }
    const selected = form.querySelector('input[name="coming"]:checked');
    if (!selected) {
      alert('Please select whether you are coming.');
      return false;
    }
    if (selected.value === 'no' && !form.reason.value.trim()) {
      alert('Please provide a reason for not coming.');
      return false;
    }
    return true;
  }

  // Submit handler with loading state and Supabase insert
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    btnText.textContent = 'Hold on...';
    spinner.classList.remove('hidden');

    const first_name = form.first_name.value.trim();
    const last_name = form.last_name.value.trim();
    const coming = form.querySelector('input[name="coming"]:checked').value === 'yes';
    const reason = coming ? 'Yay.' : form.reason.value.trim();

    const { error } = await supabaseClient.from('signups').insert([
      { first_name, last_name, coming, reason }
    ]);

    if (error) {
      alert('Submission error: ' + error.message);
      submitBtn.disabled = false;
      btnText.textContent = 'Submit';
      spinner.classList.add('hidden');
      return;
    }

    popup.classList.add('show');

    spinner.classList.add('hidden');
    btnText.textContent = 'Submit';
    submitBtn.disabled = false;

    form.reset();
    reasonDiv.classList.add('hidden'); // just in case

    setTimeout(() => {
      popup.classList.remove('show');
    }, 2500);
  });
});
