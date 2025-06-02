<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    class="dashboard p-4 sm:p-6 bg-background text-foreground rounded-lg"
    style="min-height: 500px;"
  >
    <header class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-card-foreground">Charging Stations</h1>
      <Button
        variant="outline"
        size="icon"
        @click="refreshAllStations"
        title="Refresh Stations (All)"
        v-motion
        :initial="{ opacity: 0, scale: 0.5 }"
        :enter="{ opacity: 1, scale: 1, transition: { delay: 300, type: 'spring', stiffness: 200 } }"
      >
        <RefreshCw class="h-5 w-5" :class="{ 'animate-spin': isLoadingStations }" />
      </Button>
    </header>

    <Card
      class="controls mb-8"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 400 } }"
    >
      <CardHeader class="pb-4">
        <CardTitle class="text-lg">Controls & Filters</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4 xl:space-y-0 xl:flex xl:flex-col xl:gap-4">
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:items-center">
            <Button
              @click="openAddModal"
              class="w-full sm:w-auto"
              aria-label="Add New Charger"
            >
              <PlusCircle class="h-5 w-5 mr-2" />
              Add Charger
            </Button>
             <Button
              @click="handleFindNearMeClick"
              class="w-full sm:w-auto"
              :disabled="isLocatingUser || isLoadingStations"
              aria-label="Find Stations Near Me"
            >
              <MapPinIcon class="h-5 w-5 mr-2" :class="{ 'animate-ping': isLocatingUser && !isLocatingUserInitially }" />
              Find Near Me
            </Button>
        </div>
        <div class="filters flex flex-col sm:flex-row gap-3 w-full xl:items-center">
          <div class="relative w-full sm:w-auto">
            <FilterIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select v-model="filterStatusForBackend" @update:model-value="applyStatusFilter">
              <SelectTrigger class="w-full sm:w-[200px] pl-10" title="Filter by Status">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses_option">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Coming Soon">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="relative w-full sm:w-auto">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              v-model.lazy="filterTextForClient"
              placeholder="Search Name/Connector"
              title="Client-side search by Name or Connector"
              class="w-full sm:w-auto pl-10"
            />
          </div>
          <div class="relative w-full sm:w-auto">
            <Zap class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              v-model.number="filterPowerForBackend"
              placeholder="Min Power (kW)"
              @update:model-value="applyPowerFilterDebounced"
              title="Filter by Minimum Power"
              class="w-full sm:w-auto pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <Alert v-if="locationError" variant="destructive" class="mb-4" role="alert">
        <AlertCircle class="h-5 w-5" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription>{{ locationError }}. Please ensure location services are enabled and permissions are granted.</AlertDescription>
    </Alert>

    <div v-if="isLoadingStations || isLocatingUser || isLocatingUserInitially" class="page-loading-spinner flex justify-center items-center py-20">
      <div v-motion-pop class="text-center">
        <div class="loading-spinner mx-auto" role="status" :aria-label="isLocatingUserInitially ? 'Getting your location...' : (isLocatingUser ? 'Finding stations near you...' : 'Loading stations...')"></div>
        <p class="mt-3 text-lg font-medium text-muted-foreground">
            {{ isLocatingUserInitially ? 'Getting your location...' : (isLocatingUser ? 'Finding stations near you...' : 'Loading Stations...') }}
        </p>
        <p class="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>

     <Alert v-if="!isLoadingStations && !isLocatingUser && !isLocatingUserInitially && stationError" variant="destructive" class="my-6" role="alert"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }">
      <AlertCircle class="h-5 w-5" />
      <AlertTitle class="font-semibold text-lg">Operation Failed</AlertTitle>
      <AlertDescription>
        An error occurred: {{ stationError }}. Please try refreshing or adjusting filters.
      </AlertDescription>
    </Alert>

    <div v-if="!isLoadingStations && !isLocatingUser && !isLocatingUserInitially && !stationError"
      class="view-toggle mb-6"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 400 } }"
    >
      <Tabs :value="currentView" class="w-full sm:w-auto">
        <TabsList class="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="list" @click="switchToView('list')">
            <List class="h-5 w-5 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="map" @click="switchToView('map')">
            <MapPin class="h-5 w-5 mr-2" />
            Map View
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <Card
      v-show="!isLoadingStations && !isLocatingUser && !isLocatingUserInitially && !stationError && currentView === 'list'"
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { duration: 300 } }"
      class="charger-list-container"
    >
      <CardContent class="p-0">
        <Table v-if="clientSideFilteredStations.length > 0">
          <TableHeader> <TableRow> <TableHead class="w-[150px] sm:w-[200px]">Name</TableHead> <TableHead class="hidden lg:table-cell">Location (Lng, Lat)</TableHead> <TableHead>Status</TableHead> <TableHead class="hidden md:table-cell">Power</TableHead> <TableHead class="hidden sm:table-cell">Connector</TableHead> <TableHead class="text-right">Actions</TableHead> </TableRow> </TableHeader>
          <TableBody>
            <TableRow
              v-for="(station, index) in clientSideFilteredStations" :key="station._id" v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { delay: index * 60, duration: 350 } }" class="hover:bg-muted/50"
            >
              <TableCell class="font-medium text-primary py-3">{{ station.name }}</TableCell>
              <TableCell class="hidden lg:table-cell text-sm text-muted-foreground py-3"> <span v-if="station.location?.coordinates && typeof station.location.coordinates[0] === 'number' && typeof station.location.coordinates[1] === 'number'"> {{ station.location.coordinates[0].toFixed(4) }}, {{ station.location.coordinates[1].toFixed(4) }} </span> <span v-else>N/A</span> </TableCell>
              <TableCell class="py-3"> <Badge :variant="getStatusBadgeVariant(station.status)" :class="getStatusClass(station.status)"> {{ station.status }} </Badge> </TableCell>
              <TableCell class="hidden md:table-cell text-sm text-muted-foreground py-3">{{ station.powerOutput }} kW</TableCell>
              <TableCell class="hidden sm:table-cell text-sm text-muted-foreground py-3">{{ station.connectorType }}</TableCell>
              <TableCell class="text-right space-x-1 py-3"> <Button variant="ghost" size="icon" @click="getDirections(station)" title="Get Directions" class="hover:text-blue-500" :disabled="!currentUserLocation"> <Navigation class="h-4 w-4" /> </Button> <Button variant="ghost" size="icon" @click="openEditModal(station)" title="Edit Station" class="hover:text-primary"> <FilePenLine class="h-4 w-4" /> </Button> <Button variant="ghost" size="icon" @click="confirmDelete(station)" title="Delete Station" class="hover:text-destructive"> <Trash2 class="h-4 w-4" /> </Button> </TableCell>
            </TableRow>
          </TableBody>
        </Table>
         <div v-if="clientSideFilteredStations.length === 0 && !isLoadingStations && !isLocatingUser && !isLocatingUserInitially" class="text-center py-12 px-4" v-motion-fade >
            <LayoutList class="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 class="text-xl font-semibold text-card-foreground mb-1">No Stations Found</h3>
            <p class="text-muted-foreground"> There are no charging stations matching your current filters or near your location. <br /> Try adjusting your search or add a new station. </p>
        </div>
      </CardContent>
    </Card>

    <div
      v-show="!isLoadingStations && !isLocatingUser && !isLocatingUserInitially && !stationError && currentView === 'map'"
      class="map-view-wrapper mt-4 rounded-lg border shadow-md"
      style="height: 550px; position: relative;"
    >
        <ChargerMap
            :stations="clientSideFilteredStations"
            :user-location="currentUserLocation"
            mapHeight="100%"
            :key="mapViewKey"
            class="p-1"
            @get-directions="getDirections"
        />
    </div>

    <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
      <DialogContent class="sm:max-w-lg md:max-w-xl">
        <div v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 300 } }" :leave="{ opacity: 0, scale: 0.95, transition: { duration: 200 } }" >
          <ChargerForm :station-to-edit="stationForForm" @close="closeModal" @station-saved="handleStationSaved" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import ChargerForm from '@/components/ChargerForm.vue';
import ChargerMap from '@/components/ChargerMap.vue';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
    AlertCircle, PlusCircle, Search, Filter as FilterIcon, Zap, List, MapPin,
    FilePenLine, Trash2, RefreshCw, LayoutList, Navigation, MapPin as MapPinIcon
} from 'lucide-vue-next';

export default {
  name: 'DashboardView',
  components: {
    ChargerForm, ChargerMap, Button, Card, CardContent, CardHeader, CardTitle, Input,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow, Badge, Dialog, DialogContent, Tabs, TabsList, TabsTrigger,
    Alert, AlertDescription, AlertTitle, AlertCircle, PlusCircle, Search, FilterIcon, Zap,
    List, MapPin, FilePenLine, Trash2, RefreshCw, LayoutList, Navigation, MapPinIcon
  },
  setup() {
    const store = useStore();
    const stationsFromStore = computed(() => store.getters['stations/allStations']);
    const isLoadingStations = computed(() => store.getters['stations/isLoadingStations']);
    const stationError = computed(() => store.getters['stations/stationError']);

    const isModalOpen = ref(false);
    const stationForForm = ref(null);
    const currentView = ref('list');
    const mapViewKey = ref(Date.now());

    const filterStatusForBackend = ref('all_statuses_option');
    const filterPowerForBackend = ref(null);
    const filterTextForClient = ref('');

    const currentUserLocation = ref(null);
    const isLocatingUser = ref(false);
    const isLocatingUserInitially = ref(false);
    const locationError = ref('');
    let backendFilterDebounceTimer = null;
    let initialSilentLocationAttemptMade = false;

    watch(stationsFromStore, (newStations) => {
      console.log('%%% [DashboardView] STORE STATIONS CHANGED. Count:', newStations ? newStations.length : 0);
    }, { deep: true, immediate: true });

    const clientSideFilteredStations = computed(() => {
      console.log('%%% [DashboardView] clientSideFilteredStations: Recalculating...');
      if (!stationsFromStore.value || !Array.isArray(stationsFromStore.value)) {
        console.warn('%%% [DashboardView] clientSideFilteredStations: stationsFromStore is not an array/null.');
        return [];
      }
      console.log('%%% [DashboardView] clientSideFilteredStations: From Store BEFORE client filter:', stationsFromStore.value.length, `filterText: "${filterTextForClient.value}"`);
      
      let stationsToDisplay = [...stationsFromStore.value];
      if (filterTextForClient.value && filterTextForClient.value.trim() !== '') {
        const searchTerm = filterTextForClient.value.toLowerCase().trim();
        stationsToDisplay = stationsToDisplay.filter(station =>
          (station.name && station.name.toLowerCase().includes(searchTerm)) ||
          (station.connectorType && station.connectorType.toLowerCase().includes(searchTerm))
        );
      }
      console.log('%%% [DashboardView] clientSideFilteredStations: AFTER client filter:', stationsToDisplay.length);
      return stationsToDisplay;
    });

    const _fetchUserLocation = (options = { forButton: false }) => {
      return new Promise((resolve) => {
        const loadingRef = options.forButton ? isLocatingUser : isLocatingUserInitially;
        loadingRef.value = true;
        if (options.forButton) locationError.value = '';

        if (!navigator.geolocation) {
          if (options.forButton) locationError.value = "Geolocation not supported.";
          console.warn('[DashboardView] Geolocation not supported.');
          loadingRef.value = false;
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            console.log('!!! [DashboardView] Geolocation success:', coords, 'Context:', options.forButton ? 'Button' : 'InitialSilent');
            currentUserLocation.value = coords;
            loadingRef.value = false;
            resolve(coords);
          },
          (error) => {
            console.error('!!! [DashboardView] Geolocation error:', error.message, 'Context:', options.forButton ? 'Button' : 'InitialSilent');
            currentUserLocation.value = null;
            if (options.forButton) locationError.value = `Geolocation error: ${error.message}`;
            loadingRef.value = false;
            resolve(null);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    };

    const fetchStationsBasedOnCurrentFilters = async (keepUserLocationIfPresent = false) => {
      console.log('[DashboardView] fetchStationsBasedOnCurrentFilters. keepUserLocationIfPresent:', keepUserLocationIfPresent);
      if (!keepUserLocationIfPresent) {
        currentUserLocation.value = null;
      }

      const payload = {};
      if (filterStatusForBackend.value && filterStatusForBackend.value !== 'all_statuses_option') {
        payload.status = filterStatusForBackend.value;
      }
      const powerVal = filterPowerForBackend.value;
      if (typeof powerVal === 'number' && !isNaN(powerVal) && powerVal >= 0) {
        payload.minPower = powerVal;
      }
      console.log('[DashboardView] Dispatching fetchStations with filters:', payload);
      await store.dispatch('stations/fetchStations', payload);

      if (currentView.value === 'map') {
        mapViewKey.value = Date.now();
      }
    };
    
    const attemptSilentInitialLocation = async (forceMapUpdate = false) => {
        if (initialSilentLocationAttemptMade && !forceMapUpdate) return; 
        initialSilentLocationAttemptMade = true;
        console.log('[DashboardView] Attempting silent location for map.');
        await _fetchUserLocation({ forButton: false }); 
        
        if (forceMapUpdate && currentView.value === 'map') {
            console.log('[DashboardView] Silent location attempted, forcing map update.');
            mapViewKey.value = Date.now();
        }
    };

    const refreshAllStations = async () => {
      console.log('[DashboardView] refreshAllStations called.');
      filterStatusForBackend.value = 'all_statuses_option';
      filterPowerForBackend.value = null;
      filterTextForClient.value = '';
      locationError.value = '';
      store.commit('stations/SET_ERROR', null);
      
      
      await fetchStationsBasedOnCurrentFilters(false); 

      
      initialSilentLocationAttemptMade = false; 
      await attemptSilentInitialLocation(true); 
    };

    onMounted(async () => {
      console.log('[DashboardView] Mounted.');
      await refreshAllStations();
    });

    const switchToView = async (view) => {
      console.log(`[DashboardView] switchToView to: ${view}. Current view: ${currentView.value}`);
      const oldView = currentView.value;
      currentView.value = view;

      if (view === 'map') {
        
        if (oldView !== 'map') { 
            console.log('[DashboardView] Switched to Map View from List.');
            
            
            await attemptSilentInitialLocation(true); 
        } else { 
            console.log('[DashboardView] Map View tab re-clicked. Resetting to general filters + current location.');
            locationError.value = ''; 
            
            
            await fetchStationsBasedOnCurrentFilters(true);
            
            await attemptSilentInitialLocation(true);
        }
      } else { 
        console.log('[DashboardView] Switched to List view. Ensuring stations are based on general filters.');
        
        await fetchStationsBasedOnCurrentFilters(false); 
      }
    };
    
    const handleFindNearMeClick = async () => {
      console.log('[DashboardView] "Find Near Me" clicked.');
      filterStatusForBackend.value = 'all_statuses_option';
      filterPowerForBackend.value = null;
      filterTextForClient.value = '';
      store.commit('stations/SET_ERROR', null);

      const userCoords = await _fetchUserLocation({ forButton: true });
      if (userCoords) {
        console.log('[DashboardView] FindNearMe: Fetching stations near:', userCoords);
        await store.dispatch('stations/fetchStationsNearCoordinates', userCoords);
      } else {
        console.log('[DashboardView] FindNearMe: Location failed. Fetching all stations.');
        await fetchStationsBasedOnCurrentFilters(false); 
      }
      if (currentView.value === 'map') {
        mapViewKey.value = Date.now();
      }
    };
    
    const applyStatusFilter = () => {
      console.log('[DashboardView] applyStatusFilter.');
      fetchStationsBasedOnCurrentFilters(false);
    };

    const applyPowerFilterDebounced = () => {
      clearTimeout(backendFilterDebounceTimer);
      backendFilterDebounceTimer = setTimeout(() => {
        console.log('[DashboardView] applyPowerFilterDebounced.');
        fetchStationsBasedOnCurrentFilters(false);
      }, 700);
    };
    
    watch(currentUserLocation, (newLoc, oldLoc) => {
      console.log('!!! [DashboardView] WATCH currentUserLocation changed FROM:', oldLoc ? JSON.stringify(oldLoc) : 'null', 'TO:', newLoc ? JSON.stringify(newLoc) : 'null');
      if (currentView.value === 'map') {
        
        console.log('!!! [DashboardView] currentUserLocation changed while map is active. Forcing map refresh via key.');
        mapViewKey.value = Date.now();
      }
    }, { deep: true });

    const openAddModal = () => { stationForForm.value = null; isModalOpen.value = true; };
    const openEditModal = (station) => { stationForForm.value = JSON.parse(JSON.stringify(station)); isModalOpen.value = true; };
    const closeModal = () => { isModalOpen.value = false; stationForForm.value = null; };

    const handleStationSaved = async () => {
      closeModal();
      if (currentUserLocation.value) {
        console.log('[DashboardView] Station saved. Re-fetching stations near current location.');
        await store.dispatch('stations/fetchStationsNearCoordinates', currentUserLocation.value);
      } else {
        console.log('[DashboardView] Station saved. Re-fetching stations with current backend filters.');
        await fetchStationsBasedOnCurrentFilters(false);
      }
      if (currentView.value === 'map') mapViewKey.value = Date.now();
    };

    const confirmDelete = async (station) => {
      if (window.confirm(`Delete "${station.name}"?`)) {
        try {
          await store.dispatch('stations/deleteStation', station._id);
          if (currentUserLocation.value) {
            await store.dispatch('stations/fetchStationsNearCoordinates', currentUserLocation.value);
          } else {
            await fetchStationsBasedOnCurrentFilters(false);
          }
          if (currentView.value === 'map') mapViewKey.value = Date.now();
        } catch (error) { alert('Failed to delete: ' + (error?.message || 'Unknown error')); }
      }
    };
    const getDirections = (station) => {
        if (!currentUserLocation.value) { alert("Your current location is not available."); return; }
        if (!station?.location?.coordinates || station.location.coordinates.length !== 2) { alert("Station location data is invalid."); return; }
        const [stationDbLng, stationDbLat] = station.location.coordinates;
        if (isNaN(stationDbLat) || isNaN(stationDbLng)) { alert("Station coordinates are not valid numbers."); return; }
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentUserLocation.value.lat},${currentUserLocation.value.lng}&destination=${stationDbLat},${stationDbLng}&travelmode=driving`;
        window.open(mapsUrl, '_blank');
    };
    const getStatusClass = (status) => ({'Active': 'text-green-700 dark:text-green-400', 'Inactive': 'text-red-700 dark:text-red-400', 'Under Maintenance': 'text-yellow-700 dark:text-yellow-400', 'Coming Soon': 'text-blue-700 dark:text-blue-400'}[status] || 'text-gray-700 dark:text-gray-400');
    const getStatusBadgeVariant = (status) => ({'Active': 'success', 'Inactive': 'destructive', 'Under Maintenance': 'warning', 'Coming Soon': 'info'}[status] || 'outline');

    return {
      stationsFromStore, isLoadingStations, stationError, isModalOpen, stationForForm,
      currentView, mapViewKey, filterStatusForBackend, filterPowerForBackend, filterTextForClient,
      clientSideFilteredStations, applyStatusFilter, applyPowerFilterDebounced, refreshAllStations,
      openAddModal, openEditModal, closeModal, handleStationSaved, confirmDelete,
      getStatusClass, getStatusBadgeVariant, switchToView, currentUserLocation, isLocatingUser,
      isLocatingUserInitially, locationError, handleFindNearMeClick, getDirections,
    };
  }
};
</script>

<style scoped>
.page-loading-spinner { min-height: 150px; }
.loading-spinner {
  border: 4px solid hsl(var(--border) / 0.3);
  width: 48px; height: 48px;
  border-radius: 50%;
  border-left-color: hsl(var(--primary));
  animation: spin 1s ease infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.map-view-wrapper { display: flex; flex-direction: column; }
.map-view-wrapper > :deep(div.map-component-root) { flex-grow: 1; display: flex; flex-direction: column; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>