import {
  createViewport,
  EVENTTYPE,
  FLAG_TYPE,
  SPINNER_POSITIONING,
  VISIBILITY_MODE
} from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewer",
    branding: {
      busyModeSpinner:
        "https://viewer.shapediver.com/v3/youtube/video1/catAstronaut.png",
      spinnerPositioning: SPINNER_POSITIONING.BOTTOM_LEFT
    },
    visibility: VISIBILITY_MODE.INSTANT
  });

  viewport.addFlag(FLAG_TYPE.BUSY_MODE);
})();
