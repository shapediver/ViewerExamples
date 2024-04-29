import { HTMLElementAnchorData } from "@shapediver/viewer";
import { createUi } from "@shapediver/viewer.shared.demo-helper";
import { vec2 } from "gl-matrix";

// function to create a HTMLElement at initialization
export const create = (properties: {
  anchor: HTMLElementAnchorData;
  parent: HTMLDivElement;
}) => {
  // create the ui
  const uiDiv = document.createElement("div");
  uiDiv.style.position = "absolute";
  uiDiv.style.pointerEvents = "auto";
  uiDiv.style.transformOrigin = "top left";
  const scaleFactor = 0.6;
  const translateXPercentage = -50;
  const adjustedTranslateX = `${translateXPercentage * scaleFactor}%`;
  const translateYPercentage = 20;
  const adjustedTranslateY = `${translateYPercentage * scaleFactor}%`;
  uiDiv.style.transform = `translateX(${adjustedTranslateX}) translateY(${adjustedTranslateY}) scale(${scaleFactor})`;

  // create the ui
  createUi(properties.anchor.data.session, uiDiv);
  properties.parent.appendChild(uiDiv);
};

// the update function that is called on every render call
// you can do anything here
export const update = (properties: {
  anchor: HTMLElementAnchorData;
  htmlElement: HTMLDivElement;
  page: vec2;
  container: vec2;
  client: vec2;
  scale: vec2;
  hidden: boolean;
}) => {
  properties.htmlElement.style.display = "";

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
