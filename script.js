const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const yayField = document.getElementById('yay_field');
  const popup = document.getElementById('popupMessage');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  // Info tab toggle
  const infoToggle = document.getElementById('infoToggle');
  const infoContent = document.getElementById('infoContent');

  infoToggle.addEventListener('click', () => {
    const expanded = infoToggle.getAttribute('aria-expanded') === 'true';
    infoToggle.setAttribute('aria-expanded', !expanded);
    if (expanded) {
      infoContent.hidden = true;
    } else {
      infoContent.hidden = false;
    }
  });

  // Show/hide reason textarea
  for (const radio of form.elements['coming']) {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'no') {
        reasonDiv.classList.remove('hidden');
        form.reason.required = true;
        yayField.value = '';
      } else if (radio.checked && radio.value === 'yes') {
        reasonDiv.classList.add('hidden');
        form.reason.value = '';
        form.reason.required = false;
        yayField.value = 'Yay.';
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    btnText.textContent = 'Hold on...';
    spinner.classList.remove('hidden');

    const first_name = form.first_name.value.trim();
    const last_name = form.last_name.value.trim();
    const coming = form.coming.value === 'yes';
    const reason = coming ? 'Yay.' : form.reason.value.trim();

    const { error } = await supabaseClient.from('signups').insert([
      { first_name, last_name, coming, reason }
    ]);

    if (error) {
      alert('❌ Submission error: ' + error.message);
      submitBtn.disabled = false;
      btnText.textContent = 'Submit';
      spinner.classList.add('hidden');
      return;
    }

    popup.classList.add('show');
    spinner.classList.add('hidden');
    btnText.textContent = 'Submit';
    submitBtn.disabled = false;

    setTimeout(() => {
      popup.classList.remove('show');
      form.reset();
      reasonDiv.classList.add('hidden');
    }, 2500);
  });
});
