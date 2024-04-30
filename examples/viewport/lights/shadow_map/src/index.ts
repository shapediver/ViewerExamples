

import {
  createViewport,
  createSession,
  LIGHT_TYPE,
  IDirectionalLightApi
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

  const lightScene = viewport.lightScene!;
  // we search for the lights that are directional and have shadows
  const lightsWithShadows: IDirectionalLightApi[] = <IDirectionalLightApi[]>(
    Object.values(lightScene.lights).filter(
      (l) =>
        l.type === LIGHT_TYPE.DIRECTIONAL &&
        (<IDirectionalLightApi>l).castShadow === true
    )
  );

  for (let i = 0; i < lightsWithShadows.length; i++) {
    // changing the shadow map resolution increases the qualtiy, but lowers the performance
    // has to be power of two (default: 1024)
    lightsWithShadows[i].shadowMapResolution = 2048;
    // the shadow map bias is responsible for the offset of the shadow map
    // if this would be 0, the object would cast a shadow on itself
    lightsWithShadows[i].shadowMapBias = -0.003;
  }
})();
