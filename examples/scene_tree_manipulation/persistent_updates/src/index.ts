

import {
  createViewport,
  createSession,
  sceneTree,
  ITreeNode
} from "@shapediver/viewer";
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

  // get the door geometry output (the one that does not have material in the format)
  const doorOutput = session
    .getOutputByName("Door")
    .find((o) => !o.format.includes("material"))!;

  // create a callback that applies a transformation to the specified node
  const callback = (newNode?: ITreeNode) => {
    if (!newNode) return;
    // add a transformation to it
    newNode.addTransformation({
      id: "transformation",
      matrix: mat4.fromTranslation(mat4.create(), vec3.fromValues(0, -25, 0))
    });
    newNode.updateVersion();
  };

  // set the updateCallback
  doorOutput.updateCallback = callback;
  // and call it once in the beginning
  callback(doorOutput.node);
})();
