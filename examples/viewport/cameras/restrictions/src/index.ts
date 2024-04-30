

import {
  createSession,
  createViewport,
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
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  const camera = <IPerspectiveCameraApi>viewport.camera!;

  camera.cubePositionRestriction = {
    min: [-Infinity, -Infinity, 0],
    max: [Infinity, Infinity, Infinity]
  };
  camera.cubeTargetRestriction = {
    min: [-Infinity, -Infinity, 0],
    max: [Infinity, Infinity, Infinity]
  };
  camera.rotationRestriction = {
    minAzimuthAngle: -Infinity, // default : -Infinity
    maxAzimuthAngle: Infinity, // default : Infinity
    minPolarAngle: 0, // default: 0
    maxPolarAngle: 90 // default: 180
  };

  camera.animate(
    [
      {
        position: [-187, -344, 110],
        target: camera.defaultTarget
      },
      {
        position: [-10, -244, 80],
        target: camera.defaultTarget
      },
      {
        position: camera.defaultPosition,
        target: camera.defaultTarget
      }
    ],
    {
      duration: 10000
    }
  );
  viewport.render();
})();
