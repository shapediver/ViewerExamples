

import { createAnimation, openDoors } from "./helpers/animationHelpers";
import { createMenu } from "./helpers/menuHelpers";
import { changeMaterials } from "./helpers/materialHelpers";
import { addNodeRotation, addShadowPlane } from "./helpers/generalHelpers";
import {
  createViewport,
  createSession,
  IPerspectiveCameraApi,
  VISIBILITY_MODE
} from "@shapediver/viewer";

(async () => {
  addShadowPlane();

  // create a viewport
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport",
    branding: {
      backgroundColor: "#303030"
    },
    visibility: VISIBILITY_MODE.MANUAL
  });
  // create a session
  const session = await createSession({
    ticket:
      "763b55012bb599a42885c5eefbc8bb7292f1f211175b12debf16df90f308f5f8475fea13ba834f90ca370409c3e6cb3f528171825b73c259fc094b8c07cc94efd06e602cba841f315d721567af2ab6bb98880fbf57bb14da292f527da2ebf0ba6af8d772e90fb6-db87ccc766ade2163dbe3d5f66ea55a1",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  addNodeRotation(session);

  const camera = <IPerspectiveCameraApi>viewport.camera!;
  camera.cubePositionRestriction = {
    min: [-Infinity, -Infinity, 0],
    max: [Infinity, Infinity, Infinity]
  };
  camera.cubeTargetRestriction = {
    min: [-Infinity, -Infinity, 0],
    max: [Infinity, Infinity, Infinity]
  };

  changeMaterials(session);
  createMenu(session, viewport);
  createAnimation(session, viewport);
})();
