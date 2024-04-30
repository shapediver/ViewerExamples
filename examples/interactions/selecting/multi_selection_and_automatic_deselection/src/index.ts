

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  GeometryData,
  MaterialStandardData,
  PrimitiveData
} from "@shapediver/viewer";
import {
  IMultiSelectEvent,
  InteractionData,
  InteractionEngine,
  MultiSelectManager
} from "@shapediver/viewer.features.interaction";
import { vec3 } from "gl-matrix";

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
  const selectManger = new MultiSelectManager();
  interactionEngine.addInteractionManager(selectManger);

  selectManger.effectMaterial = new MaterialStandardData({ color: "#ff0000" });

  for (let i = 0; i < session.node.children.length; i++) {
    session.node.children[i].data.push(new InteractionData({ select: true }));
    session.node.children[i].updateVersion();
  }

  // event listener for SELECT_ON
  addListener(EVENTTYPE.INTERACTION.SELECT_ON, (e) => {
    const node = (<IMultiSelectEvent>e).node;
    console.log(node);
    const output = session.outputs[node.name];
    console.log(output);

    // manual deselection after 5 seconds
    setTimeout(() => {
      selectManger.deselect(node);
    }, 5000);
  });

  // manually select a node
  // as we manually select a node the point of intersection and distance can be specified as you want,
  // it will be forwarded into the event listener like any other interaction
  selectManger.select({
    point: vec3.create(),
    distance: 0,
    node: session.getOutputByName("Door")[0].node!
  });
})();
