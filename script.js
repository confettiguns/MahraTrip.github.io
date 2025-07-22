// ✅ FIXED: Use correct Supabase URL and anon key
const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co'; // <-- YOUR Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQ2NDksImV4cCI6MjA2ODc4MDY0OX0.Ap0YWh5hwoc12jKclcRs4pmGfGit1thi6so484SyGFI';

// 🔐 Supabase client must be declared AFTER the CDN loads it
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ⏰ Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const reasonDiv = document.getElementById('reasonDiv');
  const popup = document.getElementById('popupMessage');
  const yayField = document.getElementById('yay_field');

  // 🟡 Fix "coming" radios and reason box
  const comingRadios = form.elements['coming'];
  for (const radio of comingRadios) {
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

  // ✅ Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = form.first_name.value.trim();
    const last_name = form.last_name.value.trim();
    const coming = form.coming.value === 'yes';
    const reason = coming ? 'Yay.' : form.reason.value.trim();

    // 📨 Send to Supabase
    const { error } = await supabaseClient.from('signups').insert([
      {
        first_name,
        last_name,
        coming,
        reason,
      },
    ]);

    if (error) {
      alert('❌ Something went wrong: ' + error.message);
      console.error(error);
      return;
    }

    // 🎉 Show success!
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.display = 'none';
      form.reset();
      reasonDiv.classList.add('hidden');
    }, 2500);
  });
});
