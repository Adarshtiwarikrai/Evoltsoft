<template>
  <div
    ref="mapComponentRoot"
    class="map-component-root"
    :style="{ height: mapHeightComputed, width: '100%' }"
  >
    <div v-if="showDebug" style="position:absolute; top:5px; left:5px; background:rgba(255,255,220,0.9); z-index:2000; padding:4px; border:1px solid #ccc; font-size:11px; max-width: 240px; border-radius:3px;">
      <p style="font-weight:bold; margin:0 0 2px;">ChargerMap Debug:</p>
      <p style="margin:1px 0;">UserLoc Prop:
        <strong :style="{color: props.userLocation ? 'green' : 'red'}">
          {{ props.userLocation ? `${props.userLocation.lat.toFixed(3)}, ${props.userLocation.lng.toFixed(3)}` : 'N/A' }}
        </strong>
      </p>
      <p style="margin:1px 0;">UserMarkerLatLng:
        <strong :style="{color: userMarkerLatLng ? 'green' : 'red'}">
         {{ userMarkerLatLng ? `${userMarkerLatLng[0].toFixed(3)}, ${userMarkerLatLng[1].toFixed(3)}` : 'N/A' }}
        </strong>
      </p>
      <p style="margin:1px 0;">MapFullyInit: <strong :style="{color: mapFullyInitialized ? 'green':'red'}">{{ mapFullyInitialized }}</strong> | LeafletObj: <strong :style="{color: !!leafletMapObject ? 'green':'red'}">{{!!leafletMapObject}}</strong></p>
      <p style="margin:1px 0;">Stations: {{ validStations.length }} (Valid) / {{ props.stations ? props.stations.length : 0 }} (Received)</p>
      <p style="margin:1px 0;">isMouseOverPopup: <strong :style="{color: isMouseOverPopupElementRef ? 'blue' : 'gray'}">{{ isMouseOverPopupElementRef }}</strong></p>
      <p style="margin:1px 0;">CurrentStationID: {{ currentlyInteractingStationIdRef || 'None' }}</p>
      <p style="margin:1px 0;">Error: <span :style="{color: initializationError ? 'red':'inherit'}">{{ initializationError || 'None' }}</span></p>
    </div>
    <l-map
      v-if="renderLMap"
      ref="lMapInstance"
      :zoom="currentZoom"
      :center="currentCenter"
      @ready="onLMapReady"
      style="height: 100%; width: 100%; background-color: #e0e0e0;"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        :attribution="'© OSM'"
      ></l-tile-layer>
      <template v-if="mapFullyInitialized && leafletMapObject && validStations.length > 0">
        <l-marker
          v-for="station in validStations"
          :key="'station-' + station._id"
          :lat-lng="getLeafletCoords(station)"
          :icon="chargingStationIcon"
          :ref="el => setMarkerRef(el, station._id)"
          @mouseover="handleMarkerMouseOver(station)"
          @mouseleave="handleMarkerMouseLeave(station)"
        >
          <l-popup
            :options="{ minWidth: 250, className: 'charger-popup-custom' }"
            @mouseover="handlePopupMouseOver(station)"
            @mouseleave="handlePopupMouseLeave(station)"
          >
            <div class="popup-content">
              <strong class="popup-title">{{ station.name || 'N/A' }}</strong>
              
              <p><strong>Status:</strong> <span :class="statusColorClass(station.status)">{{ station.status || 'N/A' }}</span></p>
              
              <p v-if="station.powerOutput"><strong>Power:</strong> {{ station.powerOutput }} kW</p>
              
              <p v-if="station.connectorType"><strong>Connector:</strong> {{ station.connectorType }}</p>

              <p v-if="getLeafletCoords(station)">
                <strong>Coords:</strong>
                {{ getLeafletCoords(station)[0].toFixed(5) }}, {{ getLeafletCoords(station)[1].toFixed(5) }}
              </p>
              
              <p v-if="station.address"><strong>Address:</strong> {{ station.address }}</p>
              
              <div class="popup-actions">
                <button
                  v-if="props.userLocation"
                  @click="() => $emit('get-directions', station)"
                  class="directions-button">
                  Directions
                </button>
                <button
                  v-if="userMarkerLatLng"
                  @click="() => handleShowRouteClickForStation(station)"
                  class="route-button">
                  Show Route
                </button>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </template>

      <l-marker
        v-if="mapFullyInitialized && leafletMapObject && userMarkerLatLng"
        key="user-location-marker"
        :lat-lng="userMarkerLatLng"
        :icon="userLocationIcon"
        :z-index-offset="1000"
      >
        <l-popup> Your Location </l-popup>
      </l-marker>
    </l-map>
    <div v-if="!renderLMap && !initializationError" style="display:flex; align-items:center; justify-content:center; height:100%; background:#f0f0f0; color:#777;">
      Preparing map...
    </div>
    <div v-if="initializationError && !renderLMap" style="display:flex; align-items:center; justify-content:center; height:100%; background:#fff0f0; color:red; padding:10px; text-align:center;">
      Map Error (Pre-Render): {{ initializationError }}
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const userLocationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const chargingStationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default {
  name: 'ChargerMap',
  components: { LMap, LTileLayer, LMarker, LPopup },
  props: {
    stations: { type: Array, required: true, default: () => [] },
    mapHeight: { type: String, default: '500px' },
    userLocation: { type: Object, default: null }
  },
  emits: ['get-directions'],
  setup(props, { emit }) {
    const mapComponentRoot = ref(null);
    const lMapInstance = ref(null);
    const leafletMapObject = ref(null);
    const routePolylineLayer = ref(null);
    const markerRefs = ref(new Map());
    
    const popupCloseTimeout = ref(null);
    const currentlyInteractingStationIdRef = ref(null);
    const isMouseOverPopupElementRef = ref(false);
    const POPUP_CLOSE_DELAY = 30;

    const defaultMapCenter = ref([20.5937, 78.9629]);
    const currentZoom = ref(5);
    
    const mapFullyInitialized = ref(false);
    const initializationError = ref(null);
    const renderLMap = ref(false);
    const showDebug = ref(false);

    const mapHeightComputed = computed(() => props.mapHeight || '400px');

    const getLeafletCoords = (station) => {
      if (!station?.location?.coordinates || station.location.coordinates.length !== 2) return null;
      const dbLng = parseFloat(station.location.coordinates[0]);
      const dbLat = parseFloat(station.location.coordinates[1]);
      if (isNaN(dbLat) || isNaN(dbLng) || dbLat < -90 || dbLat > 90 || dbLng < -180 || dbLng > 180) return null;
      return [dbLat, dbLng];
    };

    const validStations = computed(() => {
      if (!props.stations || !Array.isArray(props.stations)) return [];
      return props.stations.filter((station) => getLeafletCoords(station) !== null);
    });

    const userMarkerLatLng = computed(() => {
        if (props.userLocation && typeof props.userLocation.lat === 'number' && typeof props.userLocation.lng === 'number') {
            return [props.userLocation.lat, props.userLocation.lng];
        }
        return null;
    });

    const currentCenter = computed(() => {
      return userMarkerLatLng.value ? userMarkerLatLng.value : defaultMapCenter.value;
    });

    const fitMapToBounds = async () => {
      if (!leafletMapObject.value || !mapFullyInitialized.value) return;
      await nextTick();
      const pointsToInclude = [];
      if (userMarkerLatLng.value) pointsToInclude.push(userMarkerLatLng.value);
      validStations.value.forEach(station => {
        const coord = getLeafletCoords(station);
        if (coord) pointsToInclude.push(coord);
      });
      if (routePolylineLayer.value && leafletMapObject.value.hasLayer(routePolylineLayer.value)) {
          const routeBounds = routePolylineLayer.value.getBounds();
          if(routeBounds.isValid()) {
              let combinedBounds = L.latLngBounds(pointsToInclude.length > 0 ? pointsToInclude : routeBounds);
              if (pointsToInclude.length > 0 && !combinedBounds.equals(routeBounds)) combinedBounds.extend(routeBounds);
              if(combinedBounds.isValid()){ leafletMapObject.value.fitBounds(combinedBounds, { padding: [50, 50], maxZoom: 17 }); return; }
          }
      }
      if (pointsToInclude.length === 0) { leafletMapObject.value.setView(defaultMapCenter.value, 5); return; }
      if (pointsToInclude.length === 1) { leafletMapObject.value.setView(pointsToInclude[0], 15); }
      else {
        try {
          const bounds = L.latLngBounds(pointsToInclude);
          if (bounds.isValid()) leafletMapObject.value.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
          else leafletMapObject.value.setView(currentCenter.value, 13);
        } catch (e) { leafletMapObject.value.setView(currentCenter.value, 13); }
      }
    };
    const onLMapReady = async () => {
      if (lMapInstance.value?.leafletObject) {
        leafletMapObject.value = lMapInstance.value.leafletObject;
        try {
            leafletMapObject.value.invalidateSize({debounceMoveend: true});
            mapFullyInitialized.value = true;
            await fitMapToBounds();
            initializationError.value = null;
        } catch (e) {
            initializationError.value = `Error in onLMapReady: ${e.message}`;
            mapFullyInitialized.value = false;
        }
      } else {
        initializationError.value = "@ready: LMap instance or leafletObject not found.";
        mapFullyInitialized.value = false;
      }
    };
    const attemptRenderLMap = () => {
        if (renderLMap.value) return;
        if (mapComponentRoot.value && mapComponentRoot.value.clientHeight >= 50) {
          renderLMap.value = true;
          initializationError.value = null;
        } else {
          const currentHeight = mapComponentRoot.value?.clientHeight;
          const msg = `Container height too small (${currentHeight}px). LMap rendering deferred.`;
          if (!initializationError.value?.includes("Container height")) initializationError.value = msg;
        }
    };

    onMounted(async () => {
      initializationError.value = null; mapFullyInitialized.value = false; leafletMapObject.value = null; renderLMap.value = false;
      if (routePolylineLayer.value) routePolylineLayer.value = null;
      await nextTick();
      setTimeout(attemptRenderLMap, 150);
    });
    onBeforeUnmount(() => {
      clearPopupCloseTimer();
      if (routePolylineLayer.value && leafletMapObject.value?.hasLayer(routePolylineLayer.value)) leafletMapObject.value.removeLayer(routePolylineLayer.value);
      routePolylineLayer.value = null;
      leafletMapObject.value = null;
      mapFullyInitialized.value = false;
      renderLMap.value = false;
    });

    watch(() => props.userLocation, async (newUserLocation) => {
      if (!renderLMap.value) attemptRenderLMap();
      if (mapFullyInitialized.value && leafletMapObject.value) await fitMapToBounds();
      if (routePolylineLayer.value && leafletMapObject.value && !newUserLocation) {
          leafletMapObject.value.removeLayer(routePolylineLayer.value); routePolylineLayer.value = null;
      }
    }, { deep: true });
    watch(validStations, async (newStations, oldStations) => {
      if (!renderLMap.value) attemptRenderLMap();
      if (mapFullyInitialized.value && leafletMapObject.value) {
        if (newStations.length !== oldStations?.length || !userMarkerLatLng.value) await fitMapToBounds();
      }
    }, { deep: true });
    watch(() => props.mapHeight, async () => {
        await nextTick();
        if (!renderLMap.value) attemptRenderLMap();
        if (leafletMapObject.value && mapFullyInitialized.value) {
            leafletMapObject.value.invalidateSize();
            await fitMapToBounds();
        }
    });

    const drawRoutePolyline = (coords) => {
        if (!leafletMapObject.value) return;
        if (routePolylineLayer.value) leafletMapObject.value.removeLayer(routePolylineLayer.value);
        if (!coords || coords.length < 2) return;
        routePolylineLayer.value = L.polyline(coords, { color: 'blue', weight: 5, opacity: 0.5 }).addTo(leafletMapObject.value);
        fitMapToBounds();
    };
    const fetchAndDisplayRoute = async (start, end) => {
        if (!start || !end) { initializationError.value = "Missing route start/end"; return; }
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        try {
            const res = await fetch(url); const data = await res.json();
            if (data.routes && data.routes[0]?.geometry?.coordinates) {
                const leafletCoords = data.routes[0].geometry.coordinates.map(c => [c[1],c[0]]).filter(c=>c && c.length === 2 && typeof c[0] === 'number' && typeof c[1] === 'number');
                if (leafletCoords.length < 2) { console.error("Route data invalid"); return; }
                drawRoutePolyline(leafletCoords);
            } else { console.error("No OSRM route found: " + (data.code || "Unknown error")); }
        } catch (e) { console.error("Failed to get OSRM route: " + e.message); }
    };
    const handleShowRouteClickForStation = (station) => {
        if (userMarkerLatLng.value && station) {
            const stationLatLng = getLeafletCoords(station);
            if (stationLatLng) fetchAndDisplayRoute(userMarkerLatLng.value, stationLatLng);
            else console.error("Station location invalid for routing.");
        } else if (!userMarkerLatLng.value) {
             console.error("Your location unavailable for routing.");
        }
    };
    
    const clearPopupCloseTimer = () => {
      if (popupCloseTimeout.value) {
        clearTimeout(popupCloseTimeout.value);
        popupCloseTimeout.value = null;
      }
    };

    
    const handleMarkerMouseOver = (station) => {
      
      clearPopupCloseTimer();
      currentlyInteractingStationIdRef.value = station._id;
      isMouseOverPopupElementRef.value = false; 

      const markerComponent = markerRefs.value.get(station._id);
      if (markerComponent && markerComponent.leafletObject) {
        if (!markerComponent.leafletObject.isPopupOpen()) {
          markerComponent.leafletObject.openPopup();
        }
      }
      
    };

    
    const handleMarkerMouseLeave = (station) => {
      
      
      
      clearPopupCloseTimer();
      popupCloseTimeout.value = setTimeout(() => {
        const markerComponent = markerRefs.value.get(station._id);
        
        
        
        if (
          !isMouseOverPopupElementRef.value &&
          currentlyInteractingStationIdRef.value === station._id &&
          markerComponent && markerComponent.leafletObject && markerComponent.leafletObject.isPopupOpen()
        ) {
          
          markerComponent.leafletObject.closePopup();
        }
        
      }, POPUP_CLOSE_DELAY);
    };

    
    const handlePopupMouseOver = (station) => {
      
      
      if (currentlyInteractingStationIdRef.value === station._id) {
        isMouseOverPopupElementRef.value = true;
        clearPopupCloseTimer(); 
      }
    };

    
    const handlePopupMouseLeave = (station) => {
      
      isMouseOverPopupElementRef.value = false; 
      clearPopupCloseTimer();

      
      popupCloseTimeout.value = setTimeout(() => {
        const markerComponent = markerRefs.value.get(station._id);
        
        

        
        if (
          !isMouseOverPopupElementRef.value && 
          currentlyInteractingStationIdRef.value === station._id &&
          markerComponent && markerComponent.leafletObject && markerComponent.leafletObject.isPopupOpen()
        ) {
          
          markerComponent.leafletObject.closePopup();
        }
        
      }, POPUP_CLOSE_DELAY);
    };

    const statusColorClass = (status) => ({
        'Active': 'status-active',
        'Inactive': 'status-inactive',
        'Under Maintenance': 'status-maintenance',
        'Coming Soon': 'status-comingsoon'
    }[status] || 'status-unknown');

    const setMarkerRef = (el, stationId) => {
      if (el) {
        markerRefs.value.set(stationId, el);
      } else {
        markerRefs.value.delete(stationId);
      }
    };

    return {
      mapComponentRoot, lMapInstance, leafletMapObject, currentZoom, currentCenter, mapFullyInitialized,
      initializationError, renderLMap, showDebug, mapHeightComputed, userLocationIcon, chargingStationIcon,
      getLeafletCoords, validStations, userMarkerLatLng, onLMapReady, statusColorClass,
      handleShowRouteClickForStation,
      
      handleMarkerMouseOver,
      handleMarkerMouseLeave,
      handlePopupMouseOver,
      handlePopupMouseLeave,
      setMarkerRef,
      props,
      
      isMouseOverPopupElementRef,
      currentlyInteractingStationIdRef,
    };
  }
};
</script>

<style scoped>
.map-component-root {
  min-height: 200px;
  display: flex;
  flex-direction: column;
}
:deep(.l-map) {
  flex-grow: 1;
  height: 100%;
  width: 100%;
}

.popup-content {
  font-size: 13px;
  line-height: 1.6;
}
.popup-content .popup-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.popup-content p {
  margin: 4px 0;
  color: #555;
}
.popup-content p strong {
  color: #444;
  min-width: 70px; 
  display: inline-block;
}

.popup-actions {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px; 
}

.status-active { color: #28a745; font-weight: bold; }
.status-inactive { color: #dc3545; font-weight: bold; }
.status-maintenance { color: #ffc107; font-weight: bold; }
.status-comingsoon { color: #17a2b8; font-weight: bold; }
.status-unknown { color: #6c757d; }

.directions-button, .route-button {
  flex-grow: 1;
  padding: 7px 10px;
  color: white;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}
.directions-button { background-color: #007bff; }
.directions-button:hover { background-color: #0056b3; }
.route-button { background-color: #28a745; }
.route-button:hover { background-color: #1e7e34; }
</style>