<template>
  <v-container class="fill-height d-flex align-content-center">
    <v-card
      class="my-auto mx-auto"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '70vw'"
      rounded
    >
      <v-card-text>
        <v-sheet>
          <v-row>
            <v-col cols="12">
              <upload-box :file.sync="file" />
            </v-col>
            <v-col cols="12">
              <MetadataBox :fields.sync="fields" />
            </v-col>
          </v-row>
        </v-sheet>
        <div class="pt-2">
            <UseGoogleBox :use-google.sync="useGoogle" :folder-name.sync="folderName" />
        </div>
      </v-card-text>
      <v-card-actions class="mt-2">
        <v-col class="text-right">
          <v-btn
            :disabled="!file"
            v-if="!useGoogle || accessToken"
            @click="startProcessing"
            >Add metadata</v-btn
          >
          <GoogleLogin :onSuccess="onSuccess" v-else :params="loginParams"
            ><v-btn>Login to Google</v-btn></GoogleLogin
          >
        </v-col>
      </v-card-actions>
    </v-card>
    <ProgressModal
      @getResult="getResult"
      @closeDialog="closeDialog"
      :dialog="dialog"
      :isProcessingDone="isProcessingDone"
      :use-google="useGoogle"
    />
  </v-container>
</template>

<script>
import ProgressModal from "../components/ProgressModal.vue";
import GoogleLogin from "vue-google-login";
import fileService from "../services/fileService.js";
import fileSaver from "file-saver";
import UploadBox from "../components/UploadBox.vue";
import MetadataBox from "../components/MetadataBox";
import UseGoogleBox from "../components/UseGoogleBox.vue";

export default {
  name: "FileUploader",
  components: {
    UseGoogleBox,
    UploadBox,
    ProgressModal,
    GoogleLogin,
    MetadataBox,
  },
  data() {
    return {
      fields: [
        { name: "", value: "" },
        { name: "", value: "" },
        { name: "", value: "" },
        { name: "", value: "" },
        { name: "", value: "" },
      ],
      dialog: false,
      useGoogle: false,
      accessToken: "",
      loginParams: {
        client_id: process.env.VUE_APP_GOOGLE_APP_CLIENT,
      },
      file: null,
      isProcessingDone: false,
      folderName: "",
      result: null,
    };
  },
  methods: {
    getResult() {
      if (this.useGoogle) {
        return window.open(this.result);
      }
      return fileSaver.saveAs(this.result, this.file.name);
    },
    closeDialog() {
      this.dialog = false;
      this.isProcessingDone = false;
    },
    onSuccess(googleUser) {
      this.accessToken = googleUser.qc.access_token;
    },
    async startProcessing() {
      this.dialog = true;
      const { data } = await fileService.uploadFile(this.file, {
        metadata: this.fields.filter((x) => x.value !== ""),
        folderName: this.folderName,
        upload: this.useGoogle,
        accessToken: this.accessToken,
      });
      this.isProcessingDone = true;
      this.result = data.link ? data.link : data;
    },
  },
};
</script>

<style scoped></style>
