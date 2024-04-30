import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  const viewer = await SDV.createViewport({
    id: "myViewer",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "7d6061acf274727aff4710230595ff9e58fbd019a1e173ccd5f2342ecc697fd2397ab08cadc3014b2760f858d18b4aade0aade39fd73a5c1b44fef4d5a457739c1fe28ec6b44ef593a41f6c0cccc78fb3f62234080db167d60c23886b32c759068cdff6af5a8e3-853d465964df80e5db72abe9655cedee",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  console.log(
    await session.loadCachedOutputs({
      [Object.values(session.outputs)[0].id]: Object.values(session.outputs)[0]
        .version,
      [Object.values(session.outputs)[1].id]: "invalid version" // returns undefined for this version
    })
  );
})();
