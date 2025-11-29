// API Base URL (adjust if needed)
const API_BASE_URL = window.location.origin;

// Toggle Register Modal
function toggleRegister(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('registerModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        document.getElementById('registerForm').reset();
        document.getElementById('regErrorMessage').style.display = 'none';
        document.getElementById('regSuccessMessage').style.display = 'none';
    }
}

// Toggle Reset Modal
function toggleReset(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('resetModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        document.getElementById('resetForm').reset();
        document.getElementById('resetErrorMessage').style.display = 'none';
        document.getElementById('resetSuccessMessage').style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const registerModal = document.getElementById('registerModal');
    const resetModal = document.getElementById('resetModal');
    
    if (event.target === registerModal) {
        registerModal.classList.add('hidden');
    }
    if (event.target === resetModal) {
        resetModal.classList.add('hidden');
    }
};

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Clear messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Store token if returned
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userEmail', username);
            
            successDiv.textContent = 'Login successful! Redirecting...';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                // Redirect to dashboard (create dashboard.html later)
                window.location.href = '/dashboard.html';
            }, 1500);
        } else {
            const error = await response.json().catch(() => ({}));
            errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.style.display = 'block';
        console.error('Login error:', err);
    }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const errorDiv = document.getElementById('regErrorMessage');
    const successDiv = document.getElementById('regSuccessMessage');
    
    // Clear messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            successDiv.textContent = 'Registration successful! You can now login.';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                toggleRegister();
                document.getElementById('loginForm').reset();
                document.getElementById('username').focus();
            }, 1500);
        } else {
            const error = await response.json().catch(() => ({}));
            errorDiv.textContent = error.errors?.[0]?.description || 'Registration failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.style.display = 'block';
        console.error('Register error:', err);
    }
});

// Password Reset (placeholder - would need backend implementation)
document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('resetUsername').value;
    const errorDiv = document.getElementById('resetErrorMessage');
    const successDiv = document.getElementById('resetSuccessMessage');
    
    // Clear messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        // Note: This endpoint would need to be implemented in the backend
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        if (response.ok) {
            successDiv.textContent = 'Password reset link sent to your email!';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                toggleReset();
                document.getElementById('resetForm').reset();
            }, 2000);
        } else {
            errorDiv.textContent = 'Failed to send reset link. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.style.display = 'block';
        console.error('Reset error:', err);
    }
});

// Set focus to username field on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('username').focus();
});
