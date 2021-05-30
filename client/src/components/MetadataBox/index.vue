<template>
  <v-sheet>
    <div class="display-1 text-left">Metadata fields</div>
    <div
      :class="$vuetify.breakpoint.smAndDown ? 'subtitle-2' : 'subtitle-1'"
      class="text-left mb-2"
    >
      Keep in mind, field names must be CamelCase with no special symbols.
    </div>
    <!--directly mutating the original is a bad manner, but i just trying to keep things simple -->
    <metadata-fields :fields.sync="fields" />
  </v-sheet>
</template>

<script>
import MetadataFields from "./components/MetadataFields.vue";

export default {
  props: ["fields"],
  components: { MetadataFields },
  name: "MetadataBox",
};
</script>

<style scoped></style>
