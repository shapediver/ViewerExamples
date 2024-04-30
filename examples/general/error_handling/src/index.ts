import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

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
      console.log("We have an error:", e);
    }
  }
})();
