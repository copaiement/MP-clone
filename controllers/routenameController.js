const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Area = require('../models/area');
const Sector = require('../models/sector');
const Routename = require('../models/routename');
const Comment = require('../models/comment');

// Display list of all Routes.
exports.routename_list = asyncHandler(async (req, res, next) => {
  const allRoutes = await Routename.find().sort({ route_name: 1 }).populate('area').exec();
  res.render('routename_list', {
    title: 'All Routes',
    route_list: allRoutes,
  });
});

// Display detail page for a specific route.
exports.routename_detail = asyncHandler(async (req, res, next) => {
  // Get details of route and all the comments (in parallel)
  const [route, allRouteComments] = await Promise.all([
    Routename.findById(req.params.id).populate('area sector').exec(),
    Comment.find({ route_name: req.params.id }, 'comment_text added_date added_by').sort({ added_date: 1 }).exec(),
  ]);
  
  if (route === null) {
    // No results.
    const err = new Error('Route not found');
    err.status = 404;
    return next(err);
  }

  res.render('routename_detail', {
    title: 'Route Detail',
    route: route,
    allRouteComments: allRouteComments,
  });
});

// Display Route create form on GET.
exports.routename_create_get = asyncHandler(async (req, res, next) => {
  const [allAreas, allSectors] = await Promise.all([
    Area.find().exec(),
    Sector.find().populate('area').exec(),
  ]);

  res.render('routename_form', {
    title: 'Create Route',
    allAreas: allAreas,
    allSectors: allSectors,
  });
});
