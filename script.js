const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const popup = document.getElementById('popupMessage');
  const yayField = document.getElementById('yay_field');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  // Info Tab Toggle
  document.getElementById('infoToggle').addEventListener('click', () => {
    const content = document.getElementById('infoContent');
    content.hidden = !content.hidden;
  });

  // Show/hide reason textarea only on selecting "No"
  const comingRadios = [...form.elements['coming']];
  comingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'no' && radio.checked) {
        reasonDiv.classList.remove('hidden');
        form.reason.required = true;
        yayField.value = '';
      } else if (radio.value === 'yes' && radio.checked) {
        reasonDiv.classList.add('hidden');
        form.reason.value = '';
        form.reason.required = false;
        yayField.value = 'Yay.';
      }
    });
  });

  // Client-side Validation
  function validateForm() {
    if (!form.first_name.value.trim()) {
      alert('Please enter your first name');
      return false;
    }
    if (!form.last_name.value.trim()) {
      alert('Please enter your last name');
      return false;
    }
    if (!comingRadios.some(r => r.checked)) {
      alert('Please select whether you are coming');
      return false;
    }
    if (form.coming.value === 'no' && !form.reason.value.trim()) {
      alert('Please enter a reason for not coming');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    btnText.textContent = 'Hold on...';
    spinner.classList.remove('hidden');

    const data = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      coming: form.coming.value === 'yes',
      reason: form.coming.value === 'yes' ? 'Yay.' : form.reason.value.trim(),
    };

    const { error } = await supabaseClient.from('signups').insert([data]);

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
    reasonDiv.classList.add('hidden');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 2500);
  });
});
