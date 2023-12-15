const ObjId = require('mongoose').Types.ObjectId;
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Area = require('../models/area');
const Sector = require('../models/sector');
const Routename = require('../models/routename');

// Index page
exports.index = asyncHandler(async (req, res, next) => {
  // Get details of areas, sectors, and route counts (in parallel)
  const [
    numAreas,
    numSectors,
    numRoutenames,
  ] = await Promise.all([
    Area.countDocuments({}).exec(),
    Sector.countDocuments({}).exec(),
    Routename.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Route Database Home',
    area_count: numAreas,
    sector_count: numSectors,
    route_count: numRoutenames,
  });
});

// Display list of all Areas.
exports.area_list = asyncHandler(async (req, res, next) => {
  const allAreas = await Area.find().sort({ area_name: 1 }).exec();
  res.render('area_list', {
    title: 'All Areas',
    area_list: allAreas,
  });
});

// Display detail page for a specific Area.
exports.area_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [area, allSectors] = await Promise.all([
    Area.findById(req.params.id).exec(),
    Sector.find({ area: req.params.id }, 'sector_name').sort({ sector_name: 1 }).exec(),
  ]);

  if (area === null) {
    // No results.
    const err = new Error('Area not found');
    err.status = 404;
    return next(err);
  }

  res.render('area_detail', {
    title: 'Area Detail',
    area: area,
    sectors: allSectors,
  });
});

// Display Author create form on GET.
exports.area_create_get = (req, res, next) => {
  res.render('area_form', { title: 'Create Area' });
};

exports.area_create_post = [
  // Validate and sanitize fields.
  body('area_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Area name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Area name has non-alphanumeric characters.'),
  body('state')
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

    // Create Author object with escaped and trimmed data
    const area = new Area({
      area_name: req.body.area_name,
      state: req.body.state,
      added_date: new Date(),
      added_by: req.body.added_by,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('area_form', {
        title: 'Create Area',
        area: area,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.

      // Save area.
      await area.save();
      // Redirect to new area record.
      res.redirect(area.url);
    }
  }),
];

// Display Author delete form on GET.
exports.area_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [area, allAreaSectors] = await Promise.all([
    Area.findById(req.params.id).exec(),
    Sector.aggregate([
      {
        $match: {
          area: new ObjId(req.params.id),
        },
      },
      {
        $lookup: {
          from: 'routenames',
          localField: '_id',
          foreignField: 'sector',
          as: 'routenames',
        },
      },
      {
        $project: {
          _id: 0,
          sector_name: 1,
          url: 1,
          count: { $size: '$routenames' },
        },
      },
    ]).exec(),
  ]);

  if (area === null) {
    // No results.
    res.redirect('/catalog/areas');
  }

  res.render('area_delete', {
    title: 'Delete Area',
    area: area,
    area_sectors: allAreaSectors,
  });
});

// Handle Author delete on POST.
exports.area_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of area and area sectors (in parallel)
  const [area, allAreaSectors] = await Promise.all([
    Area.findById(req.params.id).exec(),
    Sector.aggregate([
      {
        $match: {
          area: new ObjId(req.params.id),
        },
      },
      {
        $lookup: {
          from: 'routenames',
          localField: '_id',
          foreignField: 'sector',
          as: 'routenames',
        },
      },
      {
        $project: {
          _id: 0,
          sector_name: 1,
          url: 1,
          count: { $size: '$routenames' },
        },
      },
    ]).exec(),
  ]);

  if (allAreaSectors.length > 0) {
    // Area has Sectors. Render in same way as for GET route.
    res.render('area_delete', {
      title: 'Delete Area',
      area: area,
      area_sectors: allAreaSectors,
    });
  } else {
    // Area has no Sectors. Delete object and redirect to the list of areas.
    await Area.findByIdAndDelete(req.body.areaid);
    res.redirect('/catalog/areas');
  }
});

// Display Author update form on GET
exports.area_update_get = asyncHandler(async (req, res, next) => {
  const area = await Area.findById(req.params.id).exec();

  if (area === null) {
    // No results
    const err = new Error('Area not found');
    err.status = 404;
    return next(err);
  }

  res.render('area_form', {
    title: 'Update Area',
    area: area,
  });
});

exports.area_update_post = [
  // Validate and sanitize fields.
  body('area_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Area name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Area name has non-alphanumeric characters.'),
  body('state')
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

    // Create Author object with escaped and trimmed data
    const area = new Area({
      area_name: req.body.area_name,
      state: req.body.state,
      added_date: new Date(),
      added_by: req.body.added_by,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('area_form', {
        title: 'Update Area',
        area: area,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record
      const updatedArea = await Area.findByIdAndUpdate(req.params.id, area, {});
      // Redirect to new area record.
      res.redirect(updatedArea.url);
    }
  }),
];
