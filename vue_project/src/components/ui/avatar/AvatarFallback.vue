<script setup>
import { AvatarFallback } from "reka-ui";

const props = defineProps({
  delayMs: { type: Number, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
});
</script>

<template>
  <AvatarFallback v-bind="props">
    <slot />
  </AvatarFallback>
</template>
