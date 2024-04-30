import {
  createSession,
  createViewport,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  DragManager,
  InteractionData,
  InteractionEngine,
  HoverManager,
  PointConstraint
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

  // setup drag manager with point constraint
  const pointConstraint = new PointConstraint([0, -25, 0], 25);
  const dragManager = new DragManager();
  dragManager.addDragConstraint(pointConstraint);

  // setup interaction manager and assign drag manager
  const interactionEngine = new InteractionEngine(viewport);
  interactionEngine.addInteractionManager(dragManager);

  const hoverManager = new HoverManager();
  interactionEngine.addInteractionManager(hoverManager);
  hoverManager.effectMaterial = new MaterialStandardData();

  // create interaction data for target node and add drag anchor
  const interactionData = new InteractionData({ drag: true, hover: true });
  interactionData.dragAnchors.push({
    position: [0, 0, 0]
  });

  const doorOutput = session
    .getOutputByName("Door")
    .find((o) => o.material !== undefined)!;
  doorOutput.node!.data.push(interactionData);
  doorOutput.node!.updateVersion();
})();
