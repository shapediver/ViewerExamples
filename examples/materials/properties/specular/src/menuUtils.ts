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
  material.roughness = 0;
  material.metalness = 0;

  material.specularColor = "#ff0000";
  material.specularColorMap = undefined;
  material.specularIntensity = 1;
  material.specularIntensityMap = undefined;

  updateMaterial();

  // create settings UI
  const materialPanel = (<any>window).QuickSettings.create(0, 0, "Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";

  materialPanel.addText("specularColor", "#ff0000", (value: string) => {
    material.specularColor = value;
    updateMaterial();
  });

  let loadingUrl: string;
  // material input
  materialPanel.addText("specularColorMap", "", async (value: string) => {
    let specularColorMap: MapData | undefined;
    try {
      loadingUrl = value;
      specularColorMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the specularColorMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrl === value) {
        material.specularColorMap = specularColorMap;
        updateMaterial();
      }
    }
  });

  materialPanel.addNumber(
    "specularIntensity",
    0,
    Infinity,
    1,
    0.01,
    (value: number) => {
      material.specularIntensity = value;
      updateMaterial();
    }
  );

  let loadingUrlM: string;
  // material input
  materialPanel.addText("specularIntensityMap", "", async (value: string) => {
    let specularIntensityMap: MapData | undefined;
    try {
      loadingUrlM = value;
      specularIntensityMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log(
        "An error occurred while loading the specularIntensityMap:",
        e
      );
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrlM === value) {
        material.specularIntensityMap = specularIntensityMap;
        updateMaterial();
      }
    }
  });
};
