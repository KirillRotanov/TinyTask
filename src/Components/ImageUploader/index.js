import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import styles from "./imageUploader.module.scss"

const ImageUploader = () => {
  const [images, setImages] = useState([])

  const onDrop = (acceptedFiles) => {
    if (images.length > 11) {
      images.splice(12)
      return
    }
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    )
    setImages([...newImages, ...images])
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  })

  const removeImage = (image, event) => {
    event.stopPropagation()
    setImages(images.filter((img) => img !== image))
  }

  return (
    <div className={styles.imageDropzoneContainer} {...getRootProps()}>
      {images.length > 0 && <h4 className={styles.title}>Images:</h4>}
      <input {...getInputProps()} />
      <div className={styles.thumbnails}>
        {images.length < 1 && (
          <h3 className={styles.subTitle}>Upload your images here...</h3>
        )}
        {images.map((image) => (
          <div key={image.preview} className={styles.thumbnail}>
            <img
              className={styles.imagePreview}
              src={image.preview}
              alt={image.name}
            />
            <button
              className={styles.deleteBtn}
              onClick={(e) => removeImage(image, e)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader
