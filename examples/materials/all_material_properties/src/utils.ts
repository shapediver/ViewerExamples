import {
    GeometryData,
    ISessionApi,
    ITreeNode,
    MapData,
    MaterialEngine,
    TreeNode
  } from "@shapediver/viewer";
  
  const materialEngine: MaterialEngine = MaterialEngine.instance;
  
  const extractGeometries = (
    node: ITreeNode,
    geometries: GeometryData[] = []
  ): GeometryData[] => {
    for (let i = 0; i < node.data.length; i++) {
      if (node.data[i] instanceof GeometryData) {
        geometries.push(<GeometryData>node.data[i]);
      }
    }
    for (let i = 0; i < node.children.length; i++) {
      extractGeometries(node.children[i], geometries);
    }
  
    return geometries;
  };
  
  export const getSessionGeometry = (session: ISessionApi): GeometryData[] => {
    let geometries: GeometryData[] = [];
    for (let o in session.outputs) {
      if (session.outputs[o].material !== undefined) {
        geometries = geometries.concat(
          extractGeometries(session.outputs[o].node!)
        );
      }
    }
    return geometries;
  };
  
  export const createMaps = async (): Promise<{
    colorMap: MapData;
    grayScaleMap: MapData;
    grayScaleInverseMap: MapData;
    grayScaleAlphaMap: MapData;
    normalMap: MapData;
    logoMap: MapData;
  }> => {
    const mapPromises = await Promise.all([
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_color.png"
      ),
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_grayscale.png"
      ),
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png"
      ),
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_alpha.png"
      ),
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/SD_normal.png"
      ),
      materialEngine.loadMap(
        "https://viewer.shapediver.com/v3/images/ShapeDiver_logo_white.png"
      )
    ]);
  
    return {
      colorMap: mapPromises[0]!,
      grayScaleMap: mapPromises[1]!,
      grayScaleInverseMap: mapPromises[2]!,
      grayScaleAlphaMap: mapPromises[3]!,
      normalMap: mapPromises[4]!,
      logoMap: mapPromises[5]!
    };
  };
  