import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface IModalItems {
  buttonText: string;
  title: string;
  body: string;
  closeButton: string;
  submitButton: string;
  styles?: CSSModuleClasses;
}

function ConfirmationModal({
  func,
  modalItems,
}: {
  func: () => void;
  modalItems: IModalItems;
}) {
  const [show, setShow] = useState(false);
  const { styles } = modalItems;
  console.log("Styles", styles);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="danger"
        onClick={handleShow}
        className={` ${styles?.deleteCampgroundButton}`}
      >
        {modalItems.buttonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalItems.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalItems.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {modalItems.closeButton}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              func();
            }}
          >
            {modalItems.submitButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
