import * as THREE from "three";
import {
  EVENTTYPE,
  createViewport,
  createSession,
  AnimationData,
  IAnimationTrack,
  sceneTree,
  GeometryData,
  addListener
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

  // local clipping planes currently don't work with ambient occlusion
  // global clipping planes work even with ambient occlusion, please see here: https://codesandbox.io/s/ufxn4o
  const tokens = viewport.postProcessing.getEffectTokens();
  for (const e in tokens)
    if (tokens[e] === "ssao" || tokens[e] === "hbao")
      viewport.postProcessing.removeEffect(e);

  // We create a clipping plane
  // The normal direction determines which side gets clipped
  const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

  // We read out the node that we want to clip
  const output = session
    .getOutputByName("Door")
    .find((o) => o.material !== undefined)!;

  // Whenever the viewport has been updated we add the clipping plane
  addListener(EVENTTYPE.VIEWPORT.VIEWPORT_UPDATED, () => {
    output.node?.traverseData((d) => {
      if (d instanceof GeometryData) {
        ((d.convertedObject[viewport.id] as THREE.Mesh)
          .material as THREE.Material).clippingPlanes = [clippingPlane];
        ((d.convertedObject[viewport.id] as THREE.Mesh)
          .material as THREE.Material).clipShadows = true;
      }
    });
  });

  // To visualize the effect, we add an animation to the scene
  const tracks: IAnimationTrack[] = [];
  tracks.push({
    times: [0, 4, 8],
    node: output.node!,
    values: [0, 0, 0, 14.5, 0, 0, 0, 0, 0],
    path: "translation",
    interpolation: "linear"
  });

  // we create the animation data
  const animationData = new AnimationData("animation", tracks, 0, 8);
  animationData.repeat = true;
  animationData.startAnimation();

  // and add it to the scene
  sceneTree.root.addData(animationData);
  sceneTree.root.updateVersion();
})();
