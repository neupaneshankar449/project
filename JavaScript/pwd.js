const passwordInput = document.getElementById('passwordInput');
const strengthIndicator = document.getElementById('strengthIndicator');

// Prevent spaces from being entered
passwordInput.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
    }
});

passwordInput.addEventListener('input', () => {
    // Remove spaces if pasted
    passwordInput.value = passwordInput.value.replace(/\s/g, '');

    const password = passwordInput.value;

    const isLongEnough = password.length >= 6;
    const hasNumber = /\d/.test(password);

    if (isLongEnough && hasNumber) {
        strengthIndicator.textContent = 'Strong';
        strengthIndicator.style.color = 'green';
    } else {
        strengthIndicator.textContent = 'Weak';
        strengthIndicator.style.color = 'red';
    }
});