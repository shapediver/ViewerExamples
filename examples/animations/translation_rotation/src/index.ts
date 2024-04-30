

import {
  AnimationData,
  createSession,
  createViewport,
  IAnimationTrack
} from "@shapediver/viewer";
import { quat, vec3 } from "gl-matrix";

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

  const doorOutput = session.getOutputByName("Door").find((o) => !!o.material);
  const doorNode = session.node.children.find(
    (c) => c.name === doorOutput!.id
  )!;

  const quat0 = quat.create();
  const quat1 = quat.setAxisAngle(
    quat.create(),
    vec3.fromValues(0, 0, 1),
    Math.PI
  );
  const tracks1: IAnimationTrack[] = [
    {
      times: [0, 2.5, 7.5, 10],
      node: doorNode,
      values: [0, 0, 0, 14.5, 0, 0, 14.5, 0, 0, 0, 0, 0],
      path: "translation",
      interpolation: "linear"
    },
    {
      times: [0, 2.5, 5, 7.5],
      node: doorNode,
      values: [
        quat0[0],
        quat0[1],
        quat0[2],
        quat0[3],
        quat0[0],
        quat0[1],
        quat0[2],
        quat0[3],
        quat1[0],
        quat1[1],
        quat1[2],
        quat1[3],
        quat0[0],
        quat0[1],
        quat0[2],
        quat0[3]
      ],
      path: "rotation",
      interpolation: "linear"
    }
  ];
  const data1 = new AnimationData("myAnimation", tracks1, 0, 10);

  session.node.data.push(data1);
  data1.repeat = true;
  data1.startAnimation();
  viewport.update();
})();
