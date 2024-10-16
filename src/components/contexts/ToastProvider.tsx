import React, { useState, createContext, useContext } from "react";
import Toast from "react-bootstrap/Toast";

type ToastContextProviderProps = {
  children: React.ReactNode;
};

type ToastFunction = (toastMessage: string, toastColor: string) => void;

const ToastContext = createContext<ToastFunction | null>(null);
let toastTimeoutId: ReturnType<typeof setTimeout>;

export const ToastProvider = ({ children }: ToastContextProviderProps) => {
  const [showA, setShowA] = useState(false);
  const [message, setMessage] = useState("test");
  const [color, setColor] = useState("green");

  const toggleShowA = () => setShowA((prev) => !prev);

  const showToast = (toastMessage: string, toastColor: string) => {
    setColor(toastColor);
    setMessage(toastMessage);
    setShowA(true);
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
      setShowA(false);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="position-fixed bottom-0 end-0">
        <Toast
          show={showA}
          onClose={toggleShowA}
          style={{ backgroundColor: color }}
        >
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
