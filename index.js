const box = document.querySelector('.project-box');

const titleEl = box.querySelector('.project-info h3');
const imgEl = box.querySelector('.project-main img');
const techEl = box.querySelector('.tech-stack');
const descEl = box.querySelector('.project-description');
const linkEl = box.querySelector('.project-link');

const leftBtn  = box.querySelector('button:nth-of-type(1)');
const rightBtn = box.querySelector('button:nth-of-type(2)');

const typeSelect   = document.getElementById('type-select');
const statusSelect = document.getElementById('status-select');
const sortSelect   = document.getElementById('sort-select');

let allProjects = [];
let filtered = [];
let i = 0;

async function loadData() {
    const res = await fetch('projects.json');
    allProjects = await res.json();
    applyFilters(); 
}

function render() {
    const p = filtered[i];
    if (!p) {  
        titleEl.textContent = 'No projects found';
        imgEl.src = '';
        techEl.textContent = '';
        descEl.textContent = '';
        linkEl.removeAttribute('href');
        linkEl.textContent = '';
        leftBtn.disabled = rightBtn.disabled = true;
        return;
    }

    titleEl.textContent = p.name;
    imgEl.src = p.image;
    imgEl.alt = p.name;
    techEl.textContent = `Tech Stack: ${p.tech.join(', ')}`;
    descEl.textContent = `Description: ${p.description}`;
    linkEl.href = p.link;
    linkEl.textContent = p.link.replace(/^https?:\/\//, ''); 
    leftBtn.disabled  = (i === 0);
    rightBtn.disabled = (i === filtered.length - 1);
}

function applyFilters() {
    const type   = typeSelect.value.toLowerCase();
    const status = statusSelect.value.toLowerCase();
    const sortBy = sortSelect.value;

    filtered = allProjects
        .filter(p =>
            (!type   || p.type   === type) &&
            (!status || p.status === status)
        );

    if (sortBy === 'newest') {
        filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
        filtered.sort((a,b) => new Date(a.date) - new Date(b.date));
    } 

    i = 0;
    render();
}

    typeSelect.addEventListener('change', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    leftBtn.addEventListener('click', () => {
    if (i > 0) { i--; render(); }
    });

    rightBtn.addEventListener('click', () => {
    if (i < filtered.length - 1) { i++; render(); }
});

document.addEventListener('DOMContentLoaded', loadData);