import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  SDV.addListener(SDV.EVENTTYPE_OUTPUT.OUTPUT_UPDATED, (e) => {
    const outputEvent = e as SDV.IOutputEvent;
    const outputApi = session.getOutputById(outputEvent.outputId)!;
    if (outputApi.name === "HorizontalTop" && outputEvent.newNode) {
      outputEvent.newNode.traverseData((d) => {
        if (d instanceof SDV.GeometryData)
          (d as SDV.GeometryData).material!.color = "blue";
      });
    }
  });

  const viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "7d6061acf274727aff4710230595ff9e58fbd019a1e173ccd5f2342ecc697fd2397ab08cadc3014b2760f858d18b4aade0aade39fd73a5c1b44fef4d5a457739c1fe28ec6b44ef593a41f6c0cccc78fb3f62234080db167d60c23886b32c759068cdff6af5a8e3-853d465964df80e5db72abe9655cedee",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    waitForOutputs: false
  });

  const doorOutput = session
    .getOutputByName("Door")
    .find((o) => !o.format.includes("material"))!;
  doorOutput.updateCallback = async (newNode?: SDV.ITreeNode) => {
    if (newNode) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newNode.traverseData((d) => {
        if (d instanceof SDV.GeometryData)
          (d as SDV.GeometryData).material!.color = "red";
      });
    }
  };
})();
