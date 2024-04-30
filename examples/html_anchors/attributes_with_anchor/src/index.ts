import {
  HTMLElementAnchorData,
  HTMLElementAnchorCustomData,
  createSession,
  createViewport,
  sceneTree,
  ITreeNode,
  TreeNode,
  SDTFItemData
} from "@shapediver/viewer";
import { vec2, vec3 } from "gl-matrix";

// function to create a HTMLElement at initialization
const create = (properties: {
  anchor: HTMLElementAnchorData;
  parent: HTMLDivElement;
}) => {
  // add a div in which we display the text
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.backgroundColor = "slategrey";
  div.style.color = "white";
  div.style.borderRadius = "8px";
  div.style.fontSize = "14px";
  div.style.fontFamily = "Arial, sans-serif";
  properties.parent.appendChild(div);

  // add a p element to display the text
  const p = document.createElement("p");
  p.style.margin = "0";
  p.style.padding = "5px";
  p.innerHTML = properties.anchor.data.text;
  div.appendChild(p);
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
      "97acc7d1853e3c1d3cad0c5ac91e114c5a8d2202a875fddff7120cd3195daf30515617cbfe4ff41e2894b8ae290b8386b835bf2ab0262940c9837759fbeedfde7f4f0789f9a7e5aa8a5827ec0938472a8abedd53a85c66b37220549949ac3e3dd46285a3a25275-337f3440a41082cbb7ef21c92b1529da",
    modelViewUrl: "https://sddev3.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create the htmlElementTreeNode
  const htmlElementTreeNode = new TreeNode("htmlElements");
  sceneTree.root.addChild(htmlElementTreeNode);
  sceneTree.root.updateVersion();

  const updateCallback = (newNode?: ITreeNode) => {
    if (!newNode) return;

    // remove all the current data in the htmlElementTreeNode
    while (htmlElementTreeNode.data.length > 0) htmlElementTreeNode.data.pop();

    newNode.traverse((node) => {
      for (const data of node.data) {
        if (data instanceof SDTFItemData) {
          const sdTFItemData = data as SDTFItemData;
          if (
            sdTFItemData.attributes["Level Height"] &&
            sdTFItemData.attributes["Floor Area"]
          ) {
            // get the bounding box of the node and the center of the bounding box
            const bb = node.boundingBox;
            const center = bb.boundingSphere.center;

            // create the anchor at the right of the bounding box
            const offset = 100;
            const right: vec3 = vec3.fromValues(
              bb.max[0] + offset,
              center[1],
              center[2]
            );

            // round the values
            const levelHeightRounded =
              Math.round(sdTFItemData.attributes["Level Height"].value * 100) /
              100;
            const floorAreaRounded =
              Math.round(sdTFItemData.attributes["Floor Area"].value * 100) /
              100;

            // create the anchor
            const customTextAnchor = new HTMLElementAnchorCustomData({
              location: right,
              data: {
                text: `Level Height: ${levelHeightRounded}<br>Floor Area: ${floorAreaRounded}`
              },
              create,
              update
            });
            htmlElementTreeNode.data.push(customTextAnchor);

            // update the version of the node
            htmlElementTreeNode.updateVersion();
          }
        }
      }
    });
  };

  // assign the update callback
  session.updateCallback = updateCallback;
  // and call it once in the beginning
  updateCallback(session.node);
})();
