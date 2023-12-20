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
    title: 'Add comment',
    route: route,
    allRouteComments: allRouteComments,
  });
});
