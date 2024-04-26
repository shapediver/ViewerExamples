import * as THREE from "three";
import { mat4 } from "gl-matrix";
import {
  addListener,
  EVENTTYPE,
  ISessionApi,
  sceneTree,
  ThreejsData,
  viewports
} from "@shapediver/viewer";

export const addShadowPlane = () => {
  const obj = new THREE.Object3D();
  const texture = new THREE.TextureLoader().load(
    "https://viewer.shapediver.com/v3/images/lambo/shadowLambo.png"
  );

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.rotation = Math.PI;
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#000000"),
    side: THREE.FrontSide,
    alphaMap: texture,
    transparent: true,
    opacity: 1,
    envMap: null
  });
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(625, 640),
    material
  );
  plane.position.set(0, -1.5, 0);
  obj.add(plane);
  sceneTree.root.data.push(new ThreejsData(obj));
};

export const addNodeRotation = (session: ISessionApi) => {
  session.node.transformations.push({
    id: "rot",
    matrix: mat4.fromRotation(mat4.create(), Math.PI / 2, [0, 0, 1])
  });
  sceneTree.root.updateVersion();
  viewports["myViewport"].update();
  addListener(EVENTTYPE.SESSION.SESSION_CUSTOMIZED, () => {
    session.node.transformations.push({
      id: "rot",
      matrix: mat4.fromRotation(mat4.create(), Math.PI / 2, [0, 0, 1])
    });
    sceneTree.root.updateVersion();
    viewports["myViewport"].update();
  });
};
