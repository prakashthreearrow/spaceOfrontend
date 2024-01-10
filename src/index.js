import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, Slide } from "react-toastify";
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const CloseButton = ({ closeToast }) => (
  <i
    className="fa fa-times-circle align-self-center f-18"
    onClick={closeToast}
  />
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer
          autoClose={5000}
          draggable={false}
          transition={Slide}
          closeButton={CloseButton}
          hideProgressBar={false}
          position="top-center"
          toastClassName="toast-notification"
        />
    <App />
  </React.StrictMode>
);
