

import { createViewport, createSession } from "@shapediver/viewer";
import { vec3 } from "gl-matrix";

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

  // get the camera of the viewer
  const camera = viewport.camera!;

  // get the output of the door
  const doorOutput = session.getOutputByName("Door")[0];

  /**
   * ZOOMING PART 1
   *
   * standard zoom
   */
  await camera.zoomTo(doorOutput.node!.boundingBox);

  // reset
  await camera.reset({ duration: 2500 });

  /**
   * ZOOMING PART 2
   *
   * advanced zoom with initial direction
   */

  const zoomFactor = 2;
  const direction = vec3.fromValues(0, -1, 0);

  // create the position and target manually
  const boundingSphere = doorOutput.node!.boundingBox.boundingSphere;
  const target = boundingSphere.center;
  const scalingFactor = boundingSphere.radius * zoomFactor;
  const position = vec3.add(
    vec3.create(),
    target,
    vec3.multiply(
      vec3.create(),
      direction,
      vec3.fromValues(scalingFactor, scalingFactor, scalingFactor)
    )
  );

  // the durations specifies how long it takes to get to the final position
  await camera.set(position, target, { duration: 800 });
})();
