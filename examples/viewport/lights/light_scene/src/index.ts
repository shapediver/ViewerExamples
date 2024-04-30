

import { createSession, createViewport } from "@shapediver/viewer";

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

  // create a light scene, it will be assigned automatically
  const lightScene = viewport.createLightScene()!;

  // add a new ambient light, it will be added to the current light scene
  const ambientLight = lightScene.addAmbientLight({ color: "#ff0000" });

  // add a new directional light, it will be added to the current light scene
  const directionalLight = lightScene.addDirectionalLight({
    color: "#00ff00",
    castShadow: true
  });
})();
