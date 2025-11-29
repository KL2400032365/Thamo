// API Base URL
const API_BASE_URL = window.location.origin;

// Check authentication and get user info
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserInfo();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (!token && !userId) {
        // Redirect to login if not authenticated
        window.location.href = '/index.html';
    }
}

// Load user info
function loadUserInfo() {
    const userEmail = localStorage.getItem('userEmail') || 'User';
    document.getElementById('userEmail').textContent = userEmail;
}

// Show section
function showSection(sectionId) {
    event.preventDefault();
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const titles = {
        home: 'Welcome to Revi',
        courses: 'My Courses',
        assignments: 'Assignments',
        reviews: 'Peer Reviews',
        discussions: 'Discussions',
        notifications: 'Notifications'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Revi';
    
    // Load section data
    loadSectionData(sectionId);
}

// Load section data
async function loadSectionData(sectionId) {
    try {
        switch(sectionId) {
            case 'courses':
                await loadCourses();
                break;
            case 'assignments':
                await loadAssignments();
                break;
            case 'reviews':
                await loadReviews();
                break;
            case 'discussions':
                await loadDiscussions();
                break;
            case 'notifications':
                await loadNotifications();
                break;
        }
    } catch (err) {
        console.error('Error loading section data:', err);
    }
}

// Load courses
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const courses = await response.json();
            const coursesList = document.getElementById('coursesList');
            
            if (courses.length === 0) {
                coursesList.innerHTML = '<p class="placeholder">No courses yet. Create or join a course to get started.</p>';
            } else {
                coursesList.innerHTML = courses.map(course => `
                    <div class="card">
                        <h3>${course.title}</h3>
                        <p><strong>Code:</strong> ${course.code}</p>
                        <p>${course.description || 'No description'}</p>
                    </div>
                `).join('');
            }
        }
    } catch (err) {
        console.error('Error loading courses:', err);
    }
}

// Load assignments
async function loadAssignments() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/assignments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const assignments = await response.json();
            const assignmentsList = document.getElementById('assignmentsList');
            
            if (assignments.length === 0) {
                assignmentsList.innerHTML = '<p class="placeholder">No assignments yet.</p>';
            } else {
                assignmentsList.innerHTML = assignments.map(assignment => `
                    <div class="card">
                        <h3>${assignment.title}</h3>
                        <p>${assignment.description || ''}</p>
                        <p><strong>Deadline:</strong> ${new Date(assignment.deadline).toLocaleDateString()}</p>
                        <p><strong>Marks:</strong> ${assignment.marks}</p>
                    </div>
                `).join('');
            }
        }
    } catch (err) {
        console.error('Error loading assignments:', err);
    }
}

// Load reviews
async function loadReviews() {
    // Placeholder for reviews loading
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '<p class="placeholder">No reviews pending.</p>';
}

// Load discussions
async function loadDiscussions() {
    // Placeholder for discussions loading
    const discussionsList = document.getElementById('discussionsList');
    discussionsList.innerHTML = '<p class="placeholder">No discussions yet.</p>';
}

// Load notifications
async function loadNotifications() {
    // Placeholder for notifications loading
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '<p class="placeholder">No notifications.</p>';
}

// Show create course modal
function showCreateCourse() {
    document.getElementById('courseModal').classList.remove('hidden');
    document.getElementById('courseForm').reset();
}

// Close course modal
function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

// Create course
document.getElementById('courseForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('courseTitle').value;
    const code = document.getElementById('courseCode').value;
    const description = document.getElementById('courseDesc').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ title, code, description })
        });
        
        if (response.ok) {
            closeCourseModal();
            loadCourses();
            alert('Course created successfully!');
        }
    } catch (err) {
        console.error('Error creating course:', err);
        alert('Failed to create course');
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('courseModal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
};

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/index.html';
}
