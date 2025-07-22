// CONFIG: Add your Supabase credentials here
const SUPABASE_URL = 'https://ihfccijybwwfyauvdnji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZmNjaWp5Ynd3ZnlhdXZkbmppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIwNDY0OSwiZXhwIjoyMDY4NzgwNjQ5fQ.a8d1MoI5uVbwS7HchvFs9HIrTnbwB4McMsS0Yg4dMG8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('signupForm');
const reasonDiv = document.getElementById('reasonDiv');
const yayField = document.getElementById('yay_field');
const popup = document.getElementById('popupMessage');

// Show/hide reason field based on selection
form.elements['coming'].forEach(input => {
  input.addEventListener('change', () => {
    if (input.value === 'no' && input.checked) {
      reasonDiv.classList.remove('hidden');
      form.reason.required = true;
      yayField.value = '';
    } else if (input.value === 'yes' && input.checked) {
      reasonDiv.classList.add('hidden');
      form.reason.value = '';
      form.reason.required = false;
      yayField.value = 'Yay.';
    }
  });
});

// Prevent double submission
let submitted = false;

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (submitted) return;
  submitted = true;

  const first_name = form.first_name.value.trim();
  const last_name = form.last_name.value.trim();
  const coming = form.coming.value === 'yes';
  const reason = coming ? "Yay." : form.reason.value.trim();

  // Insert into Supabase
  const { error } = await supabase
    .from('signups')
    .insert([
      { first_name, last_name, coming, reason }
    ]);
    
  if (error) {
    alert('Something went wrong: ' + error.message);
    submitted = false;
    return;
  }

  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
    form.reset();
    reasonDiv.classList.add('hidden');
    submitted = false;
  }, 2200);
});
