import {
  FLAG_TYPE,
  IDirectionalLightApi,
  IViewportApi,
  createSession,
  createViewport
} from "@shapediver/viewer";
import { createCardinalDirectionsText } from "./createCardinalDirectionsText";
import { vec3 } from "gl-matrix";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SunCalc = require("suncalc");

const slider = document.getElementById("timeSlider") as HTMLInputElement;
const sliderLabel = document.getElementById("timeLabel") as HTMLLabelElement;
const dateInput = document.getElementById("datePicker") as HTMLInputElement;

/**
 * Set the light intensity and direction for a specific time of the day
 * If the time is before sunrise or after sunset, the light intensity is set to 0
 *
 * @param directionalLightApi
 * @param day
 * @param time
 * @param longitude
 * @param latitude
 */
const setLightForTime = (
  directionalLightApi: IDirectionalLightApi,
  day: Date,
  time: Date,
  longitude: number,
  latitude: number
) => {
  const times = SunCalc.getTimes(day, longitude, latitude);
  if (
    time.getTime() < times.sunrise.getTime() ||
    time.getTime() > times.sunset.getTime()
  ) {
    // before sunrise or after sunset
    directionalLightApi.intensity = 0;
  } else {
    // during the day
    directionalLightApi.intensity = 3.5;
    const currentSunPosition = SunCalc.getPosition(time, longitude, latitude);
    // the direction of the light is the opposite of the sun position
    const currentDirection = vec3.fromValues(
      -Math.cos(currentSunPosition.altitude) *
        Math.sin(currentSunPosition.azimuth),
      -Math.cos(currentSunPosition.altitude) *
        Math.cos(currentSunPosition.azimuth),
      Math.sin(currentSunPosition.altitude)
    );
    directionalLightApi.direction = currentDirection;
  }
};

/**
 * Simulate the sun movement from sunrise to sunset
 *
 * @param viewport
 * @param directionalLightApi
 * @param day
 * @param longitude
 * @param latitude
 */
const runDayLightAnimation = async (
  viewport: IViewportApi,
  directionalLightApi: IDirectionalLightApi,
  day: Date,
  longitude: number,
  latitude: number
) => {
  // add a flag to keep rendering the scene
  const token = viewport.addFlag(FLAG_TYPE.CONTINUOUS_RENDERING);

  const times = SunCalc.getTimes(day, longitude, latitude);
  let currentTime: Date = times.sunrise;
  const difference = times.sunset.getTime() - times.sunrise.getTime();

  // simulate the sun movement every 15 minutes
  for (let i = 0; i < difference; i += 15 * 60 * 1000) {
    // add 15 minutes
    currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
    sliderLabel.innerText = currentTime.toLocaleTimeString();
    setLightForTime(directionalLightApi, day, currentTime, longitude, latitude);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  viewport.removeFlag(token);
};

(async () => {
  const viewport = await createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await createSession({
    id: "mySession",
    ticket:
      "69a4dc1ce5e4dfaead377ecc11cab406aa6b7526d783710bd268d91523afd17d54d3696546a8b85fcec7c3e7a985554cb0dbc8b1c2cdfc6bae99f9f1c9ed1774d6eca60d592eaa9917538cae58ced3847520b83214cfef97fda953204f138d3039a70a8530b160-e970a72206f2cd19064a28005c2e2b42",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  // get the bounding sphere of the model
  const bb = session.node.boundingBox;
  const bs = bb.boundingSphere;
  // create the cardinal directions text
  await createCardinalDirectionsText(bs);

  // create a light scene and assign it to the viewport
  const lightScene = viewport.createLightScene();
  viewport.assignLightScene(lightScene.id);

  // add a hemisphere light and a directional light to the scene
  lightScene.addHemisphereLight({
    color: "#ffda6d",
    groundColor: "#6c39ff",
    intensity: 0.25
  });
  const directionalLightApi = lightScene.addDirectionalLight({
    color: "#ffffff",
    intensity: 3.5,
    direction: [0, 0, 1]
  });

  // the location of Vienna
  const longitude = 48.209996838454195;
  const latitude = 16.37047607073397;

  // the current date at 12:00
  let date = new Date(new Date().setHours(12, 0, 0, 0));
  let startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
  let endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

  /**
   * Calculate the time of the day at the slider position
   * and set the light intensity and direction accordingly
   */
  const calculateTimeAtSlider = () => {
    const difference = endOfDay.getTime() - startOfDay.getTime();
    const dateAtSlider = new Date(
      startOfDay.getTime() + difference * parseFloat(slider.value)
    );
    setLightForTime(
      directionalLightApi,
      date,
      dateAtSlider,
      longitude,
      latitude
    );
  };
  calculateTimeAtSlider();

  // set the slider label and update the light when the slider value changes
  sliderLabel.innerText = new Date(
    startOfDay.getTime() +
      (endOfDay.getTime() - startOfDay.getTime()) * parseFloat(slider.value)
  ).toLocaleTimeString();
  slider.onchange = () => {
    sliderLabel.innerText = new Date(
      startOfDay.getTime() +
        (endOfDay.getTime() - startOfDay.getTime()) * parseFloat(slider.value)
    ).toLocaleTimeString();
    calculateTimeAtSlider();
  };

  // set the date input and update the light when the date changes
  dateInput.value = new Date().toISOString().split("T")[0];
  dateInput.onchange = () => {
    date = new Date(new Date(dateInput.value).setHours(12, 0, 0, 0));
    startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
    endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));
    calculateTimeAtSlider();
  };

  // start the sun simulation when the button is clicked
  const startSunSimulation = document.getElementById(
    "startSunSimulation"
  ) as HTMLButtonElement;
  startSunSimulation.onclick = async () => {
    slider.disabled = true;
    dateInput.disabled = true;

    await runDayLightAnimation(
      viewport,
      directionalLightApi,
      date,
      longitude,
      latitude
    );

    slider.disabled = false;
    dateInput.disabled = false;

    // reset the slider and date input
    sliderLabel.innerText = new Date(
      startOfDay.getTime() +
        (endOfDay.getTime() - startOfDay.getTime()) * parseFloat(slider.value)
    ).toLocaleTimeString();
    calculateTimeAtSlider();
  };
})();
