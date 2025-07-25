 document.getElementById('signOutBtn').addEventListener('click', function () {
    alert('You have been signed out.');
  });

  document.getElementById('forgotPasswordBtn').addEventListener('click', function () {
    alert('Forgot password clicked!');
  });

  document.getElementById('signinBtn').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      alert('Please fill all fields');
    } else {
      alert(`Sign In Successful!\nEmail: ${email}`);
    }
  });