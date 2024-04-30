import * as SDV from "@shapediver/viewer";
import {
  addListener,
  EVENTTYPE,
  ITreeNode,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  HoverManager,
  InteractionData,
  InteractionEngine,
  MultiSelectManager
} from "@shapediver/viewer.features.interaction";
import * as THREE from "three";

(<any>window).SDV = SDV;

(async () => {
  let viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  let session = await SDV.createSession({
    id: "mySession",
    ticket:
      "72d5be7e13edc21fc8895e315d26efbd35757f541d4451d80f9d4694cc7817026c0459beb6527aeab7716d35a0432d43f3dd6c1e4d0a8c91d4809229575820047b77d8e06f5b9cef9322e45ce3b053e818704bbd75b29fb602a6f799e9a05dea659ba41a4d5bda-d40dc7d9510f7ac1c93a2117e4c29a9a",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);
  interactionEngine.intersectionOpacity = 0;

  // create the hoverManager and add it
  const hoverManager = new HoverManager();
  interactionEngine.addInteractionManager(hoverManager);

  hoverManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });

  // create the multiSelectManager and add it
  const multiSelectManager = new MultiSelectManager();
  multiSelectManager.effectMaterial = new MaterialStandardData({
    color: "#0000ff"
  });
  interactionEngine.addInteractionManager(multiSelectManager);

  const interactionData = new InteractionData({
    select: true,
    hover: true
  });

  // whenever the node updates re-assign interaction data to make the the nodes interactible
  const cb = (node: ITreeNode) => {
    node.traverse((n) => {
      if (n.name === "mesh_0") {
        n.children.forEach((c) => {
          c.addData(interactionData);
          c.updateVersion();
        });
      }
    });
  };
  session.updateCallback = cb;
  cb(session.node);

  // add an empty threejs object to the scene that will be used for the line
  const obj = new THREE.Object3D();
  const threeJsData = new SDV.ThreejsData(obj);
  SDV.sceneTree.root.addData(threeJsData);
  SDV.sceneTree.root.updateVersion();

  // create a line from the boundingbox centers of the selected nodes
  const createLine = (nodes: ITreeNode[]) => {
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000
    });

    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      const center = nodes[i].boundingBox.boundingSphere.center;
      points.push(new THREE.Vector3(center[0], center[1], center[2]));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    threeJsData.obj = line;
    SDV.sceneTree.root.updateVersion();
  };

  // create the line when nodes got selected or deselected
  addListener(EVENTTYPE.INTERACTION.SELECT_ON, (e) => {
    createLine((<any>e).nodes!);
  });
  addListener(EVENTTYPE.INTERACTION.SELECT_OFF, (e) => {
    createLine((<any>e).nodes!);
  });
})();
