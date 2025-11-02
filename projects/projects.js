import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
console.log('Fetched projects:', projects);

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector(".projects-title");
const count = projects.length;
title.textContent = `${count} Projects! :O`;

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

function renderPieChart(projectsGiven) {
  
  let rolledData = d3.rollups(
  projectsGiven,
  (v) => v.length,
  (d) => d.year,
);

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  let newsliceGenerator = d3.pie().value((d) => d.value);
  let newarcData = newsliceGenerator(data);
  let arcs = newarcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select("svg");
  svg.selectAll("path").remove();
  let selectedIndex = -1;

  let legend = d3.select('.legend');
  legend.selectAll("li").remove();

  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr("class", "category")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

  arcs.forEach((arc, i) => {
  svg.append('path')
  .attr('d', arc)
  .attr('fill', colors(i))
  .on("click",() => {
      selectedIndex = selectedIndex === i ? -1 : i;
      svg.selectAll('path')
      .attr('class', (_, idx) => (
        idx === selectedIndex ? 'slice selected' : 'slice'));

      legend.selectAll('li')
      .attr('class', (_, idx) => (
        idx === selectedIndex ? 'category selected' : 'category'));
    
    if (selectedIndex === -1) {
      console.log("unclicked");
      renderProjects(projects, projectsContainer, 'h2');
    } else {
      let selectedYear = data[selectedIndex].label;
      console.log('Selected year:', selectedYear);
      let filteredProjects = projects.filter(project => project.year === selectedYear);
      renderProjects(filteredProjects, projectsContainer, 'h2');
    }
  });
  });
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
  let values= Object.values(project).join('\n').toLowerCase();
  return values.includes(query.toLowerCase());
});
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);

});



