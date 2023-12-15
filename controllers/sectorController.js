const ObjId = require('mongoose').Types.ObjectId;
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Area = require('../models/area');
const Sector = require('../models/sector');
const Routename = require('../models/routename');

// Display list of all Sectors.
exports.sector_list = asyncHandler(async (req, res, next) => {
  const allSectors = await Sector.find().sort({ sector_name: 1 }).exec();
  res.render('sector_list', {
    title: 'All Sectors',
    sector_list: allSectors,
  });
});

// Display detail page for a specific sector.
exports.sector_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [sector, allSectorRoutes] = await Promise.all([
    Sector.findById(req.params.id).populate('area').exec(),
    Routename.find({ sector: req.params.id }, 'route_name route_type route_grade').sort({ route_grade: 1 }).exec(),
  ]);

  if (sector === null) {
    // No results.
    const err = new Error('sector not found');
    err.status = 404;
    return next(err);
  }

  res.render('sector_detail', {
    title: 'Sector Detail',
    sector: sector,
    routesInSector: allSectorRoutes,
  });
});

// Display Author create form on GET.
exports.sector_create_get = asyncHandler(async (req, res, next) => {
  const allAreas = await Area.find().sort({ area_name: 1 }).exec();
  res.render('sector_form', {
    title: 'Create Sector',
    allAreas: allAreas,
  });
});

exports.sector_create_post = [
  // Validate and sanitize fields.
  body('sector_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Sector name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Sector name has non-alphanumeric characters.'),
  body('area_name')
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

    // Create Sector object with escaped and trimmed data
    const sector = new Sector({
      sector_name: req.body.sector_name,
      area: req.body.area,
      added_date: new Date(),
      added_by: req.body.added_by,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('sector_form', {
        title: 'Create Sector',
        sector: sector,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.

      // Save area.
      await sector.save();
      // Redirect to new area record.
      res.redirect(sector.url);
    }
  }),
];
