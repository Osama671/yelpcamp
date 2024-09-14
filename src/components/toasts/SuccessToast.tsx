import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";

function SuccessToast({ message = "test"}) {
  const [showA, setShowA] = useState(true);

  const toggleShowA = () => setShowA(!showA);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowA((prev) => !prev);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="position-fixed bottom-0 end-0">
      <Toast show={showA} onClose={toggleShowA} bg="success">
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </div>
  );
}

export default SuccessToast;
