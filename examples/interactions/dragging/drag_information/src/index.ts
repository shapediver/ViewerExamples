

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
  IDragEvent,
  InteractionData,
  InteractionEngine,
  LineConstraint,
  PlaneConstraint,
  PointConstraint,
  SelectManager
} from "@shapediver/viewer.features.interaction";

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
  interactionEngine.addInteractionManager(dragManager);

  // add the interaction data to the session
  const interactionData = new InteractionData({ drag: true });
  // add a few drag anchors for testing
  interactionData.dragAnchors = [
    { position: [15, 15, 0] },
    { position: [-15, -15, 0] }
  ];
  session.node.data.push(interactionData);
  session.node.updateVersion();

  // add a camera plane constraint
  dragManager.addDragConstraint(new PointConstraint([20, 20, 0], 2));
  dragManager.addDragConstraint(new PointConstraint([-20, 20, 0], 2));
  dragManager.addDragConstraint(
    new LineConstraint([20, 20, 0], [20, -20, 0], 10)
  );
  dragManager.addDragConstraint(
    new LineConstraint([-20, 20, 0], [-20, -20, 0], 10)
  );

  addListener(EVENTTYPE.INTERACTION.DRAG_END, (e) => {
    const interactionEvent = e as IDragEvent;
    console.log(interactionEvent.dragAnchor);
    console.log(interactionEvent.dragConstraint);
  });
})();
