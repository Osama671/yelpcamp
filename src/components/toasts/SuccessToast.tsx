import React, { useEffect, useState, useContext } from "react";
import Toast from "react-bootstrap/Toast";
import { createContext } from "vm";
const ToastContext = createContext();

function SuccessToast({ message = "test" }) {
  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);

  const showToast = () => {
    setInterval(() => {
      toggleShowA();
    }, 1000);
  };

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setShowA((prev) => !prev);
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }, []);

  return (
    <ToastContext.Provider>
      <div className="position-fixed bottom-0 end-0">
        <Toast show={showA} onClose={toggleShowA} bg="success">
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
