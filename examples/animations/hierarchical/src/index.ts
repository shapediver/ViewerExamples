import * as SDV from "@shapediver/viewer";
import { quat, vec3 } from "gl-matrix";
import * as THREE from "three";

(<any>window).SDV = SDV;

const createSphere = (color: number, position: number[]): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(15, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  return mesh;
};

const createRectangle = (color: number, position: number[]): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(100, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  return mesh;
};

(async () => {
  let viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    visibility: SDV.VISIBILITY_MODE.INSTANT
  });

  const tracks: SDV.IAnimationTrack[] = [];

  /**
   * NODE 1
   */

  const node1 = new SDV.TreeNode();
  SDV.sceneTree.root.addChild(node1);
  node1.addData(new SDV.ThreejsData(createSphere(0xff0000, [0, 0, 0])));
  node1.addData(new SDV.ThreejsData(createRectangle(0xff0000, [50, 0, 0])));
  node1.addData(new SDV.ThreejsData(createSphere(0xff0000, [100, 0, 0])));

  const node1_quat1 = quat.create();
  const node1_quat2 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    -Math.PI / 2
  );
  tracks.push({
    times: [0, 4, 8],
    node: node1,
    values: [
      node1_quat1[0],
      node1_quat1[1],
      node1_quat1[2],
      node1_quat1[3],
      node1_quat2[0],
      node1_quat2[1],
      node1_quat2[2],
      node1_quat2[3],
      node1_quat1[0],
      node1_quat1[1],
      node1_quat1[2],
      node1_quat1[3]
    ],
    path: "rotation",
    interpolation: "linear"
  });

  /**
   * NODE 2 - animation helper node
   */

  const node2 = new SDV.TreeNode();
  node1.addChild(node2);

  const node2_quat1 = quat.create();
  const node2_quat2 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    -Math.PI / 2
  );
  tracks.push({
    times: [0, 4, 8],
    node: node2,
    values: [
      node2_quat1[0],
      node2_quat1[1],
      node2_quat1[2],
      node2_quat1[3],
      node2_quat2[0],
      node2_quat2[1],
      node2_quat2[2],
      node2_quat2[3],
      node2_quat1[0],
      node2_quat1[1],
      node2_quat1[2],
      node2_quat1[3]
    ],
    path: "rotation",
    interpolation: "linear",
    pivot: [100, 0, 0]
  });

  /**
   * NODE 3
   */

  const node3 = new SDV.TreeNode();
  node2.addChild(node3);
  node3.addData(new SDV.ThreejsData(createSphere(0x00ff00, [130, 0, 0])));
  node3.addData(new SDV.ThreejsData(createRectangle(0x00ff00, [180, 0, 0])));
  node3.addData(new SDV.ThreejsData(createSphere(0x00ff00, [230, 0, 0])));

  const node3_quat1 = quat.create();
  const node3_quat2 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    -Math.PI / 2
  );
  tracks.push({
    times: [0, 4, 8],
    node: node3,
    values: [
      node3_quat1[0],
      node3_quat1[1],
      node3_quat1[2],
      node3_quat1[3],
      node3_quat2[0],
      node3_quat2[1],
      node3_quat2[2],
      node3_quat2[3],
      node3_quat1[0],
      node3_quat1[1],
      node3_quat1[2],
      node3_quat1[3]
    ],
    path: "rotation",
    interpolation: "linear",
    pivot: [130, 0, 0]
  });

  /**
   * NODE 4 - animation helper node
   */

  const node4 = new SDV.TreeNode();
  node3.addChild(node4);

  const node4_quat1 = quat.create();
  const node4_quat2 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    Math.PI / 2
  );
  tracks.push({
    times: [0, 4, 8],
    node: node4,
    values: [
      node4_quat1[0],
      node4_quat1[1],
      node4_quat1[2],
      node2_quat1[3],
      node4_quat2[0],
      node4_quat2[1],
      node4_quat2[2],
      node4_quat2[3],
      node4_quat1[0],
      node4_quat1[1],
      node4_quat1[2],
      node4_quat1[3]
    ],
    path: "rotation",
    interpolation: "linear",
    pivot: [230, 0, 0]
  });

  /**
   * NODE 5
   */

  const node5 = new SDV.TreeNode();
  node4.addChild(node5);
  node5.addData(new SDV.ThreejsData(createSphere(0x0000ff, [260, 0, 0])));
  node5.addData(new SDV.ThreejsData(createRectangle(0x0000ff, [310, 0, 0])));
  node5.addData(new SDV.ThreejsData(createSphere(0x0000ff, [360, 0, 0])));

  const node5_quat1 = quat.create();
  const node5_quat2 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    Math.PI / 2
  );
  tracks.push({
    times: [0, 4, 8],
    node: node5,
    values: [
      node5_quat1[0],
      node5_quat1[1],
      node5_quat1[2],
      node5_quat1[3],
      node5_quat2[0],
      node5_quat2[1],
      node5_quat2[2],
      node5_quat2[3],
      node5_quat1[0],
      node5_quat1[1],
      node5_quat1[2],
      node5_quat1[3]
    ],
    path: "rotation",
    interpolation: "linear",
    pivot: [260, 0, 0]
  });

  /**
   * CONSTUCT ANIMATION DATA
   */
  const animationData = new SDV.AnimationData("animation", tracks, 0, 8);
  animationData.repeat = true;
  SDV.sceneTree.root.addData(animationData);
  animationData.startAnimation();
})();
