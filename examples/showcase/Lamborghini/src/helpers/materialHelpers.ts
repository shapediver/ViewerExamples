import {
    TreeNode,
    MaterialStandardData,
    IOutputApi,
    ISessionApi,
    ITreeNode,
    IMaterialStandardDataProperties,
    sceneTree,
    viewports
  } from "@shapediver/viewer";
  
  export const getMaterials = (
    node: ITreeNode,
    materials: MaterialStandardData[] = []
  ): MaterialStandardData[] => {
    for (let i = 0; i < node.data.length; i++) {
      if (node.data[i] instanceof MaterialStandardData)
        materials.push(<MaterialStandardData>node.data[i]);
    }
    for (let i = 0; i < node.children.length; i++) {
      getMaterials(node.children[i], materials);
    }
  
    return materials;
  };
  
  export const changeMaterialForOutputs = (
    outputs: IOutputApi[],
    materialProperties: IMaterialStandardDataProperties
  ) => {
    let materials: MaterialStandardData[] = [];
    outputs.forEach((o: IOutputApi) => {
      o.freeze = true;
      materials = materials.concat(getMaterials(o.node!));
    });
    materials.forEach(async (m) => {
      for (let p in materialProperties)
        (<any>m)[p as keyof MaterialStandardData] =
          materialProperties[p as keyof IMaterialStandardDataProperties];
      m.updateVersion();
    });
  };
  
  export const changeBodyMaterial = (session: ISessionApi, color: string) => {
    const materialOutputs = Object.values(session.outputs).filter(
      (o: IOutputApi) => o.material === undefined
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "body")!,
        materialOutputs.find((o: IOutputApi) => o.name === "body_double")!,
        materialOutputs.find((o: IOutputApi) => o.name === "door_exterior")!
      ],
      {
        metalness: 0.75,
        roughness: 0.5,
        color: color,
        clearcoat: 1,
        clearcoatRoughness: 0
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "interior_details")!],
      {
        color: color,
        roughness: 1,
        metalness: 1
      }
    );
  
    sceneTree.root.updateVersion();
    viewports["myViewport"].update();
  };
  
  export const changeMaterials = (session: ISessionApi) => {
    const materialOutputs = Object.values(session.outputs).filter(
      (o: IOutputApi) => o.material === undefined
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "body")!,
        materialOutputs.find((o: IOutputApi) => o.name === "body_double")!,
        materialOutputs.find((o: IOutputApi) => o.name === "door_exterior")!
      ],
      {
        metalness: 0.75,
        roughness: 0.5,
        color: "#8c0b00b",
        clearcoat: 1,
        clearcoatRoughness: 0
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "interior_details")!],
      {
        color: "#8c0b00b",
        roughness: 1,
        metalness: 1
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "door_glass")!,
        materialOutputs.find((o: IOutputApi) => o.name === "glass")!,
        materialOutputs.find((o: IOutputApi) => o.name === "rearGlass")!
      ],
      {
        metalness: 0,
        roughness: 0,
        color: "#000",
        opacity: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "details_badge")!],
      {
        metalness: 1,
        roughness: 1,
        clearcoat: 1
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "frontLight_light")!,
        materialOutputs.find((o: IOutputApi) => o.name === "light_glass")!
      ],
      {
        color: "#fff",
        opacity: 0.05,
        metalness: 0,
        roughness: 0,
        clearcoat: 1
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find(
          (o: IOutputApi) => o.name === "rearWindow_airIntake"
        )!
      ],
      {
        color: "#000",
        metalness: 1,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.2
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "details_grills")!],
      {
        color: "#111",
        metalness: 1,
        roughness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.2
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "details_carbonfiber")!
      ],
      {
        color: "#000",
        metalness: 0,
        roughness: 0.5
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "interior_metal")!,
        materialOutputs.find((o: IOutputApi) => o.name === "interior_base")!
      ],
      {
        color: "#000",
        roughness: 1,
        metalness: 0
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find((o: IOutputApi) => o.name === "door_interior")!,
        materialOutputs.find((o: IOutputApi) => o.name === "interior_main")!,
        materialOutputs.find(
          (o: IOutputApi) => o.name === "door_interiorArmrest"
        )!
      ],
      {
        color: "#111",
        roughness: 1,
        metalness: 0
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "interior_engine")!],
      {
        color: "#444",
        roughness: 0,
        metalness: 1
      }
    );
  
    changeMaterialForOutputs(
      [
        materialOutputs.find(
          (o: IOutputApi) => o.name === "interior_steeringWheel_armrest"
        )!
      ],
      {
        color: "#444",
        roughness: 1,
        metalness: 0
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "interior_seats")!],
      {
        color: "#080808",
        roughness: 1,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0,
        sheenColor: "#444"
      }
    );
  
    changeMaterialForOutputs(
      [materialOutputs.find((o: IOutputApi) => o.name === "interior_headrest")!],
      {
        color: "#444",
        roughness: 1,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0,
        sheenColor: "#888"
      }
    );
  
    const wheelsMaterialOutput = materialOutputs.find(
      (o: IOutputApi) => o.name === "wheels"
    )!;
    const wheelMaterials = getMaterials(wheelsMaterialOutput.node!)!;
  
    // main rim
    wheelMaterials[0].color = "#000000";
    wheelMaterials[0].metalness = 1;
    wheelMaterials[0].roughness = 1;
    wheelMaterials[0].clearcoat = 0.75;
    wheelMaterials[0].clearcoatRoughness = 0.25;
    wheelMaterials[0].updateVersion();
  
    // tire
    wheelMaterials[1].color = "#000";
    wheelMaterials[1].metalness = 0;
    wheelMaterials[1].roughness = 1;
    wheelMaterials[1].updateVersion();
  
    // screws
    wheelMaterials[2].color = "#050505";
    wheelMaterials[2].metalness = 1;
    wheelMaterials[2].roughness = 0.5;
    wheelMaterials[2].clearcoat = 1;
    wheelMaterials[2].clearcoatRoughness = 0.2;
    wheelMaterials[2].updateVersion();
    wheelMaterials[5].color = "#050505";
    wheelMaterials[5].metalness = 1;
    wheelMaterials[5].roughness = 0.5;
    wheelMaterials[5].clearcoat = 1;
    wheelMaterials[5].clearcoatRoughness = 0.2;
    wheelMaterials[5].updateVersion();
  
    // brake discuss?
    wheelMaterials[3].color = "#444";
    wheelMaterials[3].metalness = 1;
    wheelMaterials[3].roughness = 0.5;
    wheelMaterials[3].updateVersion();
  
    // brake
    wheelMaterials[4].metalness = 0.75;
    wheelMaterials[4].roughness = 0.5;
    wheelMaterials[4].color = "#4d0000";
    wheelMaterials[4].clearcoat = 1;
    wheelMaterials[4].clearcoatRoughness = 0.2;
    wheelMaterials[4].updateVersion();
  
    sceneTree.root.updateVersion();
    viewports["myViewport"].update();
  };
  