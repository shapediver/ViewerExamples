

import {
  createSession,
  createViewport,
  MaterialStandardData,
  MATERIAL_ALPHA,
  MATERIAL_SHADING,
  MATERIAL_SIDE,
  VISIBILITY_MODE
} from "@shapediver/viewer";
import { createMaps, getSessionGeometry } from "./utils";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewer",
    visibility: VISIBILITY_MODE.MANUAL
  });
  // create a session
  const session = await createSession({
    ticket:
      "e9089e11ee789e8d52915e9cb6561a16cd07d2f79199d5c2102f799a76de11cbb4e042f9ac8121b833c66e29eabe903dbabcb4cba5117d6a2746f57207e2a2641e76a0539bed93d8ae609b0e8bcb95ecdd3f3a82bc7216164a6874eb8e45dba7e237957f440a96-7713ed530eb3149ee88a38352b2bd8ed",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // get geometry
  const geometries = getSessionGeometry(session);

  // create and assign material
  const material = new MaterialStandardData();
  geometries.forEach((g) => (g.material = material));

  // create update callback
  const updateCallback = () => {
    material.updateVersion();
    session.node.updateVersion();
    viewport.update();
  };

  // create all maps
  const {
    colorMap,
    normalMap,
    grayScaleMap,
    grayScaleInverseMap,
    grayScaleAlphaMap,
    logoMap
  } = await createMaps();

  // show scene
  viewport.show = true;

  /**
   *
   * This example: all properties
   *
   */

  // create settings UI
  const materialPanel = (<any>window).QuickSettings.create(0, 0, "Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";

  material.alphaMap = undefined;
  materialPanel.addBoolean("alphaMap", false, (value: boolean) => {
    material.alphaMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.alphaCutoff = 0;
  materialPanel.addNumber("alphaCutoff", 0, 1, 0, 0.01, (value: number) => {
    material.alphaCutoff = value;
    updateCallback();
  });

  material.alphaMode = MATERIAL_ALPHA.OPAQUE;
  materialPanel.addDropDown(
    "alphaMode",
    [MATERIAL_ALPHA.OPAQUE, MATERIAL_ALPHA.BLEND, MATERIAL_ALPHA.MASK],
    (value: MATERIAL_ALPHA) => {
      material.alphaMode = value;
      updateCallback();
    }
  );

  material.aoMap = undefined;
  materialPanel.addBoolean("aoMap", false, (value: boolean) => {
    material.aoMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.aoMapIntensity = 1;
  materialPanel.addNumber("aoMapIntensity", 0, 1, 1, 0.01, (value: number) => {
    material.aoMapIntensity = value;
    updateCallback();
  });

  material.attenuationColor = "#ffffff";
  materialPanel.addText("attenuationColor", "#ffffff", (value: string) => {
    material.attenuationColor = value;
    updateCallback();
  });

  material.attenuationDistance = 0;
  materialPanel.addNumber(
    "attenuationDistance",
    0,
    1,
    0,
    0.01,
    (value: number) => {
      material.attenuationDistance = value;
      updateCallback();
    }
  );

  material.bumpMap = undefined;
  materialPanel.addBoolean("bumpMap", false, (value: boolean) => {
    material.bumpMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.bumpScale = 0;
  materialPanel.addNumber("bumpScale", 0, 1, 0, 0.01, (value: number) => {
    material.bumpScale = value;
    updateCallback();
  });

  material.clearcoat = 0;
  materialPanel.addNumber("clearcoat", 0, 1, 0, 0.01, (value: number) => {
    material.clearcoat = value;
    updateCallback();
  });

  material.clearcoatMap = undefined;
  materialPanel.addBoolean("clearcoatMap", false, (value: boolean) => {
    material.clearcoatMap = value ? colorMap : undefined;
    updateCallback();
  });

  material.clearcoatNormalMap = undefined;
  materialPanel.addBoolean("clearcoatNormalMap", false, (value: boolean) => {
    material.clearcoatNormalMap = value ? normalMap : undefined;
    updateCallback();
  });

  material.clearcoatRoughness = 0;
  materialPanel.addNumber(
    "clearcoatRoughness",
    0,
    1,
    0,
    0.01,
    (value: number) => {
      material.clearcoatRoughness = value;
      updateCallback();
    }
  );

  material.clearcoatRoughnessMap = undefined;
  materialPanel.addBoolean("clearcoatRoughnessMap", false, (value: boolean) => {
    material.clearcoatRoughnessMap = value ? grayScaleInverseMap : undefined;
    updateCallback();
  });

  material.color = "#666666";
  materialPanel.addText("color", "#666666", (value: string) => {
    material.color = value;
    updateCallback();
  });

  material.emissiveMap = undefined;
  materialPanel.addBoolean("emissiveMap", false, (value: boolean) => {
    material.emissiveMap = value ? logoMap : undefined;
    updateCallback();
  });

  material.emissiveness = "#000000";
  materialPanel.addText("emissiveness", "#000000", (value: string) => {
    material.emissiveness = value;
    updateCallback();
  });

  material.ior = 1.5;
  materialPanel.addNumber("ior", 0, 4, 1.5, 0.01, (value: number) => {
    material.ior = value;
    updateCallback();
  });

  material.map = undefined;
  materialPanel.addBoolean("map", false, (value: boolean) => {
    material.map = value ? colorMap : undefined;
    updateCallback();
  });

  material.metalness = 1;
  materialPanel.addNumber("metalness", 0, 1, 1, 0.01, (value: number) => {
    material.metalness = value;
    updateCallback();
  });

  material.metalnessMap = undefined;
  materialPanel.addBoolean("metalnessMap", false, (value: boolean) => {
    material.metalnessMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.metalnessRoughnessMap = undefined;
  materialPanel.addBoolean("metalnessRoughnessMap", false, (value: boolean) => {
    material.metalnessRoughnessMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.normalMap = undefined;
  materialPanel.addBoolean("normalMap", false, (value: boolean) => {
    material.normalMap = value ? normalMap : undefined;
    updateCallback();
  });

  material.normalScale = 1.0;
  materialPanel.addNumber("normalScale", 0, 1, 1, 0.01, (value: number) => {
    material.normalScale = value;
    updateCallback();
  });

  material.opacity = 1.0;
  materialPanel.addNumber("opacity", 0, 1, 1, 0.01, (value: number) => {
    material.opacity = value;
    updateCallback();
  });

  material.roughness = 1.0;
  materialPanel.addNumber("roughness", 0, 1, 1, 0.01, (value: number) => {
    material.roughness = value;
    updateCallback();
  });

  material.roughnessMap = undefined;
  materialPanel.addBoolean("roughnessMap", false, (value: boolean) => {
    material.roughnessMap = value ? grayScaleInverseMap : undefined;
    updateCallback();
  });

  material.shading = MATERIAL_SHADING.SMOOTH;
  materialPanel.addDropDown(
    "shading",
    [MATERIAL_SHADING.SMOOTH, MATERIAL_SHADING.FLAT],
    (value: MATERIAL_SHADING) => {
      material.shading = value;
      updateCallback();
    }
  );

  material.sheen = 0;
  materialPanel.addNumber("sheen", 0, 1, 0, 0.01, (value: number) => {
    material.sheen = value;
    updateCallback();
  });

  material.sheenColor = "#ffffff";
  materialPanel.addText("sheenColor", "#ffffff", (value: string) => {
    material.sheenColor = value;
    updateCallback();
  });

  material.sheenColorMap = undefined;
  materialPanel.addBoolean("sheenColorMap", false, (value: boolean) => {
    material.sheenColorMap = value ? colorMap : undefined;
    updateCallback();
  });

  material.sheenRoughness = 1;
  materialPanel.addNumber("sheenRoughness", 0, 1, 1, 0.01, (value: number) => {
    material.sheenRoughness = value;
    updateCallback();
  });

  material.sheenRoughnessMap = undefined;
  materialPanel.addBoolean("sheenRoughnessMap", false, (value: boolean) => {
    material.sheenRoughnessMap = value ? grayScaleAlphaMap : undefined;
    updateCallback();
  });

  material.side = MATERIAL_SIDE.DOUBLE;
  materialPanel.addDropDown(
    "side",
    [MATERIAL_SIDE.DOUBLE, MATERIAL_SIDE.FRONT, MATERIAL_SIDE.BACK],
    (value: MATERIAL_SIDE) => {
      material.side = value;
      updateCallback();
    }
  );

  material.specularColor = "#ffffff";
  materialPanel.addText("specularColor", "#ffffff", (value: string) => {
    material.specularColor = value;
    updateCallback();
  });

  material.specularColorMap = undefined;
  materialPanel.addBoolean("specularColorMap", false, (value: boolean) => {
    material.specularColorMap = value ? colorMap : undefined;
    updateCallback();
  });

  material.specularIntensity = 1;
  materialPanel.addNumber(
    "specularIntensity",
    0,
    1,
    1,
    0.01,
    (value: number) => {
      material.specularIntensity = value;
      updateCallback();
    }
  );

  material.specularIntensityMap = undefined;
  materialPanel.addBoolean("specularIntensityMap", false, (value: boolean) => {
    material.specularIntensityMap = value ? grayScaleAlphaMap : undefined;
    updateCallback();
  });

  material.thickness = 0;
  materialPanel.addNumber(
    "thickness",
    0,
    Infinity,
    0,
    0.01,
    (value: number) => {
      material.thickness = value;
      updateCallback();
    }
  );

  material.thicknessMap = undefined;
  materialPanel.addBoolean("thicknessMap", false, (value: boolean) => {
    material.thicknessMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  material.transmission = 0;
  materialPanel.addNumber("transmission", 0, 1, 0, 0.01, (value: number) => {
    material.transmission = value;
    updateCallback();
  });

  material.transmissionMap = undefined;
  materialPanel.addBoolean("transmissionMap", false, (value: boolean) => {
    material.transmissionMap = value ? grayScaleMap : undefined;
    updateCallback();
  });

  updateCallback();
})();
