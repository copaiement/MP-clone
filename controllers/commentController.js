const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Sector = require('../models/sector');
const Routename = require('../models/routename');
const Comment = require('../models/comment');

// Display comment create form on GET.
exports.comment_create_get = asyncHandler(async (req, res, next) => {
  // need to pass in the route info to attach the comment correctly
  // we are displaying the route detail page again, so need to pull all comments too
  const [route, allRouteComments] = await Promise.all([
    Routename.findById(req.params.id).populate('area sector').exec(),
    Comment.find({ route_name: req.params.id }, 'comment_text added_date added_by').sort({ added_date: 1 }).exec(),
  ]);

  res.render('comment_form', {
    route: route,
    allRouteComments: allRouteComments,
  });
});

exports.comment_create_post = [
  // Validate and sanitize fields.
  body('comment_text')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Comment must have text.')
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
    // pull route object again
    const route = await Routename.findById(req.params.id).populate('sector area').exec();
    // Create Sector object with escaped and trimmed data
    const comment = new Comment({
      route_name: route._id,
      comment_text: req.body.comment_text,
      added_date: new Date(),
      added_by: req.body.added_by,
    });

    if (!errors.isEmpty()) {
      // pull all comments on route
      const allRouteComments = await Comment.find({ route_name: req.params.id }, 'comment_text added_date added_by').sort({ added_date: 1 }).exec();

      // There are errors. Render form again with sanitized values/errors messages.
      res.render('comment_form', {
        allRouteComments: allRouteComments,
        route: route,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.

      // Save area.
      await comment.save();
      // Redirect to new area record.
      res.redirect(route.url);
    }
  }),
];
