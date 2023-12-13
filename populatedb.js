#! /usr/bin/env node

console.log('This script populates some Areas, Sectors, Routes, and Comments');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Area = require('./models/area');
const Sector = require('./models/sector');
const Route = require('./models/route');
const Comment = require('./models/comment');

const areas = [];
const sectors = [];
const routes = [];
const comments = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createAreas();
  await createSectors();
  await createRoutes();
  await createComments();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function areaCreate(index, area_name, state, added_by) {
  const area = new Area({
    area_name: area_name,
    state: state,
    added_date: new Date(),
    added_by: added_by,
  });
  await area.save();
  areas[index] = area;
  console.log(`Added area: ${area_name}`);
}

async function sectorCreate(index, sector_name, area, added_by) {
  const sector = new Sector({
    sector_name: sector_name,
    area: area,
    added_date: new Date(),
    added_by: added_by,
  });

  await sector.save();
  sectors[index] = sector;
  console.log(`Added sector: ${sector_name}`);
}

async function routeCreate(index, route_name, route_type, route_grade, area, sector, added_by) {
  const route = new Route({
    route_name: route_name,
    route_type: route_type,
    route_grade: route_grade,
    area: area,
    sector: sector,
    added_date: new Date(),
    added_by: added_by,
  });

  await route.save();
  routes[index] = route;
  console.log(`Added route: ${route_name}`);
}

async function commentCreate(index, route_name, comment_text, added_by) {
  const comment = new Comment({
    route_name: route_name,
    comment_text: comment_text,
    added_date: new Date(),
    added_by: added_by,
  });
  await comment.save();
  comments[index] = comment;
  console.log(`Added comment: ${comment_text}`);
}

async function createAreas() {
  console.log('Adding areas');
  await Promise.all([
    areaCreate(0, 'Mt Charleston', 'Nevada', 'CP'),
    areaCreate(1, 'Mt Potosi', 'Nevada', 'cp'),
    areaCreate(2, 'Maple Canyon', 'Utah', 'Cp'),
  ]);
}

async function createSectors() {
  console.log('Adding sectors');
  await Promise.all([
    sectorCreate(0, 'The Hood', areas[0], 'CeePee'),
    sectorCreate(1, 'The Roost', areas[0], 'CePe'),
    sectorCreate(2, 'Clear Light Cave', areas[1], 'C.P.'),
    sectorCreate(3, 'Pipedream Cave', areas[2], 'CP.'),
  ]);
}

async function createRoutes() {
  console.log('Adding Routes');
  await Promise.all([
    routeCreate(0, 'Infections Groove', 'Sport', '5.13b', areas[0], sectors[0], 'ColeP'),
    routeCreate(1, 'Ghetto Boys', 'Sport', '5.13c', areas[0], sectors[0], 'ColePa'),
    routeCreate(2, 'T.H.E Cat', 'Sport', '5.13b', areas[0], sectors[1], 'ColeP'),
    routeCreate(3, 'All You Can Eat', 'Sport', '5.15a', areas[1], sectors[2], 'ColeP'),
    routeCreate(4, 'T-rex', 'Sport', '5.14a', areas[2], sectors[3], 'CoP'),
  ]);
}

async function createComments() {
  console.log('Adding Comments');
  await Promise.all([
    commentCreate(0, routes[0], 'Great line', 'Cole'),
    commentCreate(1, routes[1], 'Idk man, here is a comment', 'Colep'),
    commentCreate(2, routes[2], 'Another route. Another comment', 'ColePai')
  ]);
}