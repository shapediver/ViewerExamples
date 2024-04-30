

import {
  createViewport,
  createSession,
  IPerspectiveCameraApi
} from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "30dc8a3270069c18d68505abe89a1c212a32b85d2e2e953c8dcc6e2f79f64db6da1ec5acf839e733b488f3ddd7b185316e6aac226bac1eb9cf40706dd7c2b533ccdf1096bc7f5c7d06d13ddafb3659c6df4c77e6f3463581546a8a7147c8777e00aa1458e837d7-49ce0659887c792948c7128196049295",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // get the camera of the viewer
  const camera = viewport.camera! as IPerspectiveCameraApi;
  await camera.zoomTo();

  // zoom in
  const imgPlus = document.getElementById("img_plus")!;
  imgPlus.onclick = () => {
    camera.zoomToFactor = camera.zoomToFactor - 0.4 * camera.zoomSpeed;
    camera.zoomTo();
  };

  // zoom out
  const imgMinus = document.getElementById("img_minus")!;
  imgMinus.onclick = () => {
    camera.zoomToFactor = camera.zoomToFactor + 0.4 * camera.zoomSpeed;
    camera.zoomTo();
  };
})();
