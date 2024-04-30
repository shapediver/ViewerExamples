

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
      "319f14f08c1e67a874fd843acecfd321049772deb0cdb5a0dbb39385592a156e83730e45c5e7af5eab52e15b1e36d44a092f71ada1331e1935b0f25d9448af34d0add0bd5abf8984325b97ee9e6106b25216446d15a86bb18b40114df89d2f5909b08e8c8b9eeb-7516be37cb2d968a0b3c545baf3ae51e",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // clone the node
  const clonedNode = session.node.clone();

  // add a transformation to it
  clonedNode.transformations.push({
    id: "transformation",
    matrix: mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 25, 0))
  });

  // update the version of the node
  clonedNode.updateVersion();

  // add the node to the scenetree
  sceneTree.root.addChild(clonedNode);
  sceneTree.root.updateVersion();

  // update everything
  viewport.update();

  // read out the parameter with the specific name
  const lengthParameter = session.getParameterByName("Length")[0];

  // update the value
  lengthParameter.value = 6;

  // and customize the scene
  await session.customize();
})();
