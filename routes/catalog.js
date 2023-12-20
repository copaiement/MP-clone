const express = require('express');

const router = express.Router();

// Require controller modules.
const area_controller = require('../controllers/areaController');
const comment_controller = require('../controllers/commentController');
const routename_controller = require('../controllers/routenameController');
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

// /// COMMENT ROUTES ///

// // GET request for creating comment. NOTE This must come before route for id (i.e. display comment).
// router.get('/comment/create', comment_controller.comment_create_get);

// // POST request for creating comment.
// router.post('/comment/create', comment_controller.comment_create_post);

// // GET request to delete comment.
// router.get('/comment/:id/delete', comment_controller.comment_delete_get);

// // POST request to delete comment.
// router.post('/comment/:id/delete', comment_controller.comment_delete_post);

// // GET request for one comment.
// router.get('/comment/:id', comment_controller.comment_detail);


/// ROUTE ROUTES ///

// GET request for creating a route. NOTE This must come before route that displays route (uses id).
router.get('/sector/:id/createroute', routename_controller.routename_create_get);

// POST request for creating route.
router.post('/sector/:id/createroute', routename_controller.routename_create_post);

// GET request to delete route.
router.get('/routename/:id/delete', routename_controller.routename_delete_get);

// POST request to delete route.
router.post('/routename/:id/delete', routename_controller.routename_delete_post);

// GET request to update route.
router.get('/routename/:id/update', routename_controller.routename_update_get);

// POST request to update route.
router.post('/routename/:id/update', routename_controller.routename_update_post);

// GET request for one route.
router.get('/routename/:id', routename_controller.routename_detail);

// GET request for list of all route.
router.get('/routenames', routename_controller.routename_list);

/// SECTOR ROUTES ///

// GET request for creating a sector. NOTE This must come before route that displays sector (uses id).
// only link comes from Area
router.get(
  '/area/:id/createsector',
  sector_controller.sector_create_get,
);

// POST request for creating sector.
router.post(
  '/area/:id/createsector',
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

module.exports = router;
