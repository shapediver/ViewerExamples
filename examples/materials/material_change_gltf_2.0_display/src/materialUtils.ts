import {
    ITreeNode,
    MaterialStandardData,
    GeometryData,
    viewports,
    ISessionApi
  } from "@shapediver/viewer";
  
  /**
   * Replace all occurences of the material with the specified name
   * in the current node and it's children with the material provided
   *
   * @param node
   * @param materialName
   * @param material
   */
  const replaceMaterial = (
    node: ITreeNode,
    materialName: string,
    material: MaterialStandardData
  ) => {
    for (let i = 0; i < node.data.length; i++) {
      // materials can be either directly in the data of a node
      if (node.data[i] instanceof MaterialStandardData) {
        const currentMaterial = <MaterialStandardData>node.data[i];
        if (currentMaterial.name === materialName) node.data[i] = material;
      }
  
      // or can be assigned to a geometry
      if (node.data[i] instanceof GeometryData) {
        const geometry = <GeometryData>node.data[i];
        if (geometry.material && geometry.material.name === materialName)
          geometry.material = material;
      }
    }
  
    for (let i = 0; i < node.children.length; i++)
      replaceMaterial(node.children[i], materialName, material);
  };
  
  /**
   * Override the material with the specified materialName in the output
   * with the specified outputName with the material provided.
   * A callback will be registered to override that material every time
   * the output is updated.
   *
   * @param session
   * @param outputName
   * @param materialName
   * @param material
   */
  export const overrideMaterial = (
    session: ISessionApi,
    outputName: string,
    materialName: string,
    material: MaterialStandardData
  ) => {
    // Find the output and run a few checks
    const outputsByName = session.getOutputByName(outputName);
    if (outputsByName.length > 1) {
      console.log("There are multiple outputs with that name.");
      return;
    } else if (outputsByName.length === 0) {
      console.log("No output with that name was found.");
      return;
    }
    const primaryOutput = session.getOutputByName(outputName)[0]!;
  
    // create a callback that updates the material
    // with the specified name with the material provided
    const updateCallback = (newNode?: ITreeNode, oldNode?: ITreeNode) => {
      replaceMaterial(newNode!, materialName, material);
      newNode!.updateVersion();
      viewports["myViewport"].update();
    };
    // assign the callback to the output
    primaryOutput.updateCallback = updateCallback;
    // call the callback immediately for the current node
    updateCallback(primaryOutput.node!);
  };
  