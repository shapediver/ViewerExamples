

import {
  createViewport,
  createSession,
  ITreeNode,
  sceneTree
} from "@shapediver/viewer";

(async () => {
  const viewport = await createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await createSession({
    id: "mySession",
    ticket:
      "436f71c116379fa4afffebef5d2f08e8815cb1c0e60ecf5402d743db4b947fa4a73d3d133912af11fcf54bb504c072f9776db8a886ad169035bb9133137e109ce4aea160629b0393251d22d4162317e3acc8e9d39ad8d57037c97b16f87d21a30ce706ee5a9c55-f245c0b5a314f6859406b74b0b432944",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  const addNodeToScene = (n: ITreeNode) => {
    sceneTree.root.addChild(n);
    sceneTree.root.updateVersion();
    viewport.update();
  };
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "2" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "3" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "4" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "5" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "6" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "7" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "8" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "9" })
    .then(addNodeToScene);
  session
    .customizeParallel({ "de76cade-0cea-47b1-879e-1a0b717910e1": "10" })
    .then(addNodeToScene);
})();
