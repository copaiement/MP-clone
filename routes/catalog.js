const express = require('express');
const router = express.Router();

// Require controller modules.
const area_controller = require('../controllers/areaController');
const comment_controller = require('../controllers/commentController');
const route_controller = require('../controllers/routeController');
const sector_controller = require('../controllers/sectorController');

/// AREA ROUTES ///

// GET catalog home page.
router.get('/', area_controller.index);

// GET request for creating an area. NOTE This must come before routes that display area (uses id).
router.get('/area/create', area_controller.area_create_get);

// POST request for creating area.
router.post('/area/create', area_controller.area_create_post);

// GET request to delete area.
router.get('/area/:id/delete', area_controller.area_delete_get);

// POST request to delete area.
router.post('/area/:id/delete', area_controller.area_delete_post);

// GET request to update area.
router.get('/area/:id/update', area_controller.area_update_get);

// POST request to update area.
router.post('/area/:id/update', area_controller.area_update_post);

// GET request for one area.
router.get('/area/:id', area_controller.area_detail);

// GET request for list of all area items.
router.get('/areas', area_controller.area_list);

/// COMMENT ROUTES ///

// GET request for creating comment. NOTE This must come before route for id (i.e. display comment).
router.get('/comment/create', comment_controller.comment_create_get);

// POST request for creating comment.
router.post('/comment/create', comment_controller.comment_create_post);

// GET request to delete comment.
router.get('/comment/:id/delete', comment_controller.comment_delete_get);

// POST request to delete comment.
router.post('/comment/:id/delete', comment_controller.comment_delete_post);

// GET request to update comment.
router.get('/comment/:id/update', comment_controller.comment_update_get);

// POST request to update comment.
router.post('/comment/:id/update', comment_controller.comment_update_post);

// GET request for one comment.
router.get('/comment/:id', comment_controller.comment_detail);

// GET request for list of all comments.
router.get('/comments', comment_controller.comment_list);

/// ROUTE ROUTES ///

// GET request for creating a route. NOTE This must come before route that displays route (uses id).
router.get('/route/create', route_controller.route_create_get);

// POST request for creating route.
router.post('/route/create', route_controller.route_create_post);

// GET request to delete route.
router.get('/route/:id/delete', route_controller.route_delete_get);

// POST request to delete route.
router.post('/route/:id/delete', route_controller.route_delete_post);

// GET request to update route.
router.get('/route/:id/update', route_controller.route_update_get);

// POST request to update route.
router.post('/route/:id/update', route_controller.route_update_post);

// GET request for one route.
router.get('/route/:id', route_controller.route_detail);

// GET request for list of all route.
router.get('/routes', route_controller.route_list);

/// SECTOR ROUTES ///

// GET request for creating a sector. NOTE This must come before route that displays sector (uses id).
router.get(
  '/sector/create',
  sector_controller.sector_create_get,
);

// POST request for creating sector.
router.post(
  '/sector/create',
  sector_controller.sector_create_post,
);

// GET request to delete sector.
router.get(
  '/sector/:id/delete',
  sector_controller.sector_delete_get,
);

// POST request to delete sector.
router.post(
  '/sector/:id/delete',
  sector_controller.sector_delete_post,
);

// GET request to update sector.
router.get(
  '/sector/:id/update',
  sector_controller.sector_update_get,
);

// POST request to update sector.
router.post(
  '/sector/:id/update',
  sector_controller.sector_update_post,
);

// GET request for one sector.
router.get('/sector/:id', sector_controller.sector_detail);

// GET request for list of all sector.
router.get('/sectors', sector_controller.sector_list);

module.exports = router;