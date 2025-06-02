// backend/models/ChargingStation.js
import mongoose from 'mongoose';

const chargingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charging station name is required'],
      trim: true,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates (longitude, latitude) are required'],
        index: '2dsphere' // Create a geospatial index for location queries
      },
      address: { // Optional: human-readable address
        type: String,
        trim: true,
      }
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Under Maintenance', 'Coming Soon'],
      default: 'Active',
      required: true,
    },
    powerOutput: { // in kW
      type: Number,
      required: [true, 'Power output (kW) is required'],
      min: [0, 'Power output cannot be negative'],
    },
    connectorType: { // E.g., "Type 2", "CCS", "CHAdeMO", "J1772"
      type: String,
      required: [true, 'Connector type is required'],
      trim: true,
    },
    // You might want to add more fields like:
    // pricing: String, (e.g., "Free", "$0.25/kWh", "$1.00/hour")
    // amenities: [String], (e.g., ["WiFi", "Restroom", "Cafe"])
    // operatingHours: String,
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // If stations are owned by users
  },
  {
    timestamps: true,
  }
);

// Helper to transform coordinates for frontend (lat, lng) if needed
// ChargingStationSchema.virtual('frontendLocation').get(function() {
//   if (this.location && this.location.coordinates) {
//     return { lat: this.location.coordinates[1], lng: this.location.coordinates[0] };
//   }
//   return null;
// });
// ChargingStationSchema.set('toObject', { virtuals: true });
// ChargingStationSchema.set('toJSON', { virtuals: true });


const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

export default ChargingStation;