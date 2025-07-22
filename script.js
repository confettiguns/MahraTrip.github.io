const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const popup = document.getElementById('popupMessage');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const yayField = document.getElementById('yay_field');

  const comingRadios = form.querySelectorAll('input[name="coming"]');

  function toggleReason() {
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

  comingRadios.forEach(radio => {
    radio.addEventListener('change', toggleReason);
  });

  toggleReason();

  function validateForm() {
    if (!form.first_name.value.trim()) return alert("Please enter your first name.");
    if (!form.last_name.value.trim()) return alert("Please enter your last name.");
    const selected = form.querySelector('input[name="coming"]:checked');
    if (!selected) return alert("Please select if you're coming.");
    if (selected.value === 'no' && !form.reason.value.trim()) return alert("Please tell us why you're not coming.");
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
      coming: form.querySelector('input[name="coming"]:checked').value === 'yes',
      reason: form.coming.value === 'yes' ? 'Yay.' : form.reason.value.trim(),
    };

    const { error } = await supabaseClient.from('signups').insert([data]);

    if (error) {
      alert('Error: ' + error.message);
      submitBtn.disabled = false;
      btnText.textContent = 'Submit';
      spinner.classList.add('hidden');
      return;
    }

    popup.classList.add('show');
    form.reset();
    reasonDiv.classList.add('hidden');
    btnText.textContent = 'Submitted ✅';
    spinner.classList.add('hidden');
    submitBtn.disabled = true; // ✅ Prevent double submission

    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);
  });
});
