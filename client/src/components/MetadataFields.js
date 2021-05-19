import React from "react";

const MetadataFields = ({
  metadataFields,
  handleMetadataPayload,
  addField,
}) => {
  return (
    <div>
      <div>Metadata fields</div>
      {metadataFields.map((x) => {
        return (
          <div key={x.id}>
            <label>
              xmp:
              <input
                placeholder={"tag name"}
                onChange={(event) => handleMetadataPayload(event, x.id)}
                value={x.name}
                name={"name"}
              />
              =
              <input
                placeholder={"value"}
                name={"data"}
                onChange={(event) => handleMetadataPayload(event, x.id)}
              />
            </label>
          </div>
        );
      })}
      <button onClick={addField}>Add field</button>
    </div>
  );
};

export default MetadataFields;
