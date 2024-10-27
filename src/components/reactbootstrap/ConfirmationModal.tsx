import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTheme } from "../contexts/ThemeProvider";

interface IModalItems {
  buttonText: string;
  title: string;
  body: string;
  closeButton: string;
  submitButton: string;
}

function ConfirmationModal({
  func,
  modalItems,
}: {
  func: () => void;
  modalItems: IModalItems;
}) {
  const [show, setShow] = useState(false);
  // const styles = modalItems.styles?.styles;
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.confirmationModal;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="danger"
        onClick={handleShow}
        className={` ${styles.deleteButton}`}
      >
        {modalItems.buttonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <div className={`${styles.background}`}>
          <Modal.Header
            className={`${styles.modalWrapper} `}
            closeVariant="white"
            closeButton
          >
            <Modal.Title>{modalItems.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={`${styles.modalWrapper}`}>
            {modalItems.body}
          </Modal.Body>
          <Modal.Footer className={`${styles.modalWrapper}`}>
            <Button variant="secondary" onClick={handleClose}>
              {modalItems.closeButton}
            </Button>
            <Button
              className={`${styles.confirmButton}`}
              variant="danger"
              onClick={() => {
                func();
              }}
            >
              {modalItems.submitButton}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
