

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  IOutputApi,
  ITreeNode,
  MaterialStandardData,
  sceneTree,
  ThreejsData,
  TreeNode,
} from "@shapediver/viewer";
import {
  DragManager,
  InteractionData,
  InteractionEngine,
  PlaneConstraint,
} from "@shapediver/viewer.features.interaction";
import * as THREE from "three";

const gatherPoints = (pointsOutput: IOutputApi) => {
  const pointArray = [];
  for (let i = 0; i < pointsOutput.node!.children.length; i++) {
    const center =
      pointsOutput.node!.children[i].boundingBox.boundingSphere.center;
    pointArray.push([
      Math.round(center[0] * 100) / 100,
      Math.round(center[1] * 100) / 100,
      Math.round(center[2] * 100) / 100,
    ]);
  }
  return pointArray;
};

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport",
  });
  // create a session
  const session = await createSession({
    ticket:
      "072e535fc13eafbad7d843c7f2c72f83c7eaae971bcc3d25a4f44fe6f7e3de0cb7c73b12fd272c79f57663602419ce932772838fbe6739460dc38011b68249e02c1d738eba8427e641169c082eead69a0c0f25a649b4c00e5e501c9be447f03e895562cd8b7bd6-f392bb2225131a97c4acc665e8a44995",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession",
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the dragManager and add it
  const dragManager = new DragManager();
  dragManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });
  interactionEngine.addInteractionManager(dragManager);

  // add a plane constraint
  const planeConstraint = new PlaneConstraint([0, 0, 1], [0, 0, 0]);
  // use the token to remove the constraint again (removeDragConstraint)
  const token = dragManager.addDragConstraint(planeConstraint);

  // Create a visualization helper node where we store the intermediate curves
  const node = new TreeNode();
  const threeJsData = new ThreejsData(new THREE.Object3D());
  node.addData(threeJsData);
  node.updateVersion();
  sceneTree.addNode(node);
  sceneTree.root.updateVersion();

  // gather all outputs that are needed for this example
  const pointsOutput = session.outputs["81ab5fbcf6c4d20f15a7e51840a1d01c"];
  const polyLineOutput = session.outputs["16fab577b3bba980e733c1fbfa70394f"];

  // apply an update callback to add InteractionData
  pointsOutput.updateCallback = (newNode?: ITreeNode, oldNode?: ITreeNode) => {
    if (!newNode) return;

    for (let i = 0; i < newNode.children.length; i++) {
      // add the interaction data to the session
      newNode.children[i].data.push(new InteractionData({ drag: true }));
      newNode.updateVersion();
    }
  };
  pointsOutput.updateCallback(pointsOutput.node);

  /**
   * On drag start, we make the current poly lines invisible
   */
  addListener(EVENTTYPE.INTERACTION.DRAG_START, (e) => {
    polyLineOutput.node!.visible = false;
    polyLineOutput.node!.updateVersion();
    session.node.updateVersion();
  });

  /**
   * On drag move, we gather the points and create a curve to visualize the current result
   */
  addListener(EVENTTYPE.INTERACTION.DRAG_MOVE, (e) => {
    const pointArray = gatherPoints(pointsOutput);

    let pts = pointArray.map((pt) => new THREE.Vector3(pt[0], pt[1], 0));
    let curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.75);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);

    threeJsData.obj = curveObject;
    threeJsData.updateVersion();
    node.updateVersion();
  });

  /**
   * On drag end, we gather all the point data and customize the scene.
   */
  addListener(EVENTTYPE.INTERACTION.DRAG_END, async (e) => {
    const pointArray = gatherPoints(pointsOutput);

    // customize the scene with the point data
    session.parameters[
      "babdde12-64b1-4c88-a448-c04b79fc97e7"
    ].value = `{"points":${JSON.stringify(pointArray)}}`;
    await session.customize();

    // replace the curve preview with an empty object
    threeJsData.obj = new THREE.Object3D();

    // show the polyLine output again
    polyLineOutput.node!.visible = true;
    polyLineOutput.node!.updateVersion();
    session.node.updateVersion();
  });
})();
