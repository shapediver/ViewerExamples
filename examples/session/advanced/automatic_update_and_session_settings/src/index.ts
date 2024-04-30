

import { createViewport, createSession, sceneTree } from "@shapediver/viewer";
import { mat4, vec3 } from "gl-matrix";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });

  // create a session
  const session = await createSession({
    ticket:
      "70521fd06eff15d8e29aced0b53f3b39f0a384d34eece1f7c2a7e2a4968a64882952b07ce17238d62eaaab447e0b72a187041c3e962a9457778011e962f7e1c5832457ffb8fbfac0625e2e160fa446ced54a9c5314a6fb7f15b952360ed5623746c096fd46d7e2-4b003a75c1361371cee91b6d78159a12",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // setting automatic update to false, does not update the scene tree anymore
  session.automaticSceneUpdate = false;

  // change a parameter to 6
  session.getParameterByName("Length")[0].value = 6;

  // you get the node back, but it is not added to the scene tree as long as automaticUpdate is active
  const nodeWithLenth6 = await session.customize();

  // change a parameter to 2
  session.getParameterByName("Length")[0].value = 2;

  // you get the node back, but it is not added to the scene tree as long as automaticUpdate is active
  const nodeWithLenth2 = await session.customize();

  // I know decide to add both nodes manually and transform one of them
  sceneTree.root.addChild(nodeWithLenth6);
  sceneTree.root.updateVersion();

  nodeWithLenth2.transformations.push({
    id: "translation",
    matrix: mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 25))
  });
  sceneTree.root.addChild(nodeWithLenth2);
  sceneTree.root.updateVersion();
  viewport.update();
})();
