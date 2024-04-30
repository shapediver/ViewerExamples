

import {
  createSession,
  createViewport,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  CameraPlaneConstraint,
  DragManager,
  HoverManager,
  InteractionData,
  InteractionEngine,
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

  // add the interaction data to the session outputs
  for (let i = 0; i < session.node.children.length; i++) {
    session.node.children[i].data.push(new InteractionData({ drag: true }));
    session.node.children[i].updateVersion();
  }

  // add a camera plane constraint
  const cameraPlaneConstraint = new CameraPlaneConstraint();
  // use the token to remove the constraint again (removeDragConstraint)
  const token = dragManager.addDragConstraint(cameraPlaneConstraint);
})();
