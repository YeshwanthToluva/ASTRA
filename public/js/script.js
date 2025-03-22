const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between sign-in and sign-up
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Handle Registration
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (res.status === 201) {
            alert('User registered successfully');
            window.location.href = '/sign-in';
        } else {
            alert(data.message || 'Error registering user');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user');
    }
});

// Handle Login
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.status === 200) {
            alert('Login successful!');
            window.location.href = data.redirectUrl || '/landing';
        } else {
            alert(data.error || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        alert('Invalid credentials');
    }
});
