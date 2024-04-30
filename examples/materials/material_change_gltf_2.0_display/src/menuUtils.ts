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
    material.color = "#ffffff";
    material.map =
      (await materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_color.png"
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
  
    // color input
    materialPanel.addText("color", "#ffffff", (value: string) => {
      material.color = value;
      updateMaterial();
    });
  
    let loadingUrl: string;
    // material input
    materialPanel.addText(
      "map",
      "https://viewer.shapediver.com/v3/images/SD_color.png",
      async (value: string) => {
        let map: MapData | undefined;
        try {
          loadingUrl = value;
          map = (await materialEngine.loadMap(value)) || undefined;
        } catch (e) {
          console.log("An error occurred while loading the map:", e);
        } finally {
          // The check with the loadingURL is needed to ensure
          // that we are actually applying the last value that was sent
          // It could be that while loading, the user entered another url
          // If that happens, we don't want to apply the map that was loaded inbetween
          if (loadingUrl === value) {
            material.map = map;
            updateMaterial();
          }
        }
      }
    );
  };
  