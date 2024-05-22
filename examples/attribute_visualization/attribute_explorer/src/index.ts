import {
  sceneTree,
  createSession,
  createViewport,
  ITreeNode,
  RENDERER_TYPE,
  SDTFItemData,
  addListener,
  EVENTTYPE,
  ISessionApi,
  IViewportApi,
  MaterialUnlitData,
  SDTF_TYPEHINT,
  MaterialStandardData
} from "@shapediver/viewer";
import {
  InteractionData,
  InteractionEngine,
  ISelectEvent,
  SelectManager
} from "@shapediver/viewer.features.interaction";
import {
  AttributeVisualizationEngine,
  ATTRIBUTE_VISUALIZATION,
  IStringAttribute
} from "@shapediver/viewer.features.attribute-visualization";

let session: ISessionApi, viewport: IViewportApi;
let interactionEngine: InteractionEngine;
let attributeVisualizationEngine: AttributeVisualizationEngine;
let attributeSelectManager: SelectManager;
let attributeSelectManagerToken: string;
let nodeInteractionDataPairs: {
  node: ITreeNode;
  data: InteractionData;
}[] = [];

/**
 * HELPER FUNCTIONS - START
 */

const addInteractionDataToSDTFItems = (node: ITreeNode) => {
  for (let i = 0; i < node.data.length; i++) {
    if (node.data[i] instanceof SDTFItemData) {
      const data = new InteractionData({ select: true });
      node.addData(data);
      nodeInteractionDataPairs.push({ node, data });
      node.updateVersion()
    }
  }

  for (let i = 0; i < node.children.length; i++)
    addInteractionDataToSDTFItems(node.children[i]);
};

const removeInteractionDataFromSDTFItems = () => {
  for (let i = 0; i < nodeInteractionDataPairs.length; i++) {
    nodeInteractionDataPairs[i].node.removeData(
      nodeInteractionDataPairs[i].data
    );
    nodeInteractionDataPairs[i].node.updateVersion()
  }
  nodeInteractionDataPairs = [];
};

/**
 * HELPER FUNCTIONS - END
 */

/**
 * I just use a boy to activate the attribute visualization
 */
const activationBox = <HTMLInputElement>document.getElementById("activate");
activationBox.onclick = () => {
  if (activationBox.checked) {
    viewport.type = RENDERER_TYPE.ATTRIBUTES;
    attributeSelectManagerToken = interactionEngine.addInteractionManager(
      attributeSelectManager
    );
    addInteractionDataToSDTFItems(sceneTree.root);
  } else {
    viewport.type = RENDERER_TYPE.STANDARD;
    interactionEngine.removeInteractionManager(attributeSelectManagerToken);
    removeInteractionDataFromSDTFItems();
  }
};

/**
 * Event for SELECT_OFF
 */
addListener(EVENTTYPE.INTERACTION.SELECT_OFF, (e) => {
  const selectEvent = <ISelectEvent>e;
  console.log("SELECT_OFF");
});

/**
 * Event for SELECT_ON
 */
addListener(EVENTTYPE.INTERACTION.SELECT_ON, (e) => {
  const selectEvent = <ISelectEvent>e;

  const itemData = <SDTFItemData | undefined>(
    selectEvent.node.data.find((d) => d instanceof SDTFItemData)
  );
  if (!itemData) return;

  console.log("SELECT_ON");
  /**
   * Here is the data that you need!
   */
  console.log(itemData.attributes);
});

(async () => {
  viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });
  session = await createSession({
    ticket:
      "9b524671657560c37705b9ef666136631340606c9ade55c46a66fbbfedfdd4ec5336f9f6f2c799058883ded1e7440377885eaee877d1fb9ab3599e491d7f72ca84a255560f2ce88ac58d0cfd7e5648343055e8dea5b45e521c4f55e15020bf21b3d3c79140a024-58588a6277fd7604fff0f969dda37a1f",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession",
    loadSdtf: true
  });

  attributeVisualizationEngine = new AttributeVisualizationEngine(viewport);

  /**
   * General initialization of the Interaction
   */

  // create the interactionEngine and provide it the viewport object
  interactionEngine = new InteractionEngine(viewport);

  // create the attributeSelectManager
  attributeSelectManager = new SelectManager();
  attributeSelectManager.deselectOnEmpty = false;

  /**
   *
   *
   * MATHIEU
   *
   * Note by Michael: We could actually switch to completely shaded (standard).
   * I think it looks better and the attributes can still be clearly separated.
   * I adjusted it the way I would do it, but feel free to do changes yourself.
   *
   *
   */

  // I just enabled some attributes to see everything at once
  // the first two cubes are not visualized via attributes
  attributeVisualizationEngine.updateAttributes([
    <IStringAttribute>{
      key: "x+y, string",
      type: SDTF_TYPEHINT.STRING,
      visualization: ATTRIBUTE_VISUALIZATION.GREEN_WHITE_RED
    }
  ]);

  // the effect when selecting, use either MaterialStandardData or MaterialUnlitData
  attributeSelectManager.effectMaterial = new MaterialStandardData({
    color: "#FFFF00"
  });

  // when not visualized, the layer option is used ('unlit' or 'standard')
  attributeVisualizationEngine.updateLayerMaterialType("standard");

  // the default material, use either MaterialStandardData or MaterialUnlitData
  attributeVisualizationEngine.updateDefaultMaterial(
    new MaterialStandardData({ color: "#666" })
  );

  // when visualized ('unlit' or 'standard')
  attributeVisualizationEngine.updateVisualizedMaterialType("standard");
})();
