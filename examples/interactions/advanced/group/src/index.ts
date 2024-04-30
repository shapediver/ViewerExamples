

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  CameraPlaneConstraint,
  DragManager,
  HoverManager,
  InteractionData,
  InteractionEngine,
  LineConstraint,
  MultiSelectManager,
  PlaneConstraint,
  PointConstraint,
  SelectManager,
  SelectOnUpManager
} from "@shapediver/viewer.features.interaction";
import { vec3 } from "gl-matrix";
import * as viewer from "@shapediver/viewer";
(<any>window).SDV = viewer;

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

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the dragManager and add it
  const dragManager = new DragManager();
  dragManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });
  // interactionEngine.addInteractionManager(dragManager);

  // create the selectManager and add it
  const selectManager = new SelectManager();
  selectManager.effectMaterial = new MaterialStandardData({ color: "#ff0000" });
  interactionEngine.addInteractionManager(selectManager);

  // create the hoverManager and add it
  const hoverManager = new HoverManager();
  hoverManager.effectMaterial = new MaterialStandardData({ color: "#0000ff" });
  interactionEngine.addInteractionManager(hoverManager);

  const cameraPlane = new CameraPlaneConstraint();
  const token = dragManager.addDragConstraint(cameraPlane);

  const outputNames1 = ["SideRight", "SideLeft", "FeetLeft", "FeetRight"];
  outputNames1.forEach((n) => {
    const output = session
      .getOutputByName(n)
      .find((o) => !o.format.includes("material"));
    const data = new InteractionData(
      { drag: true, select: true, hover: true },
      "myGroup1"
    );
    data.dragOrigin = [0, 0, 0];
    output!.node!.data.push(data);
    output!.node!.updateVersion();
  });

  const outputNames2 = ["Back", "HorizontalTop", "HorizontalBottom"];
  outputNames2.forEach((n) => {
    const output = session
      .getOutputByName(n)
      .find((o) => !o.format.includes("material"));
    const data = new InteractionData(
      { drag: true, select: true, hover: true },
      "myGroup2"
    );
    data.dragOrigin = [0, 0, 0];
    output!.node!.data.push(data);
    output!.node!.updateVersion();
  });

  const output = session
    .getOutputByName("Door")
    .find((o) => !o.format.includes("material"));
  const data = new InteractionData({ drag: true, select: true, hover: true });
  data.dragOrigin = [0, 0, 0];
  output!.node!.data.push(data);
  output!.node!.updateVersion();

  addListener(EVENTTYPE.INTERACTION.DRAG_END, (e) => {
    console.log(e);
  });

  const pointConstraint1 = new PointConstraint([0, -25, 0], 10);
  const token1 = dragManager.addDragConstraint(pointConstraint1);

  const pointConstraint2 = new PointConstraint([25, -25, 0], 10, {
    axis: vec3.fromValues(0, 0, 1),
    angle: -Math.PI / 2
  });
  const token2 = dragManager.addDragConstraint(pointConstraint2);

  const pointConstraint3 = new PointConstraint([-25, -25, 0], 10, {
    axis: vec3.fromValues(0, 0, 1),
    angle: Math.PI / 2
  });
  const token3 = dragManager.addDragConstraint(pointConstraint3);
})();
