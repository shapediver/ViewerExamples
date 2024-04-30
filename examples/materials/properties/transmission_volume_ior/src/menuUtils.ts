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
  material.attenuationDistance = 10;
  material.ior = 1.5;
  material.thickness = 10;
  material.transmission = 1;
  material.roughness = 0;
  material.metalness = 0;

  material.thicknessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale.png"
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

  material.attenuationColor = "#ffffff";
  materialPanel.addText("attenuationColor", "#ffffff", (value: string) => {
    material.attenuationColor = value;
    updateMaterial();
  });

  materialPanel.addNumber(
    "attenuationDistance",
    0,
    Infinity,
    10,
    0.01,
    (value: number) => {
      material.attenuationDistance = value;
      updateMaterial();
    }
  );

  materialPanel.addNumber("ior", 0, 4, 1.5, 0.01, (value: number) => {
    material.ior = value;
    updateMaterial();
  });

  materialPanel.addNumber(
    "thickness",
    0,
    Infinity,
    10,
    0.01,
    (value: number) => {
      material.thickness = value;
      updateMaterial();
    }
  );

  let loadingUrlTransmission: string;
  // material input
  materialPanel.addText("transmissionMap", "", async (value: string) => {
    let transmissionMap: MapData | undefined;
    try {
      loadingUrlTransmission = value;
      transmissionMap = (await materialEngine.loadMap(value)) || undefined;
    } catch (e) {
      console.log("An error occurred while loading the transmissionMap:", e);
    } finally {
      // The check with the loadingURL is needed to ensure
      // that we are actually applying the last value that was sent
      // It could be that while loading, the user entered another url
      // If that happens, we don't want to apply the map that was loaded inbetween
      if (loadingUrlTransmission === value) {
        material.transmissionMap = transmissionMap;
        updateMaterial();
      }
    }
  });

  materialPanel.addNumber("transmission", 0, 1, 1, 0.01, (value: number) => {
    material.transmission = value;
    updateMaterial();
  });

  let loadingUrlThickness: string;
  // material input
  materialPanel.addText(
    "thicknessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale.png",
    async (value: string) => {
      let thicknessMap: MapData | undefined;
      try {
        loadingUrlThickness = value;
        thicknessMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the thicknessMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlThickness === value) {
          material.thicknessMap = thicknessMap;
          updateMaterial();
        }
      }
    }
  );
};
