import React, { useState, useRef, useEffect } from "react"
import YesNoModal from "../YesNoModal"
import styles from "./canvas.module.scss"

const Canvas = () => {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [image, setImage] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [clickPosition, setClickPosition] = useState(undefined)
  const [showRestoreBtn, setShowRestoreBtn] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"))
  }, [])

  useEffect(() => {
    if (!ctx) return

    if (image) {
      const img = new Image()
      img.src = image.preview
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const width = ctx.canvas.width * 0.9
        const height = width / aspectRatio
        const x = (ctx.canvas.width - width) / 2
        const y = (ctx.canvas.height - height) / 2
        ctx.drawImage(img, x, y, width, height)
        setIsLoaded(true)
      }
    }
    if (isLoaded) {
      setTimeout(() => {
        alert("Please draw a path to create a puzzle piece")
      }, 10)
      setIsLoaded(false)
    }
    clickPosition && setShowRestoreBtn(true)
    return () => {
      setImage(null)
    }
  }, [ctx, image, isDrawing, isLoaded, clickPosition])

  const handleDrop = (event) => {
    event.preventDefault()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const files = Array.from(event.dataTransfer.files)
    const newImage = files.find((file) => file.type.startsWith("image/"))
    if (newImage) {
      setImage(
        Object.assign(newImage, {
          preview: URL.createObjectURL(newImage),
        })
      )
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  // const onMouseDown = (e) => {
  //   points.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  // }

  // const onMouseMove = (e) => {
  //   if (e.buttons !== 1) return

  //   points.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })

  //   ctx.beginPath()
  //   ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y)
  //   ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  //   ctx.lineWidth = 2
  //   ctx.lineJoin = "round"
  //   ctx.setLineDash([10])
  //   ctx.stroke()
  // }

  // const onMouseUp = (e) => {
  //   const canvas = canvasRef.current
  //   points.push(points[0])
  //   ctx.beginPath()
  //   ctx.moveTo(points[0].x, points[0].y)
  //   for (let i = 1; i < points.length; i++) {
  //     ctx.lineTo(points[i].x, points[i].y)
  //   }
  //   ctx.closePath()
  //   ctx.stroke()
  //   ctx.restore()
  //   let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  //   let pixels = imageData.data
  //   for (let y = 0; y < canvas.height; y++) {
  //     for (let x = 0; x < canvas.width; x++) {
  //       if (!ctx.isPointInPath(x, y)) {
  //         let index = (y * canvas.width + x) * 4
  //         pixels[index + 3] = 0
  //       }
  //     }
  //   }
  //   ctx.putImageData(imageData, 0, 0)
  //   setPoints([])
  // }

  const onMouseDown = (e) => {
    const canvas = canvasRef.current
    ctx.save()
    ctx.lineWidth = 2
    ctx.lineJoin = "round"
    ctx.setLineDash([10])
    setClickPosition({ x: e.pageX, y: e.pageY })
    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop)
  }

  const onMouseMove = (e) => {
    const canvas = canvasRef.current
    if (isDrawing) {
      let x = e.pageX - canvas.offsetLeft
      let y = e.pageY - canvas.offsetTop
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const onMouseUp = () => {
    setIsDrawing(false)
    ctx.closePath()
    ctx.stroke()
    ctx.clip()
    ctx.fillStyle = "grey"
    ctx.fill()
    ctx.restore()
  }

  const restoreImage = (e) => {}

  return (
    <>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={800}
        height={600}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <button
        className={styles.clearBtn}
        onClick={() => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          setPoints([])
          setShowRestoreBtn(false)
        }}
      >
        Cleare the canvas
      </button>
      {clickPosition && showRestoreBtn && (
        <button
          className={styles.restoreBtn}
          style={{ left: clickPosition.x + 10, top: clickPosition.y - 20 }}
          onClick={() => restoreImage()}
          onMouseUp={() => {
            setShowRestoreBtn(false)
          }}
        >
          <p>x</p>
        </button>
      )}
      <YesNoModal
        show={showModal}
        onCloseModal={() => {
          setShowModal(false)
        }}
      />
    </>
  )
}

export default Canvas
