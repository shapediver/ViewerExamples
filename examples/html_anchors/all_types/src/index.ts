import {
  HTMLElementAnchorData,
  HTMLElementAnchorCustomData,
  IAnchorDataText,
  HTMLElementAnchorTextData,
  HTMLElementAnchorImageData,
  IAnchorDataImage,
  createSession,
  createViewport,
  sceneTree
} from "@shapediver/viewer";
import { vec2 } from "gl-matrix";

// function to create a HTMLElement at initialization
const create = (properties: {
  anchor: HTMLElementAnchorData;
  parent: HTMLDivElement;
}) => {
  const hotspotBtn = document.createElement("button");
  hotspotBtn.textContent = properties.anchor.data.btnText;

  hotspotBtn.style.pointerEvents = "auto";
  hotspotBtn.style.cursor = "pointer";

  properties.parent.appendChild(hotspotBtn);
  hotspotBtn.onclick = () => alert(properties.anchor.data.clickMsg);
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
  const x = properties.container[0] - properties.htmlElement.offsetWidth / 2;
  const y = properties.container[1] - properties.htmlElement.offsetHeight / 2;

  properties.htmlElement.style.left = x + "px";
  properties.htmlElement.style.top = y + "px";
};

(async () => {
  let viewport = await createViewport({
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    id: "myViewport"
  });
  let session = await createSession({
    ticket:
      "5dbb5117b630fb83a8056f06ee719f570a904be69ac45152822c327f33d21483a8dae9e3122ae17c992ea6b3e2b65af09ac9871dd83a263ef488e58b2c2260a07899418548bd4a8dcf1cff3ca33954c9e4c0fe60118f730d03c56b7e598eab908b34e16ba8625d-b5ac96869614191d8ada6725aba8fba6",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  const anchorDataCustom = new HTMLElementAnchorCustomData({
    location: [50, 0, 0],
    data: {
      clickMsg: "Hello!"
    },
    create,
    update
  });
  sceneTree.root.data.push(anchorDataCustom);

  const anchorDataText = new HTMLElementAnchorTextData({
    location: [-50, 0, 0],
    data: <IAnchorDataText>{
      color: "#ff0000",
      text: "Text Data"
    }
  });
  sceneTree.root.data.push(anchorDataText);

  const anchorDataImage = new HTMLElementAnchorImageData({
    location: [0, 50, 0],
    data: <IAnchorDataImage>{
      alt: "an image",
      src: "./images/icon2.png",
      width: 581 * 0.1, // scaling original width
      height: 280 * 0.1 // scaling original height
    }
  });
  sceneTree.root.data.push(anchorDataImage);

  sceneTree.root.updateVersion();
  viewport.update();
})();
