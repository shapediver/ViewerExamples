

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  MaterialStandardData,
  ThreejsData
} from "@shapediver/viewer";
import {
  InteractionData,
  InteractionEngine,
  ISelectEvent,
  SelectManager
} from "@shapediver/viewer.features.interaction";
import * as THREE from "three";

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
    const selectEvent = e as ISelectEvent;

    if (selectEvent.intersectionPoint === undefined) return;

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      selectEvent.intersectionPoint[0],
      selectEvent.intersectionPoint[1],
      selectEvent.intersectionPoint[2]
    );

    const node = selectEvent.node;
    node.addData(new ThreejsData(sphere));
    node.updateVersion();
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the selectionManager and add it
  const selectManger = new SelectManager();
  interactionEngine.addInteractionManager(selectManger);

  selectManger.effectMaterial = new MaterialStandardData({ color: "#ff0000" });

  for (let i = 0; i < session.node.children.length; i++) {
    session.node.children[i].data.push(new InteractionData({ select: true }));
    session.node.children[i].updateVersion();
  }
})();
