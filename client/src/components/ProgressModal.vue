<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="390">
      <v-card>
        <v-card-text class="text-center"
          ><div class="pa-4 mb-4">
            <v-progress-circular
              v-if="!isProcessingDone"
              size="64"
              indeterminate
              color="primary"
            />
            <v-btn @click="$emit('getResult')"  v-else>{{
              useGoogle ? "Open Google Drive" : "Download Result"
            }}</v-btn>
          </div>
          <div v-if="!isProcessingDone">{{ status }}</div></v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
let sseClient;
export default {
  props: ["dialog", "isProcessingDone", "useGoogle"],
  name: "ProgressModal",
  data() {
    return { status: "Uploading file..." };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
      this.status = "Uploading file...";
    },
  },
  async mounted() {
    sseClient = this.$sse.create({
      url: "/events",
      format: "json",
    });

    sseClient.on("statusUpdate", (message) => {
      console.log(message);
      this.status = message;
    });

    await sseClient.connect();
  },
};
</script>

<style scoped></style>
