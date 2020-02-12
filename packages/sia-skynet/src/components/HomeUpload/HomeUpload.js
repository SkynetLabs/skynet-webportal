import React, { Component } from 'react'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import Reveal from 'react-reveal/Reveal'

import { Button, UploadFile } from '../'
import { Deco3, Deco4, Deco5 } from '../../svg'
import './HomeUpload.scss'

export default class HomeUpload extends Component {
  state = { files: [] }

  handleDrop = async acceptedFiles => {
    this.setState({
      files: [
        ...acceptedFiles.map(file => {
          return { file, status: 'uploading' }
        }),
        ...this.state.files,
      ],
    })

    acceptedFiles.forEach(async (file) => {
      const url = `https://siasky.net/api/skyfile?filename=${file.name}`
      const fd = new FormData()
      fd.append("file", file)

      const onComplete = (status, skylink) => {
        this.setState((state) => {
          const index = state.files.findIndex((f) => f.file === file);

          return { 
              files: [
              ...state.files.slice(0, index),
              { ...state.files[index], status, url: `https://siasky.net/file/${skylink}` },
              ...state.files.slice(index + 1)
            ]
          }
        })
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          body: fd,
          mode: "cors"
        });
        const { skylink } = await response.json();

        onComplete('complete', skylink);
      } catch(error) {
        onComplete('error');
      }
    })
  }

  render() {
    return (
      <Reveal effect="active">
        <div className="home-upload">
          <div className="home-upload-box fadeInUp delay6">
            <Dropzone onDrop={acceptedFiles => this.handleDrop(acceptedFiles)}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <>
                  <div
                    className={classNames('home-upload-dashed', { 'drop-active': isDragActive })}
                    {...getRootProps()}
                  >
                    <span className="home-upload-text">Drag &amp; drop your file(s) here to pin</span>
                    <Button>Browse</Button>
                  </div>
                  <input {...getInputProps()} className="offscreen" />
                </>
              )}
            </Dropzone>

            {this.state.files.length > 0 && (
              <div className="home-uploaded-files">
                {this.state.files.map((file, i) => {
                  return <UploadFile key={i} {...file} />
                })}
              </div>
            )}
          </div>

          <p className="bottom-text fadeInUp delay8">
            Once a file has been uploaded, a 46 byte link called a 'Skylink' is generated. That link can then be shared
            with anyone to fetch the file from Skynet.
          </p>

          <Deco3 className="deco-3 fadeInUp delay8" />
          <Deco4 className="deco-4 fadeInUp delay8" />
          <Deco5 className="deco-5 fadeInUp delay8" />
        </div>
      </Reveal>
    )
  }
}
