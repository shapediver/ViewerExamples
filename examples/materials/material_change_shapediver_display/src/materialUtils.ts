import {
  IOutputApi,
  ISessionApi,
  ITreeNode,
  MaterialStandardData
} from "@shapediver/viewer";

export const overrideOutputMaterial = async (
  session: ISessionApi,
  outputName: string,
  material: MaterialStandardData | MaterialStandardData[]
) => {
  // Find the output and run a few checks
  const outputsByName = session.getOutputByName(outputName);
  if (outputsByName.length === 0) {
    console.log("No output with that name was found.");
    return;
  }
  const primaryMaterialOutput = outputsByName.find(
    (o: IOutputApi) => o.material === undefined
  );

  if (!primaryMaterialOutput) {
    console.log("Could not find a material output with the provided name.");
    return;
  }

  // freeze it (this means that further updates that come from our servers will be ignored, only what you put in counts)
  primaryMaterialOutput.freeze = true;

  // assign the materialData, case separation depending on if the provided material is an array
  // node structure: outputNode -> transformationNode -> materialNode
  if (Array.isArray(material)) {
    if (material.length !== primaryMaterialOutput.node!.children.length) {
      console.log("Content length not equal to material length.");
      return;
    }

    // assign the materials to the corresponding nodes
    primaryMaterialOutput.node!.children.forEach(
      (c: ITreeNode, index: number) => (c.children[0].data[0] = material[index])
    );
  } else {
    // assign the material to the corresponding nodes
    primaryMaterialOutput.node!.children.forEach(
      (c: ITreeNode) => (c.children[0].data[0] = material)
    );
  }

  // update the outputs
  await session.updateOutputs();
};
