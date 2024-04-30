

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  ITreeNode,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  InteractionData,
  InteractionEngine,
  SelectManager,
  ISelectEvent,
  IHoverEvent,
  HoverManager
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

  // event listener for SELECT_ON
  addListener(EVENTTYPE.INTERACTION.SELECT_ON, (e) => {
    console.log("SELECT_ON");
    const node = (<ISelectEvent>e).node;
    console.log(node);
    const output = session.outputs[node.name];
    console.log(output);
  });

  // event listener for HOVER_ON
  addListener(EVENTTYPE.INTERACTION.HOVER_ON, (e) => {
    console.log("HOVER_ON");
    const node = (<IHoverEvent>e).node;
    console.log(node);
    const output = session.outputs[node.name];
    console.log(output);
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the selectionManager and add it
  const selectManger = new SelectManager();
  interactionEngine.addInteractionManager(selectManger);
  selectManger.effectMaterial = new MaterialStandardData({ color: "#ff0000" });

  // create the hoverManager and add it
  const hoverManager = new HoverManager();
  interactionEngine.addInteractionManager(hoverManager);
  hoverManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });

  // assign InteractionData to all outputs, and re-assign once they get updated
  for (let o in session.outputs) {
    const output = session.outputs[o];

    // the updateCallback is called whenever the output is updated
    output.updateCallback = (newNode?: ITreeNode, oldNode?: ITreeNode) => {
      if (!newNode) return;
      newNode.data.push(new InteractionData({ select: true, hover: true }));
      newNode.updateVersion();
    };

    // we call it manually once in the beginning to apply the changes
    output.updateCallback(output.node);
  }
})();
