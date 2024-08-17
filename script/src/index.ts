import { GET_CREDENTIALS_ACTION, MESSAGES_EVENT_ENUM } from "./constants/event";
import {
  buildFullTour,
  highlightELement,
  previewTour,
} from "./handlers/driverjs-handlers";
import { overrideWindowFetchMethod } from "./handlers/network-handlers";
import {
  disableSelectElement,
  enableSelectElement,
  removeBlurOverlayWhenHighlight,
} from "./handlers/ui-handlers";
import {
  BASE_TOUR_CONFIG,
  initDriverJs,
  toolDriverInstance,
  webDriverInstance,
} from "./libs/driverJs";

export let isInEditor = false;
const parent = window.parent;
let tourData = null as any;
const API_URL = "YOUR_API_URL";

async function waitForTourData() {
  try {
    await fetchTourData();
  } catch (error) {
    console.log("waitForTourData error: ", error);
  }
}

async function fetchTourData() {
  const data = await fetch(API_URL);
  if (!data.ok) return;
  tourData = await data.json();
}

async function showTour() {
  await waitForTourData();

  if (!tourData) return;

  try {
    const tour = tourData[0];
    if (tour) {
      webDriverInstance.setConfig({
        ...tour,
        ...BASE_TOUR_CONFIG,
        steps: buildFullTour(tour.Steps),
      });
      webDriverInstance.drive();
    }
  } catch (error) {
    console.log("showTourBaseOnPersona error: ", error);
  }
}

function sendCredentialsToEditor() {
  const params = new URLSearchParams(document.location.search);
  const tourEditorAction = params.get("tour_editor_action");
  if (tourEditorAction === GET_CREDENTIALS_ACTION) {
    const localStorageCredentials = { ...localStorage };
    const sessionStorageCredentials = { ...sessionStorage };

    window.opener.postMessage(
      {
        type: MESSAGES_EVENT_ENUM.CREDENTIALS_FROM_POPUP,
        credentials: {
          localStorageCredentials,
          sessionStorageCredentials,
        },
      },
      "*"
    );

    window.close();
  }
}

function setCredentialsFromEditor(credentials: {
  localStorageCredentials: Record<string, string>;
  sessionStorageCredentials: Record<string, string>;
}) {
  Object.keys(credentials.localStorageCredentials).forEach((key) => {
    localStorage.setItem(key, credentials.localStorageCredentials[key]);
  });
  Object.keys(credentials.sessionStorageCredentials).forEach((key) => {
    sessionStorage.setItem(key, credentials.sessionStorageCredentials[key]);
  });
  window.location.reload();
}

function eventHandler(event: MessageEvent) {
  switch (event.data.type) {
    case MESSAGES_EVENT_ENUM.START_GETTING_ELEMENT:
      enableSelectElement();
      toolDriverInstance.destroy();
      break;
    case MESSAGES_EVENT_ENUM.END_GETTING_ELEMENT:
      disableSelectElement();
      break;
    case MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT:
      highlightELement(event);
      break;
    case MESSAGES_EVENT_ENUM.PREVIEW_TOUR:
      previewTour(event);
      break;
    case MESSAGES_EVENT_ENUM.CLEAN_UP:
      removeBlurOverlayWhenHighlight();
      toolDriverInstance.destroy();
      break;
    case MESSAGES_EVENT_ENUM.CREDENTIALS_FROM_EDITOR:
      setCredentialsFromEditor(event.data.credentials);
      break;
    default:
      break;
  }
}

async function initTourCreatorTool() {
  window.parent.postMessage({ type: MESSAGES_EVENT_ENUM.ON_LOADED }, "*");

  const parentUrl = await new Promise((resolve) => {
    window.addEventListener("message", function (e) {
      if (e.data.type === MESSAGES_EVENT_ENUM.HANDSHAKE) {
        window.parent.postMessage(
          { type: MESSAGES_EVENT_ENUM.CONNECTION_ESTABLISHED },
          "*"
        );
        isInEditor = true;
        resolve(e.data.parentUrl);
      }
    });
  });

  if (parentUrl) {
    window.addEventListener("message", function (e) {
      if (e.origin !== parentUrl) return;
      eventHandler(e);
    });
  }
}

async function initTourListener() {
  try {
    window.addEventListener(MESSAGES_EVENT_ENUM.SHOW_TOUR, showTour);
  } catch (error) {
    console.log("init tour error: ", error);
  }
}

async function initTourConnection(rootElementId: string) {
  sendCredentialsToEditor();
  window.onload = async function () {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        // i want to make sure that react app is mounted
        if (document.getElementById(rootElementId)?.childElementCount) {
          clearInterval(interval);
          initDriverJs();
          resolve();
        }
      }, 1000);
    });
    overrideWindowFetchMethod();
    initTourCreatorTool();
    initTourListener();
  };
}

(window as any).initTourConnection = initTourConnection;
