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
      "319f14f08c1e67a874fd843acecfd321049772deb0cdb5a0dbb39385592a156e83730e45c5e7af5eab52e15b1e36d44a092f71ada1331e1935b0f25d9448af34d0add0bd5abf8984325b97ee9e6106b25216446d15a86bb18b40114df89d2f5909b08e8c8b9eeb-7516be37cb2d968a0b3c545baf3ae51e",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a new orthographic camera
  const camera = viewport2.createOrthographicCamera();
  camera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.FRONT;
  viewport2.assignCamera(camera.id);
})();