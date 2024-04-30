import {
  MaterialEngine,
  MaterialStandardData,
  MapData,
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
  material.metalness = 1;
  material.roughness = 1.0;
  material.metalnessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale.png"
    )) || undefined;

  material.roughnessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png"
    )) || undefined;
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

  materialPanel.addNumber("roughness", 0, 1, 1, 0.01, (value: number) => {
    material.roughness = value;
    updateMaterial();
  });

  let loadingUrlM: string;
  // material input
  materialPanel.addText(
    "metalnessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale.png",
    async (value: string) => {
      let metalnessMap: MapData | undefined;
      try {
        loadingUrlM = value;
        metalnessMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the metalnessMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlM === value) {
          material.metalnessMap = metalnessMap;
          updateMaterial();
        }
      }
    }
  );

  let loadingUrlR: string;
  // material input
  materialPanel.addText(
    "roughnessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png",
    async (value: string) => {
      let roughnessMap: MapData | undefined;
      try {
        loadingUrlR = value;
        roughnessMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the roughnessMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlR === value) {
          material.roughnessMap = roughnessMap;
          updateMaterial();
        }
      }
    }
  );
};
