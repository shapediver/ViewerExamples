

import {
  createSession,
  createViewport,
  MaterialStandardData,
  VISIBILITY_MODE
} from "@shapediver/viewer";
import { overrideMaterial } from "./materialUtils";
import { initMaterials } from "./materialLib";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport",
    visibility: VISIBILITY_MODE.MANUAL
  });
  // create a session
  const session = await createSession({
    ticket:
      "359956cc5a7f61b3690d59df23b2e6b27f27121de2a550504d1155f4be077e500a304dc373815e87d56d2b9a4415814cf9e3752bae9ae175ba5af39b5a1a20c5832b8f31acff989ab0ecfffc30f8ad694c856b4d024aee1424c6698d9eb4c8db6d1da54a1685e4-183b051b9e4821cb18b838a02c5d763d",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a new material data
  const material = new MaterialStandardData();

  // override the materials
  overrideMaterial(session, "Primary", "PrimaryMaterial", material);
  overrideMaterial(session, "Secondary", "SecondaryMaterial", material);

  // set options for the material
  await initMaterials(material, viewport);

  // show the viewport once everything is loaded
  viewport.show = true;
  viewport.groundPlaneVisibility = true;
})();
