import "./App.css";
import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import fileSaver from "file-saver";

const App = () => {
  const [file, setFile] = useState(null);
  const [metadataFields, setMetadataFields] = useState([
    { name: "BuyerId", data: "", id: 0 },
  ]);
  const [auth, setAuth] = useState("");
  const [upload, setUpload] = useState(false);
  const [folderName, setFolderName] = useState("");
  const responseGoogle = (response) => {
    console.log(response);
    setAuth(response.accessToken);
  };
  const createFile = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("file", file);
    if (upload && auth) {
      data.append("accessToken", auth);
      data.append("folderName", folderName);
    }
    data.append("metadata", JSON.stringify(metadataFields));
    console.log(file.name);
    if (!upload) {
      const response = await axios.post("http://localhost:3001/upload", data, {
        responseType: "blob",
      });
      return fileSaver(response.data, file.name);
    }
    await axios.post("http://localhost:3001/upload", data);
  };

  const addField = (event) => {
    event.preventDefault();
    const newField = {
      name: "NewField",
      data: "",
      id: metadataFields.length,
    };
    setMetadataFields(metadataFields.concat(newField));
  };

  return (
    <div>
      <form action={"upload"} onSubmit={createFile}>
        <div>
          <label htmlFor={"file"}>
            Picture to mark
            <input
              onChange={({ target }) => setFile(target.files[0])}
              id={"file"}
              type={"file"}
            />
          </label>
        </div>
        <div>
          <div>Metadata fields</div>
          {metadataFields.map((x) => {
            return (
              <div key={x.id}>
                <label>
                  xmp:
                  <input
                    placeholder={"tag name"}
                    onChange={({ target }) =>
                      setMetadataFields(
                        metadataFields.map((el) => {
                          return el.id === x.id
                            ? { ...el, name: target.value }
                            : el;
                        })
                      )
                    }
                    value={x.name}
                  />
                  =
                  <input
                    placeholder={"value"}
                    onChange={({ target }) =>
                      setMetadataFields(
                        metadataFields.map((el) => {
                          return el.id === x.id
                            ? { ...el, data: target.value }
                            : el;
                        })
                      )
                    }
                  />
                </label>
              </div>
            );
          })}
        </div>
        {upload ? (
          <div>
            <label htmlFor={"folder-name"}>
              Folder name
              <input
                id={"folder-name"}
                onChange={({ target }) => setFolderName(target.value)}
              />
            </label>
          </div>
        ) : null}
        <button onClick={addField}>Add field</button>
        <div>
          <label htmlFor={"upload-drive"}>
            Upload to google drive?
            <input
              onChange={({ target }) => setUpload(target.checked)}
              id={"upload-drive"}
              type={"checkbox"}
            />
          </label>
        </div>
        {auth || !upload ? (
          <button>mark picture</button>
        ) : (
          <GoogleLogin
            clientId="806749174719-9lf5h2pm0c5jr9hj5dn9hbs5a80bgvtp.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            scope={"https://www.googleapis.com/auth/drive.appdata"}
          />
        )}
      </form>
    </div>
  );
};

export default App;
