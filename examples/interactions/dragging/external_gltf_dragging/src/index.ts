import {
  createSession,
  createViewport,
  DataEngine,
  MaterialStandardData,
  sceneTree
} from "@shapediver/viewer";
import {
  CameraPlaneConstraint,
  InteractionData,
  InteractionEngine,
  DragManager,
  HoverManager
} from "@shapediver/viewer.features.interaction";
import { mat4, vec3 } from "gl-matrix";

const dataEngine: DataEngine = DataEngine.instance;

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });

  let session = await createSession({
    ticket:
      "5dbb5117b630fb83a8056f06ee719f570a904be69ac45152822c327f33d21483a8dae9e3122ae17c992ea6b3e2b65af09ac9871dd83a263ef488e58b2c2260a07899418548bd4a8dcf1cff3ca33954c9e4c0fe60118f730d03c56b7e598eab908b34e16ba8625d-b5ac96869614191d8ada6725aba8fba6",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the dragManager and add it
  const dragManager = new DragManager();
  dragManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });
  interactionEngine.addInteractionManager(dragManager);

  // create the hoverManager and add it
  const hoverManager = new HoverManager();
  hoverManager.effectMaterial = new MaterialStandardData({ color: "#0000ff" });
  interactionEngine.addInteractionManager(hoverManager);

  const node = await dataEngine.loadContent({
    format: "gltf", // for gltf 2 we use `gltf`, for gltf 1 we use `glb` as a format
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf"
  });
  sceneTree.addNode(node);
  node.transformations.push({
    id: "transformation",
    matrix: mat4.mul(
      mat4.create(),
      mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 5, 12)),
      mat4.fromScaling(mat4.create(), vec3.fromValues(5, 5, 5))
    )
  });

  // add the interaction data to the session outputs
  const interactionData = new InteractionData({ drag: true, hover: true });
  interactionData.dragOrigin = vec3.fromValues(0, 0, 0);
  node.data.push(interactionData);

  // add a camera plane constraint
  const cameraPlaneConstraint = new CameraPlaneConstraint();
  // use the token to remove the constraint again (removeDragConstraint)
  const token = dragManager.addDragConstraint(cameraPlaneConstraint);

  sceneTree.root.updateVersion();
  viewport.update();
})();
