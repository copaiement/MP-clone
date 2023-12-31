const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
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
  // need to pass in the sector information since route has no info to start
  const sector = await Sector.findById(req.params.id).populate('area').exec();

  res.render('routename_form', {
    title: 'Create Route',
    sector: sector,
  });
});

exports.routename_create_post = [
  // Validate and sanitize fields.
  body('route_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Route name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Sector name has non-alphanumeric characters.'),
  body('route_type')
    .escape(),
  body('route_grade')
    .escape(),
  body('added_by')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Username must be specified.')
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters.'),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // pull sector object again
    const sector = await Sector.findById(req.params.id).populate('area').exec();
    // Create Sector object with escaped and trimmed data
    const route = new Routename({
      route_name: req.body.route_name,
      area: sector.area._id,
      sector: req.params.id,
      route_type: req.body.route_type,
      route_grade: req.body.route_grade,
      added_date: new Date(),
      added_by: req.body.added_by,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('routename_form', {
        title: 'Create Route',
        route: route,
        sector: sector,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.

      // Save area.
      await route.save();
      // Redirect to new area record.
      res.redirect(route.url);
    }
  }),
];

// Display Route delete form on GET.
exports.routename_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of route
  const route = await Routename.findById(req.params.id).populate('area sector').exec();

  if (route === null) {
    // No results.
    res.redirect('/catalog/sectors');
  }

  res.render('routename_delete', {
    title: 'Delete Route',
    route: route,
  });
});

// Handle route delete on POST.
exports.routename_delete_post = asyncHandler(async (req, res, next) => {
  const route = await Routename.findById(req.params.id).populate('sector').exec();
  await Routename.findByIdAndDelete(req.body.routeid);
  res.redirect(route.sector.url);
});

// Display route update form on GET
exports.routename_update_get = asyncHandler(async (req, res, next) => {
  const route = await Routename.findById(req.params.id).populate('area sector').exec();

  if (route === null) {
    // No results
    const err = new Error('Route not found');
    err.status = 404;
    return next(err);
  }

  res.render('routename_form', {
    title: 'Update Route',
    route: route,
  });
});

// Handle route update on POST
exports.routename_update_post = [
  // Validate and sanitize fields.
  body('route_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Route name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Sector name has non-alphanumeric characters.'),
  body('route_type')
    .escape(),
  body('route_grade')
    .escape(),
  body('added_by')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Username must be specified.')
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters.'),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // pull existing route info for Sector and Area ids
    const oldRoute = await Routename.findById(req.params.id).exec();

    // Create Route object with escaped and trimmed data
    const route = new Routename({
      route_name: req.body.route_name,
      area: oldRoute.area,
      sector: oldRoute.sector,
      route_type: req.body.route_type,
      route_grade: req.body.route_grade,
      added_date: oldRoute.added_date,
      added_by: req.body.added_by,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('routename_form', {
        title: 'Update Route',
        route: route,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record
      const updatedRoute = await Routename.findByIdAndUpdate(req.params.id, route, {});
      // Redirect to updated route record
      res.redirect(updatedRoute.url);
    }
  }),
];
