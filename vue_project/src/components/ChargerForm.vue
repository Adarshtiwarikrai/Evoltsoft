<template>
  <div v-if="isFormVisible"
       class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-[1000] transition-opacity duration-300"
       :class="isFormVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
       @click.self="close"
       role="dialog"
       aria-modal="true"
       :aria-labelledby="formTitleId">

    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300"
         :class="isFormVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
      <h3 :id="formTitleId" class="text-xl font-semibold text-gray-800 mb-6 text-center">{{ formTitle }}</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="station-name" class="block text-sm font-medium text-gray-700">Name:</label>
          <input type="text" id="station-name" v-model="form.name" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="station-lng" class="block text-sm font-medium text-gray-700">Longitude:</label>
            <input type="number" step="any" id="station-lng" v-model.number="form.location.lng" required
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label for="station-lat" class="block text-sm font-medium text-gray-700">Latitude:</label>
            <input type="number" step="any" id="station-lat" v-model.number="form.location.lat" required
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
        </div>
        
        <div>
          <label for="station-status" class="block text-sm font-medium text-gray-700">Status:</label>
          <select id="station-status" v-model="form.status"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            
          </select>
        </div>
        <div>
          <label for="station-power" class="block text-sm font-medium text-gray-700">Power Output (kW):</label>
          <input type="number" step="0.1" id="station-power" v-model.number="form.powerOutput" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label for="station-connector" class="block text-sm font-medium text-gray-700">Connector Type:</label>
          <input type="text" id="station-connector" v-model="form.connectorType" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <p v-if="error" class="text-red-500 text-sm bg-red-50 p-2 rounded-md">{{ error }}</p>

        <div class="mt-6 flex justify-end space-x-3 border-t pt-4">
          <button type="button" @click="close" :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" :disabled="isLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>{{ stationToEdit ? 'Update Station' : 'Add Station' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const defaultFormValues = () => ({
  _id: null,
  name: '',
  location: { lat: null, lng: null },
  status: 'Active',
  powerOutput: null,
  connectorType: '',
});

export default {
  name: 'ChargerForm',
  props: {
    stationToEdit: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'station-saved'],
  setup(props, { emit }) {
    const store = useStore();
    const form = ref(defaultFormValues());
    const isLoading = ref(false);
    const error = ref(null);
    const isFormVisible = ref(true);

    const formTitleId = 'charger-form-title';
    const formTitle = computed(() => (props.stationToEdit ? 'Edit Charging Station' : 'Add New Charging Station'));

    watch(
      () => props.stationToEdit,
      (newVal) => {
        if (newVal) {
          let formLocation = { lat: null, lng: null };
          if (newVal.location) {
            if (newVal.location.coordinates && Array.isArray(newVal.location.coordinates) && newVal.location.coordinates.length === 2) {
              formLocation.lng = newVal.location.coordinates[0];
              formLocation.lat = newVal.location.coordinates[1];
            } else if (typeof newVal.location.lat === 'number' && typeof newVal.location.lng === 'number') {
              formLocation.lat = newVal.location.lat;
              formLocation.lng = newVal.location.lng;
            }
          }
          form.value = {
            ...defaultFormValues(),
            ...newVal,
            location: formLocation
          };
        } else {
          form.value = defaultFormValues();
        }
        error.value = null;
      },
      { immediate: true, deep: true }
    );

    const submitForm = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        if (
          !form.value.name ||
          form.value.location.lat === null || form.value.location.lat === undefined ||
          form.value.location.lng === null || form.value.location.lng === undefined ||
          form.value.powerOutput === null || form.value.powerOutput === undefined ||
          !form.value.connectorType
        ) {
            error.value = "Please complete all required fields: Name, Latitude, Longitude, Power Output, and Connector Type.";
            isLoading.value = false;
            return;
        }
        
        const lat = parseFloat(form.value.location.lat);
        const lng = parseFloat(form.value.location.lng);
        const powerOutputNum = parseFloat(form.value.powerOutput);

        if (isNaN(lat) || isNaN(lng)) {
            error.value = "Latitude and Longitude must be valid numbers.";
            isLoading.value = false;
            return;
        }
        if (isNaN(powerOutputNum)) {
            error.value = "Power Output must be a valid number.";
            isLoading.value = false;
            return;
        }

        const dataForBackend = {
          name: form.value.name,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          status: form.value.status,
          powerOutput: powerOutputNum,
          connectorType: form.value.connectorType,
        };

        if (props.stationToEdit && props.stationToEdit._id) {
          const updatePayload = { ...dataForBackend };
          if(form.value._id) {
            updatePayload._id = form.value._id;
          }
          await store.dispatch('stations/updateStation', {
            id: props.stationToEdit._id,
            stationData: updatePayload,
          });
        } else {
          await store.dispatch('stations/createStation', dataForBackend);
        }
        emit('station-saved');
        close(); 
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            error.value = err.response.data.message;
        } else {
            error.value = err.message || (props.stationToEdit ? 'Failed to update station.' : 'Failed to create station.');
        }
        console.error("Form submission error:", err);
      } finally {
        isLoading.value = false;
      }
    };

    const close = () => {
      isFormVisible.value = false;
      setTimeout(() => {
        emit('close');
        
        form.value = defaultFormValues();
        error.value = null;
      }, 300);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
      
    });
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
    });

    return {
      form, formTitle, formTitleId, isLoading, error, isFormVisible,
      submitForm, close,
    };
  },
};
</script>