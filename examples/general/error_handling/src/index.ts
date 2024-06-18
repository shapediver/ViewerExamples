import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

const sendNotification = (title: string, message: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }
};

(async () => {
  let viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });

  try {
    let session = await SDV.createSession({
      id: "mySession",
      ticket: "wrong ticket",
      modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
    });
  } catch (e) {
    if (
      e instanceof SDV.ShapeDiverGeometryBackendResponseError &&
      e.geometryBackendErrorType ===
        SDV.ShapeDiverGeometryBackendResponseErrorType.TICKET_VALIDATION_ERROR
    ) {
      // catch a specific error, in this case, a ticket validation error
      sendNotification("Error", `We have an error: ${JSON.stringify(e)}`);
    }
  }
})();
