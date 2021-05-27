<template>
  <v-app class="fill-height">
    <v-main>
      <file-uploader msg="Welcome to Your Vue.js App" />
    </v-main>
  </v-app>
</template>

<script>
import FileUploader from "./views/FileUploader.vue";

export default {
  name: "App",
  components: {
    FileUploader,
  },
};
</script>

<style>
html {
  overflow-y: auto;
}
</style>
