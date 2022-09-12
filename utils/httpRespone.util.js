const responseBodyFormat = {
  errorFormat(data) {
    const errorBaseFormat = {
      message: data
    };

    if (typeof data !== 'string') {
      return data;
    }

    return errorBaseFormat;
  },

  successFormat(data) {
    const generalSuccessBaseFormat = {
      message: data
    };

    if (typeof data !== 'string') {
      return data;
    }

    return generalSuccessBaseFormat;
  }
}

function httpRespStatusUtil() {
  function sendOk(res, data) {
    res.status(200).send(responseBodyFormat.successFormat(data));
  }

  function sendCreatedOk(res, data) {
    res.status(201).send(responseBodyFormat.successFormat(data));
  }

  function sendBadRequest(res, data) {
    res.status(400).send(responseBodyFormat.errorFormat(data));
  }

  function sendUnauthorized(res, data) {
    res.status(401).send(responseBodyFormat.errorFormat(data));
  }

  function sendRequestFailed(res, data) {
    res.status(403).send(responseBodyFormat.errorFormat(data));
  }

  return {
    sendOk,
    sendCreatedOk,
    sendBadRequest,
    sendUnauthorized,
    sendRequestFailed
  };
}

module.exports = httpRespStatusUtil();
