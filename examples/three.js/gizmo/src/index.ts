

import {
  createViewport,
  createSession,
  IFileParameterApi,
  FLAG_TYPE,
  ITransformation
} from "@shapediver/viewer";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { vec3, mat4 } from "gl-matrix";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "c69f63675005e5ab1ae445e6ceb87ec4aabd45902b2af2bc7ace7edaeb369124e5925df416c5f40dc4014cc328a548ad13d0131efffa10ef85cdd4531a373aefe96edc746a4508c15df88d23395da5479aa23884f2cafbbabff110d4071a748da12c5a2fb63b4a-641f296d59b353ab1efc90c24fad7d88",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // As the gizmo currently does not work with the post processing effects, we remove them here
  Object.keys(viewport.postProcessing.getEffectTokens()).forEach((token) => {
    viewport.postProcessing.removeEffect(token);
  });

  // get the output that we want to transform
  const imagePlaneOutput = session.getOutputByName("Image Plane")[0];

  // create a Object3D as a place holder and set the position to the bounding box center
  const transformationPlaceholder = new THREE.Object3D();
  const imagePlaneOffset = vec3.clone(
    imagePlaneOutput.node!.boundingBox.boundingSphere.center
  );
  transformationPlaceholder.position.set(
    imagePlaneOffset[0],
    imagePlaneOffset[1],
    imagePlaneOffset[2]
  );

  // create the transform controls
  const control = new TransformControls(
    viewport.threeJsCoreObjects.camera,
    viewport.threeJsCoreObjects.renderer.domElement
  );

  // create the Object3D structure and add it to the scene
  const parentObject = new THREE.Object3D();
  control.attach(transformationPlaceholder);
  parentObject.add(control);
  parentObject.add(transformationPlaceholder);
  viewport.threeJsCoreObjects.scene.add(parentObject);

  // in the "change" event listener we read out the matrix from the placeholder and apply it to the output node
  control.addEventListener("change", (e) => {
    const matrix = mat4.fromValues(
      ...transformationPlaceholder.matrix.toArray()
    );

    // we reset the offset here to not apply it two times
    mat4.translate(
      matrix,
      matrix,
      vec3.negate(vec3.create(), imagePlaneOffset)
    );

    const index = imagePlaneOutput.node!.transformations.findIndex(
      (t: ITransformation) => t.id === "SD_gizmo_matrix"
    );
    if (index !== -1) {
      imagePlaneOutput.node!.transformations[index].matrix = matrix;
    } else {
      imagePlaneOutput.node!.addTransformation({
        id: "SD_gizmo_matrix",
        matrix
      });
    }

    viewport.updateNode(imagePlaneOutput.node!);
  });

  // we register the CAMERA_FREEZE whenever the dragging happens
  let cameraFreeze: string;
  control.addEventListener("dragging-changed", function (event) {
    if (event.value === true) {
      cameraFreeze = viewport.addFlag(FLAG_TYPE.CAMERA_FREEZE);
    } else {
      viewport.removeFlag(cameraFreeze);
    }
  });

  // register the CONTINUOUS_RENDERING to continuously render the scene
  const tokenContinuousRendering = viewport.addFlag(
    FLAG_TYPE.CONTINUOUS_RENDERING
  );
  // register the CONTINUOUS_SHADOW_MAP_UPDATE to continuously update the shadows
  const tokenContinuousShadowMapUpdate = viewport.addFlag(
    FLAG_TYPE.CONTINUOUS_SHADOW_MAP_UPDATE
  );
})();
