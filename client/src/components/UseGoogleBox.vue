<template>
  <v-row align="center">
    <v-col :cols="useGoogleCopy && !$vuetify.breakpoint.xsOnly ? '6' : '12'">
      <v-checkbox
        v-model="useGoogleCopy"
        persistent-hint
        class="mt-0"
        hint="Check this, so edited PSD will be uploaded directly to your Google Drive. Pretty neat stuff, i must say"
        label="Upload to Google Drive?"
      />
    </v-col>
    <v-col :cols="!$vuetify.breakpoint.xsOnly ? '6' : '12'">
      <v-text-field
        v-if="useGoogleCopy"
        label="Upload folder name"
        v-model="folderNameCopy"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["useGoogle", "folderName"],
  name: "UseGoogleBox",
  data() {
    return {
      useGoogleCopy: this.useGoogle,
      folderNameCopy: this.folderName,
    };
  },
  watch: {
    useGoogleCopy() {
      this.$emit("update:useGoogle", this.useGoogleCopy);
    },
    folderNameCopy() {
      this.$emit("update:folderName", this.folderNameCopy);
    },
  },
};
</script>

<style scoped></style>
