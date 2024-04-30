

import {
  createViewport,
  createSession,
  GeometryData,
  ITreeNode,
  MaterialUnlitData
} from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });

  // create a session
  const session = await createSession({
    ticket:
      "8568bfef4e211c5780128d7b61250c523948edfc37c5f63852054fd41790be2d95c261a6afb712675f054e4e99e3f78347fe81c8fc7313db94549e4ce575a819dc04ad29e4b68e574f644d67e48c23e906cb632f60757b6dea0a22844302129da240e53b6d9745-08f2da32a6e7ccfeae35fb9cf0aea219",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a new material data
  const material = new MaterialUnlitData({
    color: "#ff0000",
    envMap: "none"
  });

  const primaryOutput = session.getOutputByName("Primary")[0]!;

  // create a callback that updates the material whenever the output changes
  const updateCallback = (newNode?: ITreeNode, oldNode?: ITreeNode) => {
    if (!newNode) return;
    newNode.traverse((c) => {
      for (let i = 0; i < c.data.length; i++) {
        if (c.data[i] instanceof GeometryData) {
          (c.data[i] as GeometryData).material = material;
          (c.data[i] as GeometryData).updateVersion();
          c.updateVersion();
        }
      }
    });
  };
  // assign the callback to the output
  primaryOutput.updateCallback = updateCallback;
  // call the callback immediately for the current node
  updateCallback(primaryOutput.node!);
})();
