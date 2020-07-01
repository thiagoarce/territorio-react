import React, { useEffect, useState } from 'react';
import { Snackbar, Button } from '@material-ui/core';
import * as serviceWorker from '../../serviceWorker';

const ServiceWorkerWrapper = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWSuccess = () => {
    setShowSuccess(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccess(false);
  };

  const onSWUpdate = registration => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onSuccess: onSWSuccess, onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  return (
    <>
      <Snackbar
        open={showSuccess}
        onClose={handleClose}
        message="Você pode usar esse aplicativo offline"
        autoHideDuration={8000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={showReload}
        message="Uma nova versão está disponível!"
        onClick={reloadPage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={reloadPage}>
            Atualizar
          </Button>
        }
      />
    </>
  );
};

export default ServiceWorkerWrapper;
