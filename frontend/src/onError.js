function register(serverUrl) {
  const _onerror = window.onerror;

  window.onerror = function(msg, url, line, col, err) {
    sendError(serverUrl, { err: err.stack, file: url });

    if (_onerror && typeof _onerror === 'function') {
      _onerror.apply(window, arguments);
    }
  };
}

function sendError(url, err) {
  console.log(err);
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(err),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export default register;
