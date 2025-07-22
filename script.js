const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJI...'; // your full key here

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const popup = document.getElementById('popupMessage');
  const yayField = document.getElementById('yay_field');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  // Info toggle
  document.getElementById('infoToggle').addEventListener('click', () => {
    const content = document.getElementById('infoContent');
    content.hidden = !content.hidden;
  });

  // Handle reason logic
  form.elements['coming'].forEach(el => {
    el.addEventListener('change', () => {
      if (el.value === 'no' && el.checked) {
        reasonDiv.classList.remove('hidden');
        yayField.value = '';
        form.reason.required = true;
      } else if (el.value === 'yes' && el.checked) {
        reasonDiv.classList.add('hidden');
        form.reason.value = '';
        form.reason.required = false;
        yayField.value = 'Yay.';
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first = form.first_name.value.trim();
    const last = form.last_name.value.trim();
    const coming = form.coming.value;
    const reason = coming === 'no' ? form.reason.value.trim() : 'Yay.';

    if (!first || !last || !coming || (coming === 'no' && reason === '')) {
      alert('Please fill in all required fields.');
      return;
    }

    submitBtn.disabled = true;
    btnText.textContent = 'Hold on...';
    spinner.classList.remove('hidden');

    const { error } = await supabaseClient.from('signups').insert([{ first_name: first, last_name: last, coming: coming === 'yes', reason }]);

    if (error) {
      alert('Submission failed: ' + error.message);
      submitBtn.disabled = false;
      btnText.textContent = 'Submit';
      spinner.classList.add('hidden');
      return;
    }

    popup.classList.add('show');
    form.reset();
    reasonDiv.classList.add('hidden');

    btnText.textContent = 'Submit';
    spinner.classList.add('hidden');
    submitBtn.disabled = false;

    setTimeout(() => popup.classList.remove('show'), 3000);
  });
});
