// // backend/routes/stationRoutes.js
// import express from 'express';
// import {
//   createStation,
//   getAllStations,
//   getStationById,
//   updateStation,
//   deleteStation,
// } from '../controllers/stationController.js';
// import { protect } from '../middleware/authMiddleware.js'; // To protect routes

// const router = express.Router();

// // For CRUD operations on stations
// router.route('/')
//   .post(protect, createStation) // Only authenticated users can create
//   .get(getAllStations);       // Listing stations can be public or protected

// router.route('/:id')
//   .get(getStationById)         // Getting a single station can be public or protected
//   .put(protect, updateStation)   // Only authenticated users can update
//   .delete(protect, deleteStation); // Only authenticated users can delete

// export default router;
// backend/routes/stationRoutes.js
import express from 'express';
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
  findTenNearestStations, 
  findNearestStation,     
} from '../controllers/stationController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/near/ten', findTenNearestStations);
router.get('/near/closest', findNearestStation);


router.route('/')
  .post(protect, createStation)
  .get(getAllStations);

router.route('/:id')
  .get(getStationById)
  .put(protect, updateStation)
  .delete(protect, deleteStation);

export default router;