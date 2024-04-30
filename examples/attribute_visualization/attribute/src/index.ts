import {
  createSession,
  createViewport,
  RENDERER_TYPE,
  SDTF_TYPEHINT
} from "@shapediver/viewer";
import {
  AttributeVisualizationEngine,
  IStringAttribute,
  ATTRIBUTE_VISUALIZATION
} from "@shapediver/viewer.features.attribute-visualization";

(async () => {
  let viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });
  let session = await createSession({
    ticket:
      "0becbe99aa4c0ab77018d695c42bb9fcf17f7e5e67cd277c24fa8868fee85d910f50fe2be0af3baddb431b33dedb548e22aabe743074a2598f36eb70fd2876c727ec5ec456978be5546081be8d6443da1d66d1269d2236e362ace67fe9aa0a47ad11531b222960-46b2ea05fcd73affa12aeb88d0f25ab1",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });
  viewport.type = RENDERER_TYPE.ATTRIBUTES;

  const attributeVisualizationEngine = new AttributeVisualizationEngine(
    viewport
  );

  attributeVisualizationEngine.updateAttributes([
    <IStringAttribute>{
      key: "x+y, string",
      type: SDTF_TYPEHINT.STRING,
      visualization: ATTRIBUTE_VISUALIZATION.GREEN_WHITE_RED
    }
  ]);
})();
