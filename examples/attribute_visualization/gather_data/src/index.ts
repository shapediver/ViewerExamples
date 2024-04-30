
import {
  createSession,
  createViewport,
  GeometryData,
  IGeometryData,
  ITreeNode,
  SDTFItemData
} from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "e940c3c532b05f84042863d88f25c84483c55726e434d6eae3a29cd76b8861261c6c44d841a96f5bf06bf7fe4f7a646d895951de6e3a431cbd4a7a8b56bd1ea173178365a2acaf6a7fe153ebcbcb9d9171e491b01ebe8bbb7f7d23ce64fdb98fc012cef915ff82-af6db24cc6a2116352f7eb64ab45ed2d",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  const attributeDataCollection: {
    node: ITreeNode;
    data: SDTFItemData;
    geometryData: IGeometryData[];
  }[] = [];

  // helper function to get all geometry data in a node
  const getGeometryData = (node: ITreeNode, geometryData: IGeometryData[]) => {
    for (let i = 0; i < node.data.length; i++) {
      if (node.data[i] instanceof GeometryData) {
        const data = <IGeometryData>node.data[i];
        geometryData.push(data);
      }
    }

    for (let i = 0; i < node.children.length; i++)
      getGeometryData(node.children[i], geometryData);
  };

  // helper function to get the geometryData and parentNode for each SDTFItemData
  const getItemData = (node: ITreeNode) => {
    for (let i = 0; i < node.data.length; i++) {
      if (node.data[i] instanceof SDTFItemData) {
        const data = <SDTFItemData>node.data[i];
        const geometryData: GeometryData[] = [];
        getGeometryData(node, geometryData);
        attributeDataCollection.push({ node, data, geometryData });
      }
    }

    for (let i = 0; i < node.children.length; i++)
      getItemData(node.children[i]);
  };
  getItemData(session.node);
  console.log(attributeDataCollection);
})();
