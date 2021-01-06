import { GoogleLogin } from "react-google-login";
import React, { createRef, useState } from "react";
import MetadataFields from "./MetadataFields";
import uploadFile from "../services/fileService.js";

const Form = ({ setAuth, auth }) => {
  const fileInput = createRef();
  const [payload, setPayload] = useState({
    upload: false,
    folderName: "",
    metadata: [
      {
        name: "BuyerId",
        data: "",
        id: 0,
      },
    ],
  });
  const handlePayload = (event) => {
    const isCheckBox = event.target.type === "checkbox";
    setPayload({
      ...payload,
      [event.target.name]: isCheckBox
        ? event.target.checked
        : event.target.value,
    });
  };
  const handleMetadataPayload = (event, id) => {
    setPayload({
      ...payload,
      metadata: payload.metadata.map((el) =>
        el.id === id ? { ...el, [event.target.name]: event.target.value } : el
      ),
    });
  };
  const addField = (event) => {
    event.preventDefault();
    setPayload({
      ...payload,
      metadata: [
        ...payload.metadata,
        { name: "NewField", data: "", index: payload.metadata.length },
      ],
    });
  };

  return (
    <form
      action={"upload"}
      onSubmit={(event) =>
        uploadFile(event, fileInput.current.files[0], payload, auth)
      }
    >
      <div>
        <label htmlFor={"file"}>
          Picture to mark
          <input ref={fileInput} id={"file"} name={"file"} type={"file"} />
        </label>
      </div>
      <MetadataFields
        metadataFields={payload.metadata}
        handleMetadataPayload={handleMetadataPayload}
        addField={addField}
      />
      {payload.upload ? (
        <div>
          <label htmlFor={"folder-name"}>
            Folder name
            <input
              id={"folder-name"}
              name={"folderName"}
              onChange={(event) => handlePayload(event)}
            />
          </label>
        </div>
      ) : null}
      <div>
        <label htmlFor={"upload-drive"}>
          Upload to google drive?
          <input
            id={"upload-drive"}
            onChange={(event) => handlePayload(event)}
            name={"upload"}
            type={"checkbox"}
          />
        </label>
      </div>
      {auth || !payload.upload ? (
        <button type={"submit"}>mark picture</button>
      ) : (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={(response) => setAuth(response)}
          scope={"https://www.googleapis.com/auth/drive.appdata"}
        />
      )}
    </form>
  );
};

export default Form;
