import { MESSAGES_EVENT_ENUM } from "@/constants/event";

let PENDING_NETWORK_REQUESTS = {} as Record<string, boolean>;
let notifyWhenAllRequestsAreDone = null as number | null;

export const markAsPendingRequest = (requestKey: string) => {
  PENDING_NETWORK_REQUESTS[requestKey] = false;
  if (notifyWhenAllRequestsAreDone) {
    clearTimeout(notifyWhenAllRequestsAreDone);
  }
};

export const markPendingRequestToDone = (requestKey: string) => {
  PENDING_NETWORK_REQUESTS[requestKey] = true;
  const allRequestIsDone = Object.values(PENDING_NETWORK_REQUESTS).every(
    Boolean
  );
  if (allRequestIsDone) {
    if (notifyWhenAllRequestsAreDone) {
      clearTimeout(notifyWhenAllRequestsAreDone);
    }
    notifyWhenAllRequestsAreDone = setTimeout(() => {
      PENDING_NETWORK_REQUESTS = {};
      notifyReadyForTouring();
      notifyWhenAllRequestsAreDone = null;
    }, 1000);
  }
};

const isSpecialRequest = (url: any) => {
  return (
    (url.origin && url.origin.includes("cognito")) ||
    url.includes("cognito") ||
    url.includes("google-analytics")
  );
};

const notifyReadyForTouring = () => {
  window.parent.postMessage(
    { type: MESSAGES_EVENT_ENUM.READY_FOR_TOURING },
    "*"
  );
  window.dispatchEvent(new CustomEvent(MESSAGES_EVENT_ENUM.READY_FOR_TOURING));
};

export const overrideWindowFetchMethod = () => {
  const { fetch: origFetch } = window;
  let emptyNetWorkRequestTimeout = null as number | null;

  setTimeout(() => {
    notifyReadyForTouring();
  }, 5000);

  window.fetch = async (...args) => {
    const [url, config] = args;
    clearTimeout(emptyNetWorkRequestTimeout as any);

    if (!isSpecialRequest(url)) {
      const REQUEST_KEY = url + JSON.stringify(config?.body || "");
      markAsPendingRequest(REQUEST_KEY);
      const response = await origFetch(...args);
      markPendingRequestToDone(REQUEST_KEY);
      return response;
    }

    return origFetch(...args);
  };
};
