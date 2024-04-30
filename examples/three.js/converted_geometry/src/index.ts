import {
  createViewport,
  createSession,
  GeometryData,
  ITreeNode
} from "@shapediver/viewer";

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

  // We read out the node that we want to clip
  const output = session
    .getOutputByName("Door")
    .find((o) => o.material !== undefined)!;

  // create a callback that is executed whenever the node changes
  const cb = (newNode?: ITreeNode) => {
    if (!newNode) return;
    // traverse all data that is in the scene tree below this node
    newNode.traverseData((d) => {
      // for every geometry data, log the three.js objects, which in this case is the Mesh
      if (d instanceof GeometryData) {
        console.log(d.threeJsObject[viewport.id]);
      }
    });
  };

  // assign the output callback and call it once
  output.updateCallback = cb;
  cb(output.node);
})();
