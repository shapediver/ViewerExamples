

import {
  createSession,
  createViewport,
  MaterialStandardData
} from "@shapediver/viewer";
import {
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

  // create the selectionManager and add it
  const selectManger = new SelectManager();
  selectManger.effectMaterial = new MaterialStandardData({ color: "#ffff00" });
  interactionEngine.addInteractionManager(selectManger);

  session.node.data.push(new InteractionData({ select: true }));
  session.node.updateVersion();
})();
