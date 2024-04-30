import { createViewport, createSession, ITreeNode, ORTHOGRAPHIC_CAMERA_DIRECTION } from "@shapediver/viewer";

(async () => {
  // create a viewport1
  const viewport1 = await createViewport({
    canvas: document.getElementById("canvas1") as HTMLCanvasElement,
    id: "myViewport1"
  });

  // create a viewport2
  const viewport2 = await createViewport({
    canvas: document.getElementById("canvas2") as HTMLCanvasElement,
    id: "myViewport2"
  });

  // create a session
  const session = await createSession({
    ticket:
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a new orthographic camera
  const camera = viewport2.createOrthographicCamera();
  camera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.FRONT;
  viewport2.assignCamera(camera.id);
})();
