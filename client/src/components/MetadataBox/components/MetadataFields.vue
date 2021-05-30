<template>
  <div>
    <v-sheet class="overflow-auto pa-2 mb-4" max-height="35vh">
      <div class="d-flex" :key="index" v-for="(field, index) in copyFields">
        <v-text-field
          outlined
          v-model="field.name"
          :label="!$vuetify.breakpoint.xsOnly ? 'Field name' : 'Name'"
        />
        <v-text-field
          outlined
          v-model="field.value"
          :label="!$vuetify.breakpoint.xsOnly ? 'Field value' : 'Value'"
          class="ml-2"
        />
        <v-btn
          class="ml-2"
          v-if="copyFields.length !== 1"
          icon
          elevation="0"
          fab
          @click="deleteField"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </div>
    </v-sheet>
    <div class="text-right">
      <v-btn @click="addField">add field</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: ["fields"],
  data() {
    return {
      copyFields: this.fields,
    };
  },
  name: "MetadataFields",
  methods: {
    addField() {
      this.copyFields.push({ name: "", value: "" });
    },
    deleteField(index) {
      const fieldsCopy = [...this.copyFields];
      fieldsCopy.splice(index, 1);
      this.copyFields = fieldsCopy;
    },
  },
  watch: {
    copyFields: {
      handler() {
        this.$emit("update:fields", this.copyFields);
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
