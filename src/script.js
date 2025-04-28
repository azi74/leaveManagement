// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const applyLeaveBtn = document.getElementById('applyLeaveBtn');
const viewAttendanceBtn = document.getElementById('viewAttendanceBtn');
const toastLive = document.getElementById('liveToast');
const toast = new bootstrap.Toast(toastLive);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Functions
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        authButtons.classList.add('d-none');
        userProfile.classList.remove('d-none');
        usernameDisplay.textContent = currentUser.name;
        
        // Update navigation buttons
        if (applyLeaveBtn && viewAttendanceBtn) {
            applyLeaveBtn.classList.remove('disabled');
            viewAttendanceBtn.classList.remove('disabled');
        }
    } else {
        authButtons.classList.remove('d-none');
        userProfile.classList.add('d-none');
        
        // Update navigation buttons
        if (applyLeaveBtn && viewAttendanceBtn) {
            applyLeaveBtn.classList.add('disabled');
            viewAttendanceBtn.classList.add('disabled');
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showToast('Error', 'Please fill in all fields', 'danger');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Success', 'Login successful!', 'success');
        checkAuthStatus();
        $('#loginModal').modal('hide');
        loginForm.reset();
    } else {
        showToast('Error', 'Invalid credentials', 'danger');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('signupName').value;
    const dob = document.getElementById('signupDob').value;
    const regNumber = document.getElementById('registrationNumber').value;
    const course = document.getElementById('courseSelect').value;
    const department = document.getElementById('departmentSelect').value;
    const section = document.getElementById('sectionSelect').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate form
    if (!name || !dob || !regNumber || !course || !department || !section || !email || !password || !confirmPassword) {
        showToast('Error', 'Please fill in all fields', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Error', 'Passwords do not match', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showToast('Error', 'Password must be at least 6 characters', 'danger');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showToast('Error', 'User already exists with this email', 'danger');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        dob,
        regNumber,
        course,
        department,
        section,
        email,
        password,
        leaves: [],
        attendance: {
            'Big Data': { total: 40, present: 34 },
            'Web Technologies': { total: 21, present: 14 },
            'Raspberry PI': { total: 54, present: 36 },
            'Project': { total: 9, present: 6 },
            'Big Data - Laboratory': { total: 22, present: 20 }
        }
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showToast('Success', 'Registration successful!', 'success');
    checkAuthStatus();
    $('#signupModal').modal('hide');
    signupForm.reset();
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showToast('Success', 'Logged out successfully', 'success');
    checkAuthStatus();
}

function showToast(title, message, type = 'success') {
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set background color based on type
    const headerClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-primary';
    toastTitle.parentElement.className = `toast-header text-white ${headerClass}`;
    
    toast.show();
}

// Initialize users if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}