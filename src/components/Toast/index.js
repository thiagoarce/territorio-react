import React from 'react';
import { ToastContainer } from 'react-toastify';

const Toast = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export default Toast;
