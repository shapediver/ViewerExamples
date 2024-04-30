
import {
  createViewport,
  createSession,
  MaterialStandardData,
  ITreeNode,
  GeometryData,
  sceneTree
} from "@shapediver/viewer";

/**
 * Searches for the material node with the specified name.
 *
 * @param node
 * @param materialName
 */
const getMaterial = (
  node: ITreeNode,
  materialName: string
): {
  node: ITreeNode;
  material: MaterialStandardData;
}[] => {
  const materialNodes: {
    node: ITreeNode;
    material: MaterialStandardData;
  }[] = [];

  node.traverse((n) => {
    for (let i = 0; i < n.data.length; i++) {
      if (n.data[i] instanceof MaterialStandardData) {
        const material = <MaterialStandardData>n.data[i];
        if (material.name === materialName) {
          materialNodes.push({ node: n, material });
        }
      }

      if (n.data[i] instanceof GeometryData) {
        const geometry = <GeometryData>n.data[i];
        if (geometry.material && geometry.material.name === materialName && geometry.material instanceof MaterialStandardData) {
          materialNodes.push({ node: n, material: geometry.material });
        }
      }
    }
  });

  return materialNodes;
};

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "caad38073a2478fe90ae42f6c9bd59679233d600562e9c116fe14599b2821fd1e118310aa64685b1f1fd6ecafefe5e32150e42deece63480bf4b4e3d92797e39237fd338bb49baf9e84ac665f673cf02a929d38be512c04655f2ef7d1013041783885c4b44ae91-6f072e4fe2856a27a76f605d6bc4aab3",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  console.log(getMaterial(sceneTree.root, "sphere"));
  console.log(getMaterial(sceneTree.root, "box"));

  const cb = (newNode?: ITreeNode) => {
    if (!newNode) return;

    const materialNodes = getMaterial(newNode, "sphere");
    materialNodes.forEach((materialNode) => {
      materialNode.material.color = "red";
      materialNode.material.updateVersion();

      materialNode.node.updateVersion();
    });
  };
  session.updateCallback = cb;
  cb(session.node);
})();
