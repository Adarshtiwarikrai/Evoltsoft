import asyncHandler from 'express-async-handler';
import ChargingStation from '../models/ChargingStation.js';

const createStation = asyncHandler(async (req, res) => {
  const { name, location, status, powerOutput, connectorType } = req.body;

  if (!name || !location || !location.coordinates || location.coordinates.length !== 2 || !powerOutput || !connectorType) {
    res.status(400);
    throw new Error('Please provide all required fields: name, location (coordinates [lng, lat]), powerOutput, connectorType');
  }

  const [lng, lat] = location.coordinates.map(Number);
  if (isNaN(lng) || isNaN(lat)) {
      res.status(400);
      throw new Error('Invalid coordinates. Longitude and Latitude must be numbers.');
  }

  const station = new ChargingStation({
    name,
    location: {
      type: 'Point',
      coordinates: [lng, lat],
      address: location.address || ''
    },
    status: status || 'Active',
    powerOutput: Number(powerOutput),
    connectorType,
  });

  const createdStation = await station.save();
  res.status(201).json(createdStation);
});

const getAllStations = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.connectorType) {
    query.connectorType = { $regex: req.query.connectorType, $options: 'i' };
  }
  if (req.query.minPower) {
    query.powerOutput = { $gte: Number(req.query.minPower) };
  }

  const stations = await ChargingStation.find(query);
  res.json(stations);
});

const getStationById = asyncHandler(async (req, res) => {
  const station = await ChargingStation.findById(req.params.id);

  if (station) {
    res.json(station);
  } else {
    res.status(404);
    throw new Error('Charging station not found');
  }
});

const updateStation = asyncHandler(async (req, res) => {
  const station = await ChargingStation.findById(req.params.id);

  if (!station) {
    res.status(404);
    throw new Error('Charging station not found');
  }

  const { name, location, status, powerOutput, connectorType } = req.body;

  station.name = name || station.name;
  if (location && location.coordinates && location.coordinates.length === 2) {
    const [lng, lat] = location.coordinates.map(Number);
    if (!isNaN(lng) && !isNaN(lat)) {
        station.location.coordinates = [lng, lat];
        station.location.address = location.address || station.location.address;
    } else {
        res.status(400);
        throw new Error('Invalid coordinates for update. Longitude and Latitude must be numbers.');
    }
  } else if (location && (!location.coordinates || location.coordinates.length !== 2)) {
    res.status(400);
    throw new Error('Invalid location data. Ensure coordinates [lng, lat] are provided and are an array of two numbers.');
  }

  station.status = status || station.status;
  station.powerOutput = powerOutput !== undefined ? Number(powerOutput) : station.powerOutput;
  station.connectorType = connectorType || station.connectorType;

  const updatedStation = await station.save();
  res.json(updatedStation);
});

const deleteStation = asyncHandler(async (req, res) => {
  const station = await ChargingStation.findById(req.params.id);

  if (!station) {
    res.status(404);
    throw new Error('Charging station not found');
  }

  await station.deleteOne();
  res.json({ message: 'Charging station removed successfully' });
});

const findTenNearestStations = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistance } = req.query;

  if (!lng || !lat) {
    res.status(400);
    throw new Error('Please provide longitude (lng) and latitude (lat) query parameters.');
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);

  if (isNaN(longitude) || isNaN(latitude)) {
    res.status(400);
    throw new Error('Invalid coordinates. Longitude and Latitude must be numbers.');
  }

  const queryGeo = {
    'location.coordinates': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    },
  };

  if (maxDistance) {
    const distanceInMeters = parseFloat(maxDistance) * 1000;
    if (isNaN(distanceInMeters) || distanceInMeters <= 0) {
        res.status(400);
        throw new Error('Invalid maxDistance. It must be a positive number (in kilometers).');
    }
    queryGeo['location.coordinates'].$nearSphere.$maxDistance = distanceInMeters;
  }

  const stations = await ChargingStation.find(queryGeo).limit(10);

  if (stations && stations.length > 0) {
    res.json(stations);
  } else {
    res.status(404).json({ message: 'No stations found near the specified location or within the given distance.' });
  }
});

const findNearestStation = asyncHandler(async (req, res) => {
  const { lng, lat } = req.query;

  if (!lng || !lat) {
    res.status(400);
    throw new Error('Please provide longitude (lng) and latitude (lat) query parameters.');
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);

  if (isNaN(longitude) || isNaN(latitude)) {
    res.status(400);
    throw new Error('Invalid coordinates. Longitude and Latitude must be numbers.');
  }

  const station = await ChargingStation.findOne({
    'location.coordinates': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    },
  });

  if (station) {
    res.json(station);
  } else {
    res.status(404);
    throw new Error('No charging station found near the specified location.');
  }
});

export {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
  findTenNearestStations,
  findNearestStation,
};