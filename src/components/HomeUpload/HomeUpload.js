import React, { useState, useContext } from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import Reveal from "react-reveal/Reveal";
import shortid from "shortid";
import { Button, UploadFile } from "../";
import { Deco3, Deco4, Deco5, Folder, DownArrow } from "../../svg";
import "./HomeUpload.scss";
import AppContext from "../../AppContext";

export default function HomeUpload() {
  const [files, setFiles] = useState([]);
  const { apiUrl } = useContext(AppContext);

  const handleDrop = async acceptedFiles => {
    setFiles(previousFiles => [...acceptedFiles.map(file => ({ file, status: "uploading" })), ...previousFiles]);

    const onComplete = (file, status, skylink) => {
      setFiles(previousFiles => {
        const index = previousFiles.findIndex(f => f.file === file);

        return [
          ...previousFiles.slice(0, index),
          {
            ...previousFiles[index],
            status,
            url: `${apiUrl}/${skylink}`
          },
          ...previousFiles.slice(index + 1)
        ];
      });
    };

    acceptedFiles.forEach(async file => {
      try {
        const fd = new FormData();
        fd.append("file", file);

        const uuid = shortid.generate();
        const response = await fetch(`${apiUrl}/skynet/skyfile/${uuid}`, { method: "POST", body: fd });
        const { skylink } = await response.json();

        onComplete(file, "complete", skylink);
      } catch (error) {
        onComplete(file, "error");
      }
    });
  };

  const handleSkylink = event => {
    event.preventDefault();

    const skylink = event.target.skylink.value.replace("sia://", "");

    if (skylink.match(/^[a-zA-Z0-9_-]{46}$/)) {
      window.open(skylink, "_blank");
    }
  };

  return (
    <Reveal effect="active">
      <div className="home-upload">
        <div className="home-upload-white fadeInUp delay4">
          <div className="home-upload-split">
            <div className="home-upload-box ">
              <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <>
                    <div
                      className={classNames("home-upload-dropzone", {
                        "drop-active": isDragActive
                      })}
                      {...getRootProps()}
                    >
                      <span className="home-upload-text">
                        <h3>Upload your Files</h3>
                        Drop your files here to pin to Skynet
                      </span>
                      <Button iconLeft>
                        <Folder />
                        Browse
                      </Button>
                    </div>
                    <input {...getInputProps()} className="offscreen" />
                  </>
                )}
              </Dropzone>
            </div>

            <div className="home-upload-retrieve">
              <div className="home-upload-text">
                <h3 id="skylink-retrieve-title">Have a Skylink?</h3>
                <p>Paste the link to retrieve your file</p>

                <form className="home-upload-retrieve-form" onSubmit={handleSkylink}>
                  <input name="skylink" type="text" placeholder="sia://" aria-labelledby="skylink-retrieve-title" />
                  <button type="submit" aria-label="Retrieve file">
                    <DownArrow />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="home-uploaded-files">
              {files.map((file, i) => {
                return <UploadFile key={i} {...file} />;
              })}
            </div>
          )}
        </div>

        <p className="bottom-text fadeInUp delay5">
          Upon uploading a file, Skynet generates a 46 byte link called a <strong>Skylink</strong>. This link can then
          be shared with anyone to retrieve the file on any Skynet Webportal.
        </p>

        <Deco3 className="deco-3 fadeInUp delay6" />
        <Deco4 className="deco-4 fadeInUp delay6" />
        <Deco5 className="deco-5 fadeInUp delay6" />
      </div>
    </Reveal>
  );
}
