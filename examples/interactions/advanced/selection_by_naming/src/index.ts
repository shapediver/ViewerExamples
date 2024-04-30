import {
  createViewport,
  createSession,
  ITreeNode,
  MaterialUnlitData,
  viewports,
  sceneTree,
  IViewportApi,
  ISessionApi,
  FLAG_TYPE
} from "@shapediver/viewer";
import {
  HoverManager,
  InteractionData,
  InteractionEngine,
  SelectManager
} from "@shapediver/viewer.features.interaction";
import { createUi } from "@shapediver/viewer.shared.demo-helper";

enum MAIN_SELECTION_OPTIONS {
  FLOOR = "floor",
  WALL = "wall",
  INDIVIDUAL = "individual"
}

let viewport: IViewportApi;
let session: ISessionApi;
let interactionEngine: InteractionEngine;
let selectManager: SelectManager;
let hoverManager: HoverManager;

/**
 * Resets all interaction by removing the interaction data from all nodes in the scene and deselecting objects.
 */
const resetInteraction = () => {
  selectManager.deselect();
  sceneTree.root.traverse((n) => {
    n.data.forEach((d) => {
      if (d instanceof InteractionData) {
        n.removeData(d);
        n.updateVersion();
      }
    });
  });
};

/**
 * Create the selection UI that is displayed on the left side of the screen.
 *
 * In this UI the user can select which windows to select in two steps:
 * - First, the user selects if the selection should happen per floor, per wall or individually.
 * - Second, depending on the option selected in the first step, either all floors / walls are ready to be chosen, or in the case "individual" was chosen, all objects were already made selectable.
 *
 * Depending on what the user selects in these objects, the nodes with the corresponding naming scheme are searched for nodes where the name starts with "Window_" which are then made selectable.
 *
 * @param uiDiv
 * @param nodes
 */
const createSelectionUi = (
  uiDiv: HTMLDivElement,
  nodes: { floor: ITreeNode[]; wall: ITreeNode[]; window: ITreeNode[] }
) => {
  while (uiDiv.firstChild) uiDiv.removeChild(uiDiv.firstChild);

  uiDiv.classList.value =
    "code-preview rounded-xl bg-gradient-to-r bg-white border border-gray-900 dark:border-gray-700 p-2 sm:p-6 dark:bg-gray-500";

  /**
   * MAIN SELECTION
   */

  const mainSelectLabel = document.createElement("label");
  mainSelectLabel.innerText =
    "1. Select if you want to choose windows per floor, wall or individually:";
  mainSelectLabel.classList.value =
    "block mt-2 text-sm font-medium text-gray-900 dark:text-gray-300";
  uiDiv.appendChild(mainSelectLabel);

  // create the main selection dropdown
  const mainSelect = document.createElement("select");
  mainSelect.classList.value =
    "w-full mb-2 mt-2 right-5 text-gray-300 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-1 py-0.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800";
  uiDiv.appendChild(mainSelect);

  // add an empty option at the start
  const mainOptionEmpty = document.createElement("option");
  mainOptionEmpty.disabled = true;
  mainOptionEmpty.selected = true;
  mainOptionEmpty.style.display = "none";
  mainOptionEmpty.classList.value =
    "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-300";
  mainSelect.appendChild(mainOptionEmpty);

  // then fill it with the enum MAIN_SELECTION_OPTIONS
  for (let i = 0; i < Object.values(MAIN_SELECTION_OPTIONS).length; i++) {
    const option = document.createElement("option");
    option.value = i + "";
    option.innerHTML = Object.values(MAIN_SELECTION_OPTIONS)[i];
    option.classList.value =
      "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-300";
    mainSelect.appendChild(option);
  }

  mainSelect.onchange = () => {
    // reset all interaction
    resetInteraction();

    const mainSelectOption = Object.values(MAIN_SELECTION_OPTIONS)[
      +mainSelect.value
    ];

    if (mainSelectOption === MAIN_SELECTION_OPTIONS.INDIVIDUAL) {
      for (let i = 0; i < nodes.window.length; i++) {
        nodes.window[i].addData(
          new InteractionData({ select: true, hover: true })
        );
        nodes.window[i].updateVersion();
      }
    } else if (mainSelectOption === MAIN_SELECTION_OPTIONS.FLOOR) {
      for (let i = 0; i < nodes.floor.length; i++) {
        nodes.floor[i].addData(
          new InteractionData({ select: true, hover: true })
        );
        nodes.floor[i].updateVersion();
      }
    } else if (mainSelectOption === MAIN_SELECTION_OPTIONS.WALL) {
      // special case: we have to group the nodes as the scene tree hierarchy doesn't fit our use case here
      // the hierarchy is built with the scheme Floor_X.Wall_Y.Window_Z
      // which would result in the wall elements being separated by the floors if we use the previous approach
      // so to combine all nodes of a wall, we have to group all nodes with the same name

      // we store all nodes that are on the same wall in an array
      let wallGroups: { [key: string]: ITreeNode[] } = {};
      nodes.wall.forEach((w) =>
        wallGroups[w.name]
          ? wallGroups[w.name].push(w)
          : (wallGroups[w.name] = [w])
      );

      // then for each group (in this case, each wall), we apply the interaction data with the "groupId" being the wallGroup
      // all nodes with the same "groupId" are handled as one in the interactions
      for (let wallGroup in wallGroups) {
        for (let i = 0; i < wallGroups[wallGroup].length; i++) {
          wallGroups[wallGroup][i].addData(
            new InteractionData({ select: true, hover: true }, wallGroup)
          );
          wallGroups[wallGroup][i].updateVersion();
        }
      }
    }
  };
};

(async () => {
  viewport = await createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  session = await createSession({
    id: "mySession",
    ticket:
      "75a97b308e57d4f33fc6174605dac6425e81ebdba0a97829493c2377c0db56ab769dfae1db629eb4a6c8270e689ca7b65b9d555ffc7a87a912a574d8ffbc68fe7918d6a67679f5c8b0b74e011829025d007e02df04c196996ba2c5e9a9c22374af0bd538b087b2-303b1d280e1e6efd85d883087bbd3589",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  // continuously render to allow for better direct interactions
  viewport.addFlag(FLAG_TYPE.CONTINUOUS_RENDERING);

  // create the interaction engine and selection manager
  interactionEngine = new InteractionEngine(viewport);
  selectManager = new SelectManager();
  selectManager.deselectOnEmpty = false;
  selectManager.effectMaterial = new MaterialUnlitData({ color: "red" });
  interactionEngine.addInteractionManager(selectManager);
  hoverManager = new HoverManager();
  hoverManager.effectMaterial = new MaterialUnlitData({ color: "green" });
  interactionEngine.addInteractionManager(hoverManager);

  // create the parameter ui on the right side
  const parameterUiDiv = document.createElement("div");
  parameterUiDiv.style.position = "absolute";
  parameterUiDiv.style.width = "20rem";
  parameterUiDiv.style.right = "0%";
  document.body.appendChild(parameterUiDiv);
  createUi(session, parameterUiDiv);

  // create the selection ui on the right side
  const selectionUiDiv = document.createElement("div");
  selectionUiDiv.style.position = "absolute";
  selectionUiDiv.style.width = "20rem";
  selectionUiDiv.style.left = "0%";
  document.body.appendChild(selectionUiDiv);

  // callback to get all floor, wall and window nodes with the provided regex
  // then recreates the selection UI on the left side
  const cb = (newNode?: ITreeNode) => {
    if (!newNode) return;

    const floor = newNode.getNodesByNameWithRegex(new RegExp(/^Floor_\d+/));
    const wall = newNode.getNodesByNameWithRegex(new RegExp(/^Wall_\d+/));
    const window = newNode.getNodesByNameWithRegex(new RegExp(/^Window_\d+/));

    console.log({ floor, wall, window });
    createSelectionUi(selectionUiDiv, { floor, wall, window });
  };

  // assign this callback to be triggered whenever session updates happen
  session.updateCallback = cb;
  // and call it once at the start
  cb(session.node);
})();
