import React from "react"
import Modal from "react-modal"
import styles from "./yesNoModal.module.scss"
const YesNoModal = ({ show, onCloseModal }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onCloseModal}
      overlayClassName={styles.modalOverlay}
      className={styles.modal}
    >
      <div className={styles.reactModalContent}>
        <p>Are you sure you want to delete this piece?</p>
        <div className={styles.buttons}>
          <button onClick={onCloseModal}>delete</button>
          <button onClick={onCloseModal}>cancel</button>
        </div>
      </div>
    </Modal>
  )
}

export default YesNoModal
