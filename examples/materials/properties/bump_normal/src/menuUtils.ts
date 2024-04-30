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
  material.normalMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_normal.png"
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

  let loadingUrlNormal: string;
  // material input
  materialPanel.addText(
    "normalMap",
    "https://viewer.shapediver.com/v3/images/SD_normal.png",
    async (value: string) => {
      let normalMap: MapData | undefined;
      try {
        loadingUrlNormal = value;
        normalMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the normalMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlNormal === value) {
          material.normalMap = normalMap;
          updateMaterial();
        }
      }
    }
  );

  material.normalScale = 1.0;
  materialPanel.addNumber("normalScale", 0, 1, 1, 0.01, (value: number) => {
    material.normalScale = value;
    updateMaterial();
  });

  let loadingUrlBump: string;
  // material input
  materialPanel.addText("bumpMap", "", async (value: string) => {
    let bumpMap: MapData | undefined;
    try {
      loadingUrlBump = value;
      bumpMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the bumpMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrlBump === value) {
        material.bumpMap = bumpMap;
        updateMaterial();
      }
    }
  });

  material.bumpScale = 0;
  materialPanel.addNumber("bumpScale", 0, 1, 0, 0.01, (value: number) => {
    material.bumpScale = value;
    updateMaterial();
  });
};
