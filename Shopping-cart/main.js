// عناصر تسجيل الدخول والتسجيل
let form = document.querySelector('#form');
let username = document.querySelector('#username');
let password = document.querySelector('#password');
let submitbtn = document.querySelector('.submit');
let errorel = document.querySelector('#error');
let registerForm = document.querySelector('#register');
let firstName = document.querySelector('#firstname');
let lastName = document.querySelector('#lastname');
let email = document.querySelector('#email');
let password1 = document.querySelector('#password1');
let password2 = document.querySelector('#password2');

//////////////////////////////////////////////////////
// ✅ 7. تسجيل الدخول
if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    let errors = [];

    errorel.innerHTML = '';
    errorel.style.display = 'none';

    if (username.value.trim() === '') {
      errors.push('Name is required');
    } else if (!isNaN(username.value.charAt(0))) {
      errors.push('Name cannot start with a number');
    } else if (!username.value.includes('@')) {
      errors.push('Username must include @');
    }

    const passwordValue = password.value.trim();
    if (passwordValue.length < 6 || passwordValue.length > 10) {
      errors.push('Password must be between 6 and 10 characters');
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
      errors.push('Password must contain at least one special character');
    }

    if (errors.length > 0) {
      errorel.innerHTML = errors.map(err => `<h4>${err}</h4>`).join('');
      errorel.style.display = 'block';
    } else {
      let storedUsers = JSON.parse(localStorage.getItem('userdata')) || [];

      let foundUser = storedUsers.find(user =>
        user.email === username.value.trim() &&
        user.password === passwordValue
      );

      if (foundUser) {
        errorel.innerHTML = '<h4 style="color: green;">Login successful! Redirecting...</h4>';
        errorel.style.display = 'block';

        localStorage.setItem('currentUser', foundUser.email);
        submitbtn.disabled = true;
        submitbtn.innerText = 'Submitting...';

        setTimeout(() => {
          window.location.href = 'products.html';
        }, 2000);
      } else {
        errorel.innerHTML = '<h4>Invalid username or password</h4>';
        errorel.style.display = 'block';
      }
    }
  });
}

//////////////////////////////////////////////////////
// ✅ 8. تسجيل حساب جديد
if (registerForm) {
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let errors = [];

    errorel.innerHTML = '';
    errorel.style.display = 'none';

    if (firstName.value.trim() === '') errors.push('First name is required');
    if (lastName.value.trim() === '') errors.push('Last name is required');
    if (email.value.trim() === '') errors.push('Email is required');
    else if (!email.value.includes('@')) errors.push('Email must include @');

    const passValue = password1.value.trim();
    if (passValue.length < 6) errors.push('Password must be at least 6 characters');
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passValue))
      errors.push('Password must contain at least one special character');

    if (password1.value !== password2.value) errors.push('Passwords do not match');

    if (errors.length > 0) {
      errorel.innerHTML = errors.map(err => `<h4>${err}</h4>`).join('');
      errorel.style.display = 'block';
    } else {
      let storedUsers = localStorage.getItem('userdata');
      let usersArray = storedUsers ? JSON.parse(storedUsers) : [];

      const userData = {
        firstname: firstName.value.trim(),
        lastname: lastName.value.trim(),
        email: email.value.trim(),
        password: passValue
      };

      usersArray.push(userData);
      localStorage.setItem('userdata', JSON.stringify(usersArray));

      errorel.innerHTML = '<h4 style="color: green;">Account created successfully! Redirecting to login...</h4>';
      errorel.style.display = 'block';
      // خزّن المستخدم الحالي الجديد
      localStorage.setItem('currentUser', email.value.trim());

// ووديه مباشرة للمنتجات
      setTimeout(() => {
       window.location.href = 'products.html';
      }, 2000);

    }
  });
}
