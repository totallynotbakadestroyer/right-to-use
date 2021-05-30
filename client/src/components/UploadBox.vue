<template>
  <v-sheet>
    <div class="display-1">File</div>
    <div :class="$vuetify.breakpoint.smAndDown ? 'subtitle-2' : 'subtitle-1'">
      Upload file using button or just drop it right here.
    </div>
    <div
      class="d-flex align-center"
      :class="$vuetify.breakpoint.xsOnly ? 'flex-column' : ''"
    >
      <v-sheet width="100%">
        <v-file-input
          v-model="fileCopy"
          accept=".psd"
          ref="fileInput"
          class="mr-2"
          prepend-icon=""
          label="PSD Document"
        />
      </v-sheet>
      <v-btn @click="$refs.fileInput.$refs.input.click()">select file</v-btn>
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: ["file"],
  data() {
    return {
      fileCopy: this.file,
    };
  },
  watch: {
    fileCopy() {
      this.$emit("update:file", this.fileCopy);
    },
  },
  name: "UploadBox",
};
</script>

<style scoped></style>
