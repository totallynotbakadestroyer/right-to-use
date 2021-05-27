<template>
  <div>
    <v-sheet class="overflow-auto pa-2 mb-4" height="45vh" max-height="45vh">
      <div class="d-flex" :key="index" v-for="(field, index) in fields">
        <v-text-field outlined v-model="field.name" label="Field name" />
        <v-text-field
          outlined
          v-model="field.value"
          label="Field value"
          class="ml-2"
        />
        <v-btn
          class="ml-2"
          v-if="fields.length !== 1"
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
  props: ['fields'],
  name: "MetadataFields",
  methods: {
    addField() {
      this.fields.push({ name: "", value: "" });
    },
    deleteField(index) {
      const fieldsCopy = [...this.fields];
      fieldsCopy.splice(index, 1);
      this.fields = fieldsCopy;
    },
  },
};
</script>

<style scoped></style>
