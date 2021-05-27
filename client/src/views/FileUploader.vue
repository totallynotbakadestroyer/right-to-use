<template>
  <v-container class="fill-height">
    <v-card class="my-auto mx-auto" rounded>
      <v-card-text>
        <v-sheet height="80vh" max-height="80vh" class="fill-height">
          <v-row>
            <v-col cols="12">
              <v-sheet>
                <div class="display-1">File</div>
                <div class="subtitle-1">
                  Upload file using button or just drop it right here.
                </div>
                <div class="d-flex align-center">
                  <v-file-input
                    v-model="file"
                    accept=".psd"
                    ref="fileInput"
                    class="mr-2"
                    prepend-icon=""
                    label="PSD Document"
                  />
                  <v-btn @click="$refs.fileInput.$refs.input.click()"
                    >select file</v-btn
                  >
                </div>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-sheet>
                <div class="mb-4">
                  <div class="display-1 text-left">Metadata fields</div>
                  <div class="subtitle-1 text-left">
                    Keep in mind, field names must be CamelCase with no special
                    symbols.
                  </div>
                </div>
                <!--directly mutating the original is a bad manner, but i just trying to keep things simple -->
                <metadata-fields :fields.sync="fields" />
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
        <v-row>
          <v-col :cols="useGoogle ? 6 : 12">
            <v-checkbox
              dense
              v-model="useGoogle"
              persistent-hint
              hint="Check this, so edited PSD will be uploaded directly to your Google Drive. Pretty neat stuff, i must say"
              label="Upload to Google Drive?"
            />
          </v-col>
          <v-col v-if="useGoogle" cols="6">
            <v-text-field label="Upload folder name" v-model="folderName" />
          </v-col>
        </v-row>
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
import MetadataFields from "../components/MetadataFields.vue";
import fileService from "../services/fileService.js";
import fileSaver from 'file-saver';
export default {
  name: "FileUploader",
  components: { MetadataFields, ProgressModal, GoogleLogin },
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
        client_id:
          "806749174719-9lf5h2pm0c5jr9hj5dn9hbs5a80bgvtp.apps.googleusercontent.com",
      },
      file: null,
      isProcessingDone: false,
      folderName: "",
      result: null,
    };
  },
  methods: {
    getResult() {
      if(this.useGoogle) {
        return window.open(this.result)
      }
      return fileSaver.saveAs(this.result, this.file.name)
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
      console.log(data);
      this.result = data.link ? data.link : data;
    },
  },
};
</script>

<style scoped></style>
