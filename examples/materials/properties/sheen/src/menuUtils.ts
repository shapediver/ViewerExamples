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
  material.sheen = 1;
  material.sheenColor = "#00ffff";
  material.sheenColorMap = undefined;
  material.sheenRoughness = 1;
  material.sheenRoughnessMap = undefined;

  updateMaterial();

  // create settings UI
  const materialPanel = (<any>window).QuickSettings.create(0, 0, "Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";

  materialPanel.addNumber("sheen", 0, 1, 1, 0.01, (value: number) => {
    material.sheen = value;
    updateMaterial();
  });

  materialPanel.addText("sheenColor", "#00ffff", (value: string) => {
    material.sheenColor = value;
    updateMaterial();
  });

  let loadingUrl: string;
  // material input
  materialPanel.addText("sheenColorMap", "", async (value: string) => {
    let sheenColorMap: MapData | undefined;
    try {
      loadingUrl = value;
      sheenColorMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the sheenColorMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrl === value) {
        material.sheenColorMap = sheenColorMap;
        updateMaterial();
      }
    }
  });

  materialPanel.addNumber("sheenRoughness", 0, 1, 1, 0.01, (value: number) => {
    material.sheenRoughness = value;
    updateMaterial();
  });

  let loadingUrlM: string;
  // material input
  materialPanel.addText("sheenRoughnessMap", "", async (value: string) => {
    let sheenRoughnessMap: MapData | undefined;
    try {
      loadingUrlM = value;
      sheenRoughnessMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the sheenRoughnessMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrlM === value) {
        material.sheenRoughnessMap = sheenRoughnessMap;
        updateMaterial();
      }
    }
  });
};
