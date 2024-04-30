

import { createViewport, createSession } from "@shapediver/viewer";

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

  // "getOutputByName" returns an array with all outputs that have the desired name
  // the find functions searches for outputs where the format of the content is "material"
  const doorMaterialOutput = session
    .getOutputByName("Door")
    .find((o) => o.material === undefined)!;

  await doorMaterialOutput.updateOutputContent([
    {
      format: "material",
      data: {
        color: [255, 200, 20, 255],
        materialpreset: 511,
        version: "1.0"
      }
    }
  ]);

  // if the freeze option is enable, the output will not be updated anymore
  // neither via server updates or manual ones
  // set freeze to false to be able to update the output again
  doorMaterialOutput.freeze = true;
})();
