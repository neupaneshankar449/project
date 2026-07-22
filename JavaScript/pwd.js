const passwordInput = document.getElementById('passwordInput');
        const strengthIndicator = document.getElementById('strengthIndicator');

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;

            // Define validation rules
            const isLongEnough = password.length >= 6;
            const hasNumber = /\d/.test(password);

            // Combine conditions
            if (isLongEnough && hasNumber) {
                strengthIndicator.textContent = 'Strong';
                strengthIndicator.style.color = 'green';
            } else {
                strengthIndicator.textContent = 'Weak';
                strengthIndicator.style.color = 'red';
            }
        });