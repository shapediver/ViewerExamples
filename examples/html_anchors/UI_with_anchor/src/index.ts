import {
  HTMLElementAnchorData,
  HTMLElementAnchorCustomData,
  createSession,
  createViewport,
  sceneTree,
  ITreeNode,
  TreeNode
} from "@shapediver/viewer";
import { vec2, vec3 } from "gl-matrix";
import { createUi } from "./ui";

// function to create a HTMLElement at initialization
const create = (properties: {
  anchor: HTMLElementAnchorData;
  parent: HTMLDivElement;
}) => {
  // create the ui
  const uiDiv = document.createElement("div");
  uiDiv.style.position = "absolute";
  uiDiv.style.pointerEvents = "auto";

  // create the ui
  createUi(properties.anchor.data.session, uiDiv);
  properties.parent.appendChild(uiDiv);
};

// the update function that is called on every render call
// you can do anything here
const update = (properties: {
  anchor: HTMLElementAnchorData;
  htmlElement: HTMLDivElement;
  page: vec2;
  container: vec2;
  client: vec2;
  scale: vec2;
  hidden: boolean;
}) => {
  properties.htmlElement.style.display = "";
  // hide the htmlElement if the anchor is hidden
  if (properties.hidden) properties.htmlElement.style.display = "none";

  // calculate the position of the htmlElement
  let x = properties.container[0] - properties.htmlElement.offsetWidth / 2;
  let y = properties.container[1] - properties.htmlElement.offsetHeight / 2;

  // divide by the scaling factor
  x = x / properties.scale[0];
  y = y / properties.scale[1];

  // set the style for the html elements
  properties.htmlElement.style.left = x + "px";
  properties.htmlElement.style.top = y + "px";
};

(async () => {
  const viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });
  const session = await createSession({
    ticket:
      "367bfb32f99b1af97f567577657fcfc12ac3af1c5bb7ca219ba7cfa3c74d41329e40691d2d423c89a00c1354b17404565b0641074e21764c94f8c73ba782e6622a46b8c09ff3ec46616ed187002ac03d6881a5bde28afd4de18dfdb5aa55575b8ddb7ea3a59183-3da504eebfb78340ea4508e8b5350d0e",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // get the tower output
  const towerOutput = session.getOutputByName("Tower")[0];

  // create the htmlElementTreeNode
  const htmlElementTreeNode = new TreeNode("htmlElements");
  sceneTree.root.addChild(htmlElementTreeNode);
  sceneTree.root.updateVersion();

  const updateCallback = (newNode?: ITreeNode) => {
    if (!newNode) return;

    // remove all the current data in the htmlElementTreeNode
    while (htmlElementTreeNode.data.length > 0) htmlElementTreeNode.data.pop();

    // get the bounding box of the node and the center of the bounding box
    const bb = newNode.boundingBox;
    const center = bb.boundingSphere.center;

    // create the anchor at the right top of the bounding box
    const offset = 5;
    const rightTop: vec3 = vec3.fromValues(
      bb.max[0] + offset,
      center[1],
      bb.max[2] + offset
    );

    // create the anchor
    const customUiAnchor = new HTMLElementAnchorCustomData({
      location: rightTop,
      data: { session },
      create,
      update
    });
    htmlElementTreeNode.data.push(customUiAnchor);

    // update the version of the node
    htmlElementTreeNode.updateVersion();
  };

  // assign the update callback
  towerOutput.updateCallback = updateCallback;
  // and call it once in the beginning
  updateCallback(towerOutput.node);
})();
