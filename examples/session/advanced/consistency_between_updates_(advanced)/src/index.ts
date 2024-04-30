

import { createSession, createViewport, ITreeNode } from "@shapediver/viewer";
import { HTMLElementAnchorTextData } from "@shapediver/viewer.shared.types";

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

  const doorOutput = session
    .getOutputByName("Door")
    .find((o) => o.material !== undefined)!;

  const callback = (newNode?: ITreeNode, oldNode?: ITreeNode) => {
    if (!newNode) return;

    // here event listeners could be removed / added
    newNode.data.push(
      new HTMLElementAnchorTextData({
        location: [
          (doorOutput.bbmax![0] + doorOutput.bbmin![0]) / 2.0,
          doorOutput.bbmin![1] - 1,
          (doorOutput.bbmax![2] + doorOutput.bbmin![2]) / 2.0
        ],
        data: {
          text: "test",
          color: "#ff0000"
        }
      })
    );
    newNode.updateVersion();
  };

  // initial call, the second node does not matter in our example
  callback(doorOutput.node!, doorOutput.node!);
  doorOutput.node!.updateVersion();
  viewport.update();

  // by setting this callback the new anchor for the door will be created every time the node updates
  doorOutput.updateCallback = callback;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  session.getParameterByName("Length")[0].value = 6;
  await session.customize();
})();
