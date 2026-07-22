const passwordInput = document.getElementById("passwordInput");
const strengthIndicator = document.getElementById("strengthIndicator");
const toggleBtn = document.getElementById("toggleBtn");
const themeBtn = document.getElementById("themeBtn");

// --------------------
// Show / Hide Password
// --------------------

toggleBtn.addEventListener("click", () => {

    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        toggleBtn.textContent = "Hide Password";
    }
    else{
        passwordInput.type = "password";
        toggleBtn.textContent = "Show Password";
    }

});

// --------------------
// Prevent Spacebar
// --------------------

passwordInput.addEventListener("keydown",(event)=>{

    if(event.key===" "){
        event.preventDefault();
    }

});

// --------------------
// Password Checker
// --------------------

passwordInput.addEventListener("input",()=>{

    // Remove spaces if pasted
    passwordInput.value = passwordInput.value.replace(/\s/g,"");

    const password = passwordInput.value;

    const isLongEnough = password.length >= 6;
    const hasNumber = /\d/.test(password);

    if(isLongEnough && hasNumber){
        strengthIndicator.textContent = "Strong Password";
        strengthIndicator.style.color = "green";
    }
    else{
        strengthIndicator.textContent = "Weak Password";
        strengthIndicator.style.color = "red";
    }

});

// --------------------
// Dark Mode
// --------------------

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        themeBtn.textContent = "☀️ Light Mode";
    }
    else{
        themeBtn.textContent = "🌙 Dark Mode";
    }

});