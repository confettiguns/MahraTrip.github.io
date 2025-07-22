// Replace these credentials with your actual Supabase project credentials
const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('signupForm');
const comingOptions = form.elements['coming'];
const reasonDiv = document.getElementById('reasonDiv');
const yayField = document.getElementById('yay_field');
const popup = document.getElementById('popupMessage');

for (const option of comingOptions) {
  option.addEventListener('change', () => {
    if (option.value === 'no' && option.checked) {
      reasonDiv.classList.remove('hidden');
      form.reason.required = true;
      yayField.value = '';
    } else if (option.value === 'yes' && option.checked) {
      reasonDiv.classList.add('hidden');
      form.reason.required = false;
      yayField.value = 'Yay.';
    }
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    coming: form.coming.value === 'yes',
    reason: form.coming.value === 'yes' ? 'Yay.' : form.reason.value.trim(),
  };

  try {
    const { error } = await supabase.from('signups').insert([data]);
    if (error) throw error;

    // Show confirmation
    popup.style.display = 'block';

    setTimeout(() => {
      popup.style.display = 'none';
      form.reset();
      reasonDiv.classList.add('hidden');
    }, 2500);
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
