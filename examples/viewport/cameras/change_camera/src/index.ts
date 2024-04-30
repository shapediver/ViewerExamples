import {
    createSession,
    createViewport,
    ORTHOGRAPHIC_CAMERA_DIRECTION
  } from "@shapediver/viewer";
  
  const cameraSelect = <HTMLSelectElement>document.getElementById("cameras");
  
  (async () => {
    // create a viewport
    const viewport = await createViewport({
      canvas: document.getElementById("canvas") as HTMLCanvasElement,
      id: "myViewport"
    });
    // create a session
    const session = await createSession({
      ticket:
        "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
      modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
      id: "mySession"
    });
  
    const perspectiveCamera = viewport.camera!;
  
    const topCamera = viewport.createOrthographicCamera();
    topCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.TOP;
  
    const bottomCamera = viewport.createOrthographicCamera();
    bottomCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.BOTTOM;
  
    const leftCamera = viewport.createOrthographicCamera();
    leftCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.LEFT;
  
    const rightCamera = viewport.createOrthographicCamera();
    rightCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.RIGHT;
  
    const frontCamera = viewport.createOrthographicCamera();
    frontCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.FRONT;
  
    const backCamera = viewport.createOrthographicCamera();
    backCamera.direction = ORTHOGRAPHIC_CAMERA_DIRECTION.BACK;
  
    viewport.assignCamera(perspectiveCamera.id);
  
    cameraSelect.onchange = () => {
      switch (cameraSelect.value) {
        case "top":
          viewport.assignCamera(topCamera.id);
          break;
  
        case "bottom":
          viewport.assignCamera(bottomCamera.id);
          break;
  
        case "left":
          viewport.assignCamera(leftCamera.id);
          break;
  
        case "right":
          viewport.assignCamera(rightCamera.id);
          break;
  
        case "front":
          viewport.assignCamera(frontCamera.id);
          break;
  
        case "back":
          viewport.assignCamera(backCamera.id);
          break;
        default:
          viewport.assignCamera(perspectiveCamera.id);
      }
  
      viewport.update();
    };
  })();
  