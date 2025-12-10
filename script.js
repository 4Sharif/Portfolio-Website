// Projects data
let allProjects = [];
let currentProjectIndex = 0;

// Course data
let courseData = {};

// DOM Elements
const projectCard = document.querySelector('.project-card');
const projectTitle = document.querySelector('.project-title');
const projectImage = document.querySelector('.project-image');
const projectTech = document.querySelector('.project-tech');
const projectDescription = document.querySelector('.project-description');
const projectLink = document.querySelector('.project-link');
const leftArrow = document.querySelector('.project-arrow-left');
const rightArrow = document.querySelector('.project-arrow-right');

const courseButtons = document.querySelectorAll('.course-button');
const courseModal = document.getElementById('courseModal');
const projectModal = document.getElementById('projectModal');
const modalTitle = courseModal.querySelector('.modal-title');
const modalDescription = courseModal.querySelector('.modal-description');
const modalCloses = document.querySelectorAll('.modal-close');

const darkModeToggle = document.querySelector('.dark-mode-toggle');
const navItems = document.querySelectorAll('.nav-item');
const heroImage = document.getElementById('heroImage');

// Load projects data
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    allProjects = await response.json();
    renderProject();
  } catch (error) {
    console.error('Error loading projects:', error);
    projectTitle.textContent = 'Failed to load projects';
  }
}

// Load courses data
async function loadCourses() {
  try {
    const response = await fetch('courses.json');
    courseData = await response.json();
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Render current project
function renderProject() {
  if (allProjects.length === 0) return;
  
  const project = allProjects[currentProjectIndex];
  
  projectTitle.textContent = project.name;
  projectImage.src = project.image;
  projectImage.alt = project.name;
  projectTech.textContent = `Tech Stack: ${project.tech.join(', ')}`;
  projectDescription.textContent = `Description: ${project.description}`;
  projectLink.href = project.link || '#';
  projectLink.textContent = project.link ? project.link.replace(/^https?:\/\//, '') : 'No link available';
  
  // Update arrow states
  leftArrow.disabled = currentProjectIndex === 0;
  rightArrow.disabled = currentProjectIndex === allProjects.length - 1;
}

// Navigate projects without animation
function navigateProject(direction) {
  if (direction === 'left' && currentProjectIndex > 0) {
    currentProjectIndex--;
    renderProject();
  } else if (direction === 'right' && currentProjectIndex < allProjects.length - 1) {
    currentProjectIndex++;
    renderProject();
  }
}

// Course modal
function openCourseModal(courseKey) {
  const course = courseData[courseKey];
  if (course) {
    modalTitle.textContent = course.title;
    modalDescription.textContent = course.description;
    courseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCourseModal() {
  courseModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Project image modal
let currentModalImageIndex = 0;
let currentProjectImages = [];

function openProjectModal() {
  const project = allProjects[currentProjectIndex];
  if (project) {
    const modalTitle = projectModal.querySelector('.modal-title');
    
    modalTitle.textContent = project.name;
    
    // Set up images array
    currentProjectImages = project.images || [project.image];
    currentModalImageIndex = 0;
    
    renderModalImage();
    
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function renderModalImage() {
  const modalImage = projectModal.querySelector('.modal-image');
  const modalLeftArrow = projectModal.querySelector('.modal-arrow-left');
  const modalRightArrow = projectModal.querySelector('.modal-arrow-right');
  const dotsContainer = projectModal.querySelector('.modal-image-dots');
  
  // Update image
  modalImage.src = currentProjectImages[currentModalImageIndex];
  modalImage.alt = allProjects[currentProjectIndex].name;
  
  // Update arrows
  modalLeftArrow.disabled = currentModalImageIndex === 0;
  modalRightArrow.disabled = currentModalImageIndex === currentProjectImages.length - 1;
  
  // Update dots
  dotsContainer.innerHTML = '';
  if (currentProjectImages.length > 1) {
    currentProjectImages.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'modal-dot' + (index === currentModalImageIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        currentModalImageIndex = index;
        renderModalImage();
      });
      dotsContainer.appendChild(dot);
    });
  }
}

function navigateModalImage(direction) {
  if (direction === 'left' && currentModalImageIndex > 0) {
    currentModalImageIndex--;
    renderModalImage();
  } else if (direction === 'right' && currentModalImageIndex < currentProjectImages.length - 1) {
    currentModalImageIndex++;
    renderModalImage();
  }
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
  currentModalImageIndex = 0;
}

// Dark mode toggle with image switching
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  
  // Switch hero image based on mode
  if (isDark) {
    heroImage.src = 'images/darkmode-heropic.png';
  } else {
    heroImage.src = 'images/lightmode-heropic.png';
  }
}

// Load dark mode preference
function loadDarkModePreference() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    heroImage.src = 'images/darkmode-heropic.png';
  }
}

// Event Listeners
leftArrow.addEventListener('click', () => navigateProject('left'));
rightArrow.addEventListener('click', () => navigateProject('right'));

courseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const courseKey = button.getAttribute('data-course');
    openCourseModal(courseKey);
  });
});

// Close all modals
modalCloses.forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeCourseModal();
    closeProjectModal();
  });
});

// Close modal when clicking backdrop
courseModal.addEventListener('click', (e) => {
  if (e.target === courseModal) {
    closeCourseModal();
  }
});

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    closeProjectModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (courseModal.classList.contains('active')) {
      closeCourseModal();
    }
    if (projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  }
});

darkModeToggle.addEventListener('click', toggleDarkMode);

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = item.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Keyboard navigation for projects
document.addEventListener('keydown', (e) => {
  if (!courseModal.classList.contains('active') && !projectModal.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      navigateProject('left');
    } else if (e.key === 'ArrowRight') {
      navigateProject('right');
    }
  }
});

// Project image click to open modal
projectImage.addEventListener('click', openProjectModal);

// Modal image navigation
const modalLeftArrow = projectModal.querySelector('.modal-arrow-left');
const modalRightArrow = projectModal.querySelector('.modal-arrow-right');

modalLeftArrow.addEventListener('click', () => navigateModalImage('left'));
modalRightArrow.addEventListener('click', () => navigateModalImage('right'));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadCourses();
  loadDarkModePreference();
}); 