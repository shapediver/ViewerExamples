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

// function to create a HTMLElement at initialization
const create = (properties: {
  anchor: HTMLElementAnchorData;
  parent: HTMLDivElement;
}) => {
  // add the image element from the provided data
  const image = properties.anchor.data.image;
  properties.parent.appendChild(properties.anchor.data.image);

  if (properties.anchor.data.active) {
    // if the element is active, set the onclick function to the provided function
    image.onclick = properties.anchor.data.onclick;
    image.style.opacity = "1";
    image.style.pointerEvents = "auto";
    image.style.cursor = "pointer";
  } else {
    // if the element is not active, set the opacity to 0.5 and disable the pointer events
    image.onclick = undefined;
    image.style.opacity = "0.5";
    image.style.pointerEvents = "none";
    image.style.cursor = "not-allowed";
  }
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
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });
  viewport.clearColor = "#313131";

  // get the length parameter
  const lengthParameter = session.getParameterByName("Length")[0];

  // get the shelf output
  const shelfOutput = session.getOutputByName("Shelf")[0];

  // create the htmlElementTreeNode
  const htmlElementTreeNode = new TreeNode("htmlElements");
  sceneTree.root.addChild(htmlElementTreeNode);
  sceneTree.root.updateVersion();

  // create the left image
  const leftImage = document.createElement("img");
  leftImage.src = "./images/circle_add.svg";
  leftImage.style.mixBlendMode = "difference";
  leftImage.style.filter = "invert(1) grayScale(100%)";
  leftImage.width = 35;
  leftImage.height = 35;
  leftImage.onclick = () => {
    lengthParameter.value = (lengthParameter.value as number) + 1;
    // we set the property of "waitForViewportUpdate" to true here to get the calculated bounding box of the node
    session.customize(undefined, undefined, true);
  };

  // create the right image
  const rightImage = document.createElement("img");
  rightImage.src = "./images/circle_remove.svg";
  rightImage.style.mixBlendMode = "difference";
  rightImage.style.filter = "invert(1) grayScale(100%)";
  rightImage.width = 35;
  rightImage.height = 35;
  rightImage.onclick = () => {
    lengthParameter.value = (lengthParameter.value as number) - 1;
    // we set the property of "waitForViewportUpdate" to true here to get the calculated bounding box of the node
    session.customize(undefined, undefined, true);
  };

  const updateCallback = (newNode?: ITreeNode) => {
    if (!newNode) return;

    // get the bounding box of the node and the center of the bounding box
    const bb = newNode?.boundingBox;
    const center = bb.boundingSphere.center;

    // remove all the current data in the htmlElementTreeNode
    while (htmlElementTreeNode.data.length > 0) htmlElementTreeNode.data.pop();

    const offset = 5;
    // calculate the left most and the right most point of the bounding box center on their side
    const left: vec3 = vec3.fromValues(
      bb.min[0] - offset,
      center[1],
      center[2]
    );
    const right: vec3 = vec3.fromValues(
      bb.max[0] + offset,
      center[1],
      center[2]
    );

    // create the left anchor which increases the length
    const leftAnchor = new HTMLElementAnchorCustomData({
      location: left,
      data: {
        image: leftImage,
        onclick: () => {
          lengthParameter.value = (lengthParameter.value as number) + 1;
          // we set the property of "waitForViewportUpdate" to true here to get the calculated bounding box of the node
          session.customize(undefined, undefined, true);
        },
        active: (lengthParameter.value as number) < lengthParameter.max!
      },
      create,
      update
    });
    htmlElementTreeNode.data.push(leftAnchor);

    // create the right anchor which decreases the length
    const rightAnchor = new HTMLElementAnchorCustomData({
      location: right,
      data: {
        image: rightImage,
        onclick: () => {
          lengthParameter.value = (lengthParameter.value as number) - 1;
          // we set the property of "waitForViewportUpdate" to true here to get the calculated bounding box of the node
          session.customize(undefined, undefined, true);
        },
        active: (lengthParameter.value as number) > lengthParameter.min!
      },
      create,
      update
    });
    htmlElementTreeNode.data.push(rightAnchor);

    // update the version of the node
    htmlElementTreeNode.updateVersion();
  };

  // assign the update callback
  shelfOutput.updateCallback = updateCallback;
  // and call it once in the beginning
  updateCallback(shelfOutput.node);
})();
