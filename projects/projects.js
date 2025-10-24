import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
console.log('Fetched projects:', projects);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector(".projects-title");
const count = projects.length;
title.textContent = `${count} Projects! :O`;