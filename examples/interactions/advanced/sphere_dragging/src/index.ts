import {
  addListener,
  createViewport,
  createSession,
  MaterialUnlitData,
  ITreeNode,
  EVENTTYPE
} from "@shapediver/viewer";
import {
  DragManager,
  HoverManager,
  InteractionData,
  InteractionEngine,
  PlaneConstraint
} from "@shapediver/viewer.features.interaction";
import { createUi } from "@shapediver/viewer.shared.demo-helper";
import { vec3 } from "gl-matrix";

// get all nodes that fir the regex in the descendents of the provided node
const getNodesByNameWithRegex = (node: ITreeNode, regex: RegExp) => {
  let nodes: ITreeNode[] = [];
  node.traverse((n) => {
    if (regex.test(n.name)) nodes.push(n);
  });
  return nodes;
};

(async () => {
  // create the viewport
  const viewport = await createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  // create the session
  const session = await createSession({
    id: "mySession",
    ticket:
      "c6fd808fc35da44349265344b630b1993e1bc7e61af71cf8340990b7ea506464a75d3f248fa4cf66702628ac925e86ba4b6aed5e170311a0e13bdf88a7760b62c6c5a6cebb27144176f18366708db09a4bee33b53195bfbb76c1c68c27cffddb2e05765598891f-bf3760fe26a6f272687fb7077a1f4ac0",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  // create the interaction engine, drag manager and hover manager
  const interactionEngine = new InteractionEngine(viewport);

  // create the drag manager and add a place constraint
  const dragManager = new DragManager();
  dragManager.effectMaterial = new MaterialUnlitData({ color: "red" });
  dragManager.addDragConstraint(new PlaneConstraint(vec3.fromValues(0, 0, 1)));
  interactionEngine.addInteractionManager(dragManager);

  // add a hover manager
  const hoverManager = new HoverManager();
  hoverManager.effectMaterial = new MaterialUnlitData({ color: "green" });
  interactionEngine.addInteractionManager(hoverManager);

  // we hide the points parameter as we do this via interactions
  session.getParameterByName("Points")[0].hidden = true;

  // create the parameter ui on the right side
  const parameterUiDiv = document.createElement("div");
  parameterUiDiv.style.position = "absolute";
  parameterUiDiv.style.width = "20rem";
  parameterUiDiv.style.right = "0%";
  document.body.appendChild(parameterUiDiv);
  createUi(session, parameterUiDiv);

  // retrieve the sphere output
  const sphereOutput = session.getOutputByName("Spheres")[0];

  let sphereNodes: ITreeNode[] = [];
  // callback to assign interaction data
  const cb = (newNode?: ITreeNode) => {
    if (!newNode) return;

    // retrieve all sphere nodes that fit the naming scheme
    sphereNodes = getNodesByNameWithRegex(newNode, /^sphere_\d+/);
    // sort them, just to be sure
    sphereNodes.sort(
      (a, b) => +a.name.replace("sphere_", "") - +b.name.replace("sphere_", "")
    );
    // assign the interaction data
    sphereNodes.forEach((n) => {
      // check if the interaction data was already assigned
      // this can happen if the customization didn't update the specific node
      if (!n.data.find((d) => d instanceof InteractionData)) {
        n.addData(new InteractionData({ hover: true, drag: true }));
        n.updateVersion();
      }
      n.updateVersion();
    });
  };

  // assign this callback to be triggered whenever output updates happen
  sphereOutput.updateCallback = cb;
  // and call it once at the start
  cb(sphereOutput.node);

  // whenever the dragging stops create the input for the parameter und customize the session
  addListener(EVENTTYPE.INTERACTION.DRAG_END, async () => {
    session.getParameterByName("Points")[0].value = JSON.stringify({
      points: sphereNodes.map((n) => [
        n.boundingBox.boundingSphere.center[0],
        n.boundingBox.boundingSphere.center[1],
        n.boundingBox.boundingSphere.center[2]
      ])
    });
    await session.customize();
  });
})();
