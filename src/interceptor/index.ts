(function () {
  const GOOGLE_MEET_URL = 'meet.google.com';

  function sendResponseData(detail: { url: string; body: string }) {
    document.dispatchEvent(new CustomEvent('response', { detail }));
  }

  async function interceptResponse(response: Response) {
    const { url } = response;
    if (!url.includes(GOOGLE_MEET_URL)) {
      return;
    }

    const body = await response.text();

    sendResponseData({ url, body });
  }

  const originalFetch = window.fetch;

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);

    if (response.url.includes(GOOGLE_MEET_URL)) {
      interceptResponse(response.clone());
    }

    return response;
  };
})();
