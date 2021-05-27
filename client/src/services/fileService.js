import axios from "axios";
const baseURL = "/upload";

const uploadFile = async (file, payload) => {
  const data = new FormData();
  data.append("payload", JSON.stringify(payload));
  data.append("file", file);
  if (!payload.upload)
    return axios.post(baseURL, data, { responseType: "blob" });
  return axios.post(baseURL, data);
};

export default { uploadFile };
