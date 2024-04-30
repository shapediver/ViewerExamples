

import {
  createViewport,
  createSession,
  TreeNode,
  ThreejsData,
  sceneTree
} from "@shapediver/viewer";
import * as THREE from "three";

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

  // create a node that contains our data
  const threejsNode = new TreeNode();

  // create an Object3D and add it to the node as a data item
  const obj = new THREE.Object3D();
  threejsNode.data.push(new ThreejsData(obj));

  // add any kind of three js items to that object
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const torus = new THREE.Mesh(geometry, material);
  obj.add(torus);

  // add the node to the scene tree and update
  sceneTree.root.addChild(threejsNode);
  sceneTree.root.updateVersion();
  viewport.update();
})();
