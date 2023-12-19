const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Area = require('../models/area');
const Sector = require('../models/sector');
const Routename = require('../models/routename');

// Display detail page for a specific sector.
exports.sector_detail = asyncHandler(async (req, res, next) => {
  // Get details of sector and all the routes (in parallel)
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

// Display Sector create form on GET.
exports.sector_create_get = asyncHandler(async (req, res, next) => {
  const area = await Area.findById(req.params.id).exec();

  res.render('sector_form', {
    title: 'Create Sector',
    area: area,
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
      area: req.params.id,
      added_date: new Date(),
      added_by: req.body.added_by,
    });

    if (!errors.isEmpty()) {
      // get area again
      const area = await Area.findById(req.params.id).exec();
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('sector_form', {
        title: 'Create Sector',
        area: area,
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

// Display Area delete form on GET.
exports.sector_delete_get = asyncHandler(async (req, res, next) => {
  // Get details sector and routes in sector (in parallel)
  const [sector, allSectorRoutes] = await Promise.all([
    Sector.findById(req.params.id).exec(),
    Routename.find({ sector: req.params.id }, 'route_name route_type route_grade').sort({ route_grade: 1 }).exec(),
  ]);

  if (sector === null) {
    // No results.
    res.redirect('/catalog/sectors');
  }

  res.render('sector_delete', {
    title: 'Delete Sector',
    sector: sector,
    sector_routes: allSectorRoutes,
  });
});

// Handle Author delete on POST.
exports.sector_delete_post = asyncHandler(async (req, res, next) => {
  // Get details sector and routes in sector (in parallel)
  const [sector, allSectorRoutes] = await Promise.all([
    Sector.findById(req.params.id).exec(),
    Routename.find({ sector: req.params.id }, 'route_name route_type route_grade').sort({ route_grade: 1 }).exec(),
  ]);

  if (allSectorRoutes.length > 0) {
    // Area has Sectors. Render in same way as for GET route.
    res.render('sector_delete', {
      title: 'Delete Sector',
      sector: sector,
      sector_routes: allSectorRoutes,
    });
  } else {
    // Area has no Sectors. Delete object and redirect to the list of areas.
    const areaId = sector.area;
    await Sector.findByIdAndDelete(req.body.sectorid);
    res.redirect('catalog/areas');
  }
});

// Display sector update form on GET
exports.sector_update_get = asyncHandler(async (req, res, next) => {
  const [sector, allAreas] = await Promise.all([
    Sector.findById(req.params.id).exec(),
    Area.find().sort({ area_name: 1 }).exec(),
  ]);

  if (sector === null) {
    // No results
    const err = new Error('Sector not found');
    err.status = 404;
    return next(err);
  }

  res.render('sector_form', {
    title: 'Update Sector',
    sector: sector,
    allAreas: allAreas,
  });
});

exports.sector_update_post = [
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
      _id: req.params.id,
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
      const updatedSector = await Sector.findByIdAndUpdate(req.params.id, sector, {});
      // Redirect to new area record.
      res.redirect(updatedSector.url);
    }
  }),
];
