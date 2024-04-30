import * as SDV from "@shapediver/viewer";
import {
  IBooleanElement,
  ISliderElement,
  createCustomUi
} from "@shapediver/viewer.shared.demo-helper";
import { vec3 } from "gl-matrix";

(<any>window).SDV = SDV;

(async () => {
  const viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "d9c181b3630dfc0e75ea5a3cdf02e49407b7d66ced76115b4b01483b2dcdb8c2d15954e838d18255eda373886d5e65bef3169a70ae9b6545b8ad300ed295658de46b3f63d7c0308982c924986ad340759b3045ff0d0ab0e14c011f04fc1b36439de0c025160caf-3846c521aadb064f8dccae2b3989cf22",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  const tokens = viewport.postProcessing.getEffectTokens();
  Object.keys(tokens).forEach((t) => viewport.postProcessing.removeEffect(t));

  const camera = viewport.camera! as SDV.IPerspectiveCameraApi;

  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "0%";
  div.style.left = "0%";
  div.style.width = "20rem";
  document.body.appendChild(div);
  createCustomUi(
    [
      <IBooleanElement>{
        type: "boolean",
        name: "enableTurntableControls",
        onChangeCallback: (value: boolean) => {
          camera.enableTurntableControls = value;
        },
        value: false
      },
      <IBooleanElement>{
        type: "boolean",
        name: "enablePolarRotation",
        onChangeCallback: (value: boolean) => {
          camera.enablePolarRotation = value;
        },
        value: true
      },
      <ISliderElement>{
        type: "slider",
        name: "minPolarAngle",
        onChangeCallback: (value: number) => {
          camera.rotationRestriction.minPolarAngle = value;
        },
        value: 0,
        min: 0,
        max: 180,
        step: 0.1
      },
      <ISliderElement>{
        type: "slider",
        name: "maxPolarAngle",
        onChangeCallback: (value: number) => {
          camera.rotationRestriction.maxPolarAngle = value;
        },
        value: 180,
        min: 0,
        max: 180,
        step: 0.1
      },
      <IBooleanElement>{
        type: "boolean",
        name: "enableAzimuthRotation",
        onChangeCallback: (value: boolean) => {
          camera.enableAzimuthRotation = value;
        },
        value: true
      },
      <ISliderElement>{
        type: "slider",
        name: "minAzimuthAngle",
        onChangeCallback: (value: number) => {
          camera.rotationRestriction.minAzimuthAngle = value;
        },
        value: -360,
        min: -360,
        max: 360,
        step: 0.1
      },
      <ISliderElement>{
        type: "slider",
        name: "maxAzimuthAngle",
        onChangeCallback: (value: number) => {
          camera.rotationRestriction.maxAzimuthAngle = value;
        },
        value: 360,
        min: -360,
        max: 360,
        step: 0.1
      },
      <ISliderElement>{
        type: "slider",
        name: "turntable center - x",
        onChangeCallback: (value: number) => {
          camera.turntableCenter = vec3.fromValues(
            value,
            camera.turntableCenter[1],
            camera.turntableCenter[2]
          );
        },
        value: 0,
        min: -15,
        max: 15,
        step: 0.1
      },
      <ISliderElement>{
        type: "slider",
        name: "turntable center - y",
        onChangeCallback: (value: number) => {
          camera.turntableCenter = vec3.fromValues(
            camera.turntableCenter[0],
            value,
            camera.turntableCenter[2]
          );
        },
        value: 0,
        min: -15,
        max: 15,
        step: 0.1
      },
      <ISliderElement>{
        type: "slider",
        name: "turntable center - z",
        onChangeCallback: (value: number) => {
          camera.turntableCenter = vec3.fromValues(
            camera.turntableCenter[0],
            camera.turntableCenter[1],
            value
          );
        },
        value: 0,
        min: -15,
        max: 15,
        step: 0.1
      }
    ],
    div
  );
})();
