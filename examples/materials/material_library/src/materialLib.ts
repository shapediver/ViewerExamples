import {
  IViewportApi,
  MapData,
  MaterialEngine,
  MaterialStandardData,
  sceneTree
} from "@shapediver/viewer";

const materialEngine: MaterialEngine = MaterialEngine.instance;
const materials: {
  [key: string]: (material: MaterialStandardData) => Promise<void>;
} = {};

let materialPanel: any = (<any>window).QuickSettings.create(0, 0, "Material");
let viewport: IViewportApi;

const resetMaterialPanel = () => {
  materialPanel.destroy();
  materialPanel = (<any>window).QuickSettings.create(0, 0, "Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";
};
const materialSelect = <HTMLSelectElement>document.getElementById("materials");
const loadingLogo = document.getElementById("loading-logo");

let updateCallback: () => void;

export const initMaterials = async (
  material: MaterialStandardData,
  v: IViewportApi
) => {
  viewport = v;

  updateCallback = () => {
    material.updateVersion();
    sceneTree.root.updateVersion();
    viewport.update();
  };

  const materialNames = Object.keys(materials);
  materialNames.sort((a, b) => a.localeCompare(b));
  for (let materialName of materialNames) {
    const option = <HTMLOptionElement>document.createElement("option");
    option.value = materialName;
    option.innerHTML = materialName;
    materialSelect.appendChild(option);
  }

  materialSelect.onchange = async () => {
    loadingLogo!.style.visibility = "visible";
    await materials[materialSelect.value](material);
    loadingLogo!.style.visibility = "hidden";
    updateCallback();
  };

  await materials[materialSelect.value](material);
  updateCallback();
};

const assignMaterial = async (
  material: MaterialStandardData,
  maps: {
    map?: string;
    normalMap?: string;
    roughnessMap?: string;
    metalnessMap?: string;
    displacementMap?: string;
    alphaMap?: string;
    aoMap?: string;
  }
): Promise<{
  map?: MapData;
  normalMap?: MapData;
  roughnessMap?: MapData;
  metalnessMap?: MapData;
  displacementMap?: MapData;
  alphaMap?: MapData;
  aoMap?: MapData;
}> => {
  viewport.camera!.reset();
  material.reset();
  const promises = [
    maps.map ? await materialEngine.loadMap(maps.map) : undefined,
    maps.normalMap ? await materialEngine.loadMap(maps.normalMap) : undefined,
    maps.roughnessMap
      ? await materialEngine.loadMap(maps.roughnessMap)
      : undefined,
    maps.metalnessMap
      ? await materialEngine.loadMap(maps.metalnessMap)
      : undefined,
    maps.displacementMap
      ? await materialEngine.loadMap(maps.displacementMap)
      : undefined,
    maps.alphaMap ? await materialEngine.loadMap(maps.alphaMap) : undefined,
    maps.aoMap ? await materialEngine.loadMap(maps.aoMap) : undefined
  ];

  const textures = <MapData[]>await Promise.all(promises);

  // default values

  if (maps.map) material.map = textures[0];
  material.color = "#ffffff";

  if (maps.normalMap) material.normalMap = textures[1];

  if (maps.roughnessMap) {
    material.roughness = 1;
    material.roughnessMap = textures[2];
  } else {
    material.roughness = 0;
  }

  if (maps.metalnessMap) {
    material.metalness = 1;
    material.metalnessMap = textures[3];
  } else {
    material.metalness = 0;
  }

  if (maps.aoMap) material.aoMap = textures[6];

  // menu
  resetMaterialPanel();

  if (maps.map) {
    materialPanel.addBoolean("map", true, (value: boolean) => {
      material.map = value ? textures[0] : undefined;
      updateCallback();
    });
  }

  if (maps.normalMap) {
    materialPanel.addNumber("normalScale", 0, 1, 1, 0.01, (value: number) => {
      material.normalScale = value;
      updateCallback();
    });
    materialPanel.addBoolean("normalMap", true, (value: boolean) => {
      material.normalMap = value ? textures[1] : undefined;
      updateCallback();
    });
  }

  if (maps.roughnessMap) {
    materialPanel.addNumber("roughness", 0, 1, 1, 0.01, (value: number) => {
      material.roughness = value;
      updateCallback();
    });
    materialPanel.addBoolean("roughnessMap", true, (value: boolean) => {
      material.roughnessMap = value ? textures[2] : undefined;
      updateCallback();
    });
  } else {
    materialPanel.addNumber("roughness", 0, 1, 0, 0.01, (value: number) => {
      material.roughness = value;
      updateCallback();
    });
  }

  if (maps.metalnessMap) {
    materialPanel.addNumber("metalness", 0, 1, 1, 0.01, (value: number) => {
      material.metalness = value;
      updateCallback();
    });
    materialPanel.addBoolean("metalnessMap", true, (value: boolean) => {
      material.metalnessMap = value ? textures[3] : undefined;
      updateCallback();
    });
  } else {
    materialPanel.addNumber("metalness", 0, 1, 0, 0.01, (value: number) => {
      material.metalness = value;
      updateCallback();
    });
  }

  if (maps.aoMap) {
    materialPanel.addNumber(
      "aoMapIntensity",
      0,
      1,
      1,
      0.01,
      (value: number) => {
        material.aoMapIntensity = value;
        updateCallback();
      }
    );
    materialPanel.addBoolean("aoMap", true, (value: boolean) => {
      material.aoMap = value ? textures[6] : undefined;
      updateCallback();
    });
  }

  if (maps.displacementMap) {
    materialPanel.addNumber(
      "displacementScale",
      0,
      1,
      1,
      0.01,
      (value: number) => {
        material.displacementScale = value;
        updateCallback();
      }
    );
    materialPanel.addBoolean("displacementMap", false, (value: boolean) => {
      material.displacementMap = value ? textures[4] : undefined;
      updateCallback();
    });

    const paragraph = <HTMLParagraphElement>document.createElement("p");
    paragraph.innerText =
      "The displacement map moves the vertices of the mesh. If the mesh does not have enough vertices, the map can not be represented truthfully (see the base of this model). Additionally, make sure your mesh is closed, the different parts of the mesh will not be connected anymore (as you can see in this example).";
    materialPanel.addElement("", paragraph);
  }

  return {
    map: textures[0],
    normalMap: textures[1],
    roughnessMap: textures[2],
    metalnessMap: textures[3],
    displacementMap: textures[4],
    alphaMap: textures[5],
    aoMap: textures[6]
  };
};

materials["Stone Wall"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/stone_wall/TexturesCom_Wall_Stone3_2x2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/stone_wall/TexturesCom_Wall_Stone3_2x2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/stone_wall/TexturesCom_Wall_Stone3_2x2_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/stone_wall/TexturesCom_Wall_Stone3_2x2_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/stone_wall/TexturesCom_Wall_Stone3_2x2_1K_ao.png"
  });
};

materials["Rock Cliff"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/rock_cliff/TexturesCom_Rock_CliffLayered_1.5x1.5_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/rock_cliff/TexturesCom_Rock_CliffLayered_1.5x1.5_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/rock_cliff/TexturesCom_Rock_CliffLayered_1.5x1.5_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/rock_cliff/TexturesCom_Rock_CliffLayered_1.5x1.5_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/rock_cliff/TexturesCom_Rock_CliffLayered_1.5x1.5_1K_ao.png"
  });
};

materials["Leather Plain"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/leather_plain/TexturesCom_Leather_Plain09_008x008_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/leather_plain/TexturesCom_Leather_Plain09_008x008_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/leather_plain/TexturesCom_Leather_Plain09_008x008_1K_roughness.png"
  });
};

materials["Parquet Fivefinger"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/parquet_fivefinger/TexturesCom_Wood_ParquetFiveFinger_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/parquet_fivefinger/TexturesCom_Wood_ParquetFiveFinger_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/parquet_fivefinger/TexturesCom_Wood_ParquetFiveFinger_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/parquet_fivefinger/TexturesCom_Wood_ParquetFiveFinger_1K_ao.png"
  });
};

materials["Parquet Herringbone"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/parquet_herringbone/TexturesCom_Wood_ParquetHerringbone9_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/parquet_herringbone/TexturesCom_Wood_ParquetHerringbone9_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/parquet_herringbone/TexturesCom_Wood_ParquetHerringbone9_1K_roughness.png"
  });
};

materials["Sand Muddy"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/sand_muddy/TexturesCom_Sand_Muddy2_2x2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/sand_muddy/TexturesCom_Sand_Muddy2_2x2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/sand_muddy/TexturesCom_Sand_Muddy2_2x2_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/sand_muddy/TexturesCom_Sand_Muddy2_2x2_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/sand_muddy/TexturesCom_Sand_Muddy2_2x2_1K_ao.png"
  });
};

materials["Pavement Painted Concrete"] = async (
  material: MaterialStandardData
) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/pavement_painted_concrete/TexturesCom_Pavement_PaintedConcrete3_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/pavement_painted_concrete/TexturesCom_Pavement_PaintedConcrete3_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/pavement_painted_concrete/TexturesCom_Pavement_PaintedConcrete3_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/pavement_painted_concrete/TexturesCom_Pavement_PaintedConcrete3_1K_ao.png"
  });
};

materials["Space Blanket Folded"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/plastic_space_blanket/TexturesCom_Plastic_SpaceBlanketFolds_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/plastic_space_blanket/TexturesCom_Plastic_SpaceBlanketFolds_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/plastic_space_blanket/TexturesCom_Plastic_SpaceBlanketFolds_1K_roughness.png",
    metalnessMap:
      "https://7ru6ik.csb.app/textures/plastic_space_blanket/TexturesCom_Plastic_SpaceBlanketFolds_1K_metallic.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/plastic_space_blanket/TexturesCom_Plastic_SpaceBlanketFolds_1K_ao.png"
  });
};

materials["Fabric Disk Cloth"] = async (material: MaterialStandardData) => {
  const { map, roughnessMap } = await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/fabric_disk_cloth/TexturesCom_Fabric_DishCloth2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/fabric_disk_cloth/TexturesCom_Fabric_DishCloth2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/fabric_disk_cloth/TexturesCom_Fabric_DishCloth2_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/fabric_disk_cloth/TexturesCom_Fabric_DishCloth2_1K_ao.png"
  });
  material.sheen = 1;
  material.sheenColorMap = map;

  materialPanel.addNumber("sheen", 0, 1, 1, 0.01, (value: number) => {
    material.sheen = value;
    updateCallback();
  });
  materialPanel.addBoolean("sheenColorMap", true, (value: boolean) => {
    material.sheenColorMap = value ? map : undefined;
    updateCallback();
  });

  material.sheenRoughness = 1;
  material.sheenRoughnessMap = roughnessMap;

  materialPanel.addNumber("sheenRoughness", 0, 1, 1, 0.01, (value: number) => {
    material.sheenRoughness = value;
    updateCallback();
  });
  materialPanel.addBoolean("sheenRoughnessMap", true, (value: boolean) => {
    material.sheenRoughnessMap = value ? roughnessMap : undefined;
    updateCallback();
  });
};

materials["Pavement Terrazzo"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/pavement_terrazzo/TexturesCom_Pavement_Terrazzo2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/pavement_terrazzo/TexturesCom_Pavement_Terrazzo2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/pavement_terrazzo/TexturesCom_Pavement_Terrazzo2_1K_roughness.png"
  });
};

materials["Pavement Terracotta Antique"] = async (
  material: MaterialStandardData
) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/pavement_terracotta_antique/TexturesCom_Pavement_TerracottaAntique_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/pavement_terracotta_antique/TexturesCom_Pavement_TerracottaAntique_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/pavement_terracotta_antique/TexturesCom_Pavement_TerracottaAntique_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/pavement_terracotta_antique/TexturesCom_Pavement_TerracottaAntique_1K_ao.png"
  });
};

materials["Pavement Medieval"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/pavement_medieval/TexturesCom_Pavement_Medieval_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/pavement_medieval/TexturesCom_Pavement_Medieval_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/pavement_medieval/TexturesCom_Pavement_Medieval_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/pavement_medieval/TexturesCom_Pavement_Medieval_1K_ao.png"
  });
};

materials["Acoustic Foam"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_roughness.png",
    metalnessMap:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_metallic.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/acoustic_foam/TexturesCom_Various_AcousticFoam_1K_ao.png"
  });
};

materials["Oak Veneer"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/oak_veneer/TexturesCom_Wood_OakVeneer2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/oak_veneer/TexturesCom_Wood_OakVeneer2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/oak_veneer/TexturesCom_Wood_OakVeneer2_1K_roughness.png"
  });
};

materials["Cinderblocks Painted"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/cinderblocks_painted/TexturesCom_Brick_CinderblocksPainted2_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/cinderblocks_painted/TexturesCom_Brick_CinderblocksPainted2_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/cinderblocks_painted/TexturesCom_Brick_CinderblocksPainted2_1K_roughness.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/cinderblocks_painted/TexturesCom_Brick_CinderblocksPainted2_1K_ao.png"
  });
};

materials["Scifi Panel"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/scifi_panel/TexturesCom_Scifi_Panel_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/scifi_panel/TexturesCom_Scifi_Panel_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/scifi_panel/TexturesCom_Scifi_Panel_1K_roughness.png",
    metalnessMap:
      "https://7ru6ik.csb.app/textures/scifi_panel/TexturesCom_Scifi_Panel_1K_metallic.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/scifi_panel/TexturesCom_Scifi_Panel_1K_ao.png"
  });
};

materials["Solar Cell"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/solar_cell/TexturesCom_SolarCells_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/solar_cell/TexturesCom_SolarCells_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/solar_cell/TexturesCom_SolarCells_1K_roughness.png",
    metalnessMap:
      "https://7ru6ik.csb.app/textures/solar_cell/TexturesCom_SolarCells_1K_metallic.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/solar_cell/TexturesCom_SolarCells_1K_ao.png"
  });
};

materials["Rock Volcanic"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/rock_volcanic/TexturesCom_Rock_CliffVolcanic_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/rock_volcanic/TexturesCom_Rock_CliffVolcanic_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/rock_volcanic/TexturesCom_Rock_CliffVolcanic_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/rock_volcanic/TexturesCom_Rock_CliffVolcanic_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/rock_volcanic/TexturesCom_Rock_CliffVolcanic_1K_ao.png"
  });
};

materials["Paint Chipped"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/paint_chipped/TexturesCom_Paint_Chipped_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/paint_chipped/TexturesCom_Paint_Chipped_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/paint_chipped/TexturesCom_Paint_Chipped_1K_roughness.png"
  });
};

materials["Pavement Stone Green"] = async (material: MaterialStandardData) => {
  await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/pavement_stone_green/TexturesCom_Pavement_StoneGreen_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/pavement_stone_green/TexturesCom_Pavement_StoneGreen_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/pavement_stone_green/TexturesCom_Pavement_StoneGreen_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/pavement_stone_green/TexturesCom_Pavement_StoneGreen_1K_height.png",
    aoMap:
      "https://7ru6ik.csb.app/textures/pavement_stone_green/TexturesCom_Pavement_StoneGreen_1K_ao.png"
  });
};

materials["Ice Cracked - 1"] = async (material: MaterialStandardData) => {
  const { displacementMap } = await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_height.png"
  });

  material.alphaMap = displacementMap;
  material.alphaCutoff = 0;
  material.opacity = 1;

  materialPanel.addNumber("opacity", 0, 1, 1, 0.01, (value: number) => {
    material.opacity = value;
    updateCallback();
  });

  materialPanel.addNumber("alphaCutoff", 0, 1, 0, 0.01, (value: number) => {
    material.alphaCutoff = value;
    updateCallback();
  });

  materialPanel.addBoolean("alphaMap", true, (value: boolean) => {
    material.alphaMap = value ? displacementMap : undefined;
    updateCallback();
  });
};

materials["Ice Cracked - 2"] = async (material: MaterialStandardData) => {
  const { alphaMap, displacementMap } = await assignMaterial(material, {
    map:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_albedo.png",
    normalMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_normal.png",
    roughnessMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_roughness.png",
    displacementMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_height.png",
    alphaMap:
      "https://7ru6ik.csb.app/textures/ice_cracked/TexturesCom_Ice_Cracked_1K_roughness_inverted.png"
  });

  material.alphaMap = displacementMap;
  material.alphaCutoff = 0;
  material.opacity = 1;

  material.attenuationColor = "#ffffff";
  material.attenuationDistance = 10;
  material.ior = 1.5;

  material.transmission = 1;
  material.transmissionMap = alphaMap;

  materialPanel.addNumber("opacity", 0, 1, 1, 0.01, (value: number) => {
    material.opacity = value;
    updateCallback();
  });

  materialPanel.addNumber("alphaCutoff", 0, 1, 0, 0.01, (value: number) => {
    material.alphaCutoff = value;
    updateCallback();
  });

  materialPanel.addBoolean("alphaMap", true, (value: boolean) => {
    material.alphaMap = value ? displacementMap : undefined;
    updateCallback();
  });

  materialPanel.addText("attenuationColor", "#ffffff", (value: string) => {
    material.attenuationColor = value;
    updateCallback();
  });

  materialPanel.addNumber(
    "attenuationDistance",
    0,
    Infinity,
    10,
    0.01,
    (value: number) => {
      material.attenuationDistance = value;
      updateCallback();
    }
  );

  materialPanel.addNumber("transmission", 0, 1, 1, 0.01, (value: number) => {
    material.thickness = value;
    updateCallback();
  });

  materialPanel.addBoolean("transmissionMap", true, (value: boolean) => {
    material.transmissionMap = value ? alphaMap : undefined;
    updateCallback();
  });
};
