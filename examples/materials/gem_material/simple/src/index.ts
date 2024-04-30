import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

let session: SDV.ISessionApi;
let viewport: SDV.IViewportApi;

(async () => {
  viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  session = await SDV.createSession({
    id: "mySession",
    ticket:
      "ea66dc0152131834e00b9afdace2c5f455b5eb930a69f71c3a0b25da8c9326e70f2a8b5a87e177c7ded8803375c8101b313e49b5ddba74100b9097a8598355a804e0454747e0b4d3b339078b7d6a29c9fc48e4be2bb79833c3106dcfabd5fd9ebb8fc1d5348ea7-e014782bb8b8d7cc01ed94600b2342e6",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  // we create an update callback that is assigned to the outputs below
  const updateCallback = (newNode?: SDV.ITreeNode) => {
    if (!newNode) return;
    // we assign the material material
    newNode.traverseData((d) => {
      if (d instanceof SDV.GeometryData) {
        (<SDV.GeometryData>d).material = new SDV.MaterialGemData({
          envMap: viewport.environmentMap,
          refractionIndex: 2.4,
          impurityMap: undefined,
          impurityScale: 0,
          colorTransferBegin: "#ffffff",
          colorTransferEnd: "#ffffff",
          gamma: 1,
          contrast: 2,
          brightness: 0,
          dispersion: 0.3,
          tracingDepth: 4,
          tracingOpacity: 0.8
        });
      }
    });

    // and update to see the changes
    newNode.updateVersion();
    viewport.update();
  };

  const outputNames = ["SmallSideDiamonds", "BigSideDiamonds", "BigDiamond"];

  for (let i = 0; i < outputNames.length; i++) {
    const output = session
      .getOutputByName(outputNames[i])
      .find((o) => !o.format.includes("material"))!;

    // We assign an update callback. This is executed whenever the node is internally adapted.
    output.updateCallback = updateCallback;
    // we call this update callback once, to see our applied changes
    updateCallback(output.node);
  }
})();
