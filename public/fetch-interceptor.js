const sendResponseData = (data) => {
  const customEvent = new CustomEvent('response', {
    detail: data,
  });

  document.dispatchEvent(customEvent);
};

const interceptResponse = async (response) => {
  if (!response.url.includes('meet.google.com')) {
    return;
  }

  const body = await response.text();

  sendResponseData({
    url: response.url,
    body: body,
  });
};

const patch = () => {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    interceptResponse(response.clone());

    return response;
  };
};

patch();
