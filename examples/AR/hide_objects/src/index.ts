

import { createViewport, createSession, FLAG_TYPE } from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });

  // create a session
  const session = await createSession({
    ticket:
      "38062998cb03bddc76861546b34a450bffc3efbfac6ff2d33f061bd11343930174b39192925364dfb71f8b944d5952f7ee6b970d56ab21d3e175a1314332e4250f77f2f2b4a5f068e52f336f1bb9dce57c58bc51db75edb668d5fb1692aa523a744ca32b86f670-9929a50d1d9e437754c61e5613e7a631",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // check if this device is capable and load either AR or the QR code
  (<any>window).loadAR = async () => {
    const token = viewport.addFlag(FLAG_TYPE.BUSY_MODE);

    // hide an output by settings the visibility to false
    // there is no need to update the viewport or the version of the node
    // as in the gltf conversion for AR the current values are read out
    session.getOutputByName("Shelf")[0].node!.visible = false;

    if (viewport.viewableInAR()) {
      await viewport.viewInAR();
    } else {
      const qr = await viewport.createArSessionLink(undefined, true);
      const image = new Image();
      image.src = qr;
      image.style.position = "absolute";
      image.style.bottom = "0%";
      document.body.appendChild(image);
    }

    // after the AR creation is done, the node can be made visible again
    session.getOutputByName("Shelf")[0].node!.visible = true;

    viewport.removeFlag(token);
  };
})();
