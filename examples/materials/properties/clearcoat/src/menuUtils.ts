import {
  MapData,
  MaterialStandardData,
  MaterialEngine,
  viewports,
  sceneTree
} from "@shapediver/viewer";

const materialEngine: MaterialEngine = MaterialEngine.instance;

/**
 * Create the menu for the material, assign the default values
 *
 * @param material
 */
export const createMaterialMenu = async (material: MaterialStandardData) => {
  // create an update callback for the material
  const updateMaterial = () => {
    material.updateVersion();
    sceneTree.root.updateVersion();
    viewports["myViewport"].update();
  };

  // set default values
  material.color = "#666";
  material.clearcoat = 1;
  material.clearcoatNormalMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_normal.png"
    )) || undefined;
  material.clearcoatRoughness = 1;
  material.clearcoatRoughnessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png"
    )) || undefined;

  material.metalness = 1;
  material.roughness = 0;
  updateMaterial();

  // create settings UI
  const materialPanel = (<any>window).QuickSettings.create(0, 0, "Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";

  materialPanel.addNumber("metalness", 0, 1, 1, 0.01, (value: number) => {
    material.metalness = value;
    updateMaterial();
  });

  materialPanel.addNumber("roughness", 0, 1, 0, 0.01, (value: number) => {
    material.roughness = value;
    updateMaterial();
  });

  materialPanel.addNumber("clearcoat", 0, 1, 1, 0.01, (value: number) => {
    material.clearcoat = value;
    updateMaterial();
  });

  let loadingUrl: string;
  // material input
  materialPanel.addText("clearcoatMap", "", async (value: string) => {
    let clearcoatMap: MapData | undefined;
    try {
      loadingUrl = value;
      clearcoatMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the clearcoatMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrl === value) {
        material.clearcoatMap = clearcoatMap;
        updateMaterial();
      }
    }
  });

  let loadingUrlM: string;
  // material input
  materialPanel.addText(
    "clearcoatNormalMap",
    "https://viewer.shapediver.com/v3/images/SD_normal.png",
    async (value: string) => {
      let clearcoatNormalMap: MapData | undefined;
      try {
        loadingUrlM = value;
        clearcoatNormalMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log(
          "An error occurred while loading the clearcoatNormalMap:",
          e
        );
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlM === value) {
          material.clearcoatNormalMap = clearcoatNormalMap;
          updateMaterial();
        }
      }
    }
  );

  materialPanel.addNumber(
    "clearcoatRoughness",
    0,
    1,
    1,
    0.01,
    (value: number) => {
      material.clearcoatRoughness = value;
      updateMaterial();
    }
  );

  let loadingUrlR: string;
  // material input
  materialPanel.addText(
    "clearcoatRoughnessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png",
    async (value: string) => {
      let clearcoatRoughnessMap: MapData | undefined;
      try {
        loadingUrlR = value;
        clearcoatRoughnessMap =
          (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log(
          "An error occurred while loading the clearcoatRoughnessMap:",
          e
        );
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlR === value) {
          material.clearcoatRoughnessMap = clearcoatRoughnessMap;
          updateMaterial();
        }
      }
    }
  );
};
