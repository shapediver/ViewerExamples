

import { createMaterialMenu } from "./menuUtils";
import { overrideOutputMaterial } from "./materialUtils";
import {
  createSession,
  createViewport,
  MaterialStandardData,
  VISIBILITY_MODE
} from "@shapediver/viewer";

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
      "4a8cede191448f5e3416693175fa487b08696f0c793e0fc4f2374b5b5563e25c319a002de355ecd3bd147f32459f70cc48d19248b35e3d95ab4fc7dc29c190b6b7d9f60bf87ca18d580d932d5049c59168afe89b517820974e3ac26a820f0b9416c95f8533f17f-05d34dc6a6ba594ac480462392f7c3b0",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a new material data
  const material = new MaterialStandardData();

  // override the materials
  await overrideOutputMaterial(session, "Primary", material);
  await overrideOutputMaterial(session, "Secondary", material);

  // create the material menu
  await createMaterialMenu(material);

  // show the viewport once everything is loaded
  viewport.show = true;
})();
