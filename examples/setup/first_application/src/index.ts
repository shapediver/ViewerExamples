import { createSession, createViewport, ISessionApi } from "@shapediver/viewer";

const init = async () => {
  // create the viewport and connect it to the canvas
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport",
  });

  // create a session with your ticket and modelViewUrl
  // in this case we use one of our example models
  const session = await createSession({
    ticket: "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession",
  });

  // once the session is ready, bind it to our UI elements
  bindParameterUI(session);
  bindExportUI(session);
};

init();

const bindParameterUI = (session: ISessionApi) => {
  const slider = document.getElementById("width-slider") as HTMLInputElement;
  // fetch the parameter object by it's name that was given in GrassHopper
  const parameterApi = session.getParameterByName("Length")[0];

  // adjust the slider according to the parameter definition
  slider.min = parameterApi.min + "";
  slider.max = parameterApi.max + "";
  slider.value = parameterApi.value + "";
  slider.step = "1";

  slider.addEventListener("change", async () => {
    // Update the parameter and customize the session
    const newValue = parseInt(slider.value);
    parameterApi.value = newValue;
    await session.customize();
    console.log(`Updated width to: ${newValue}`);
  });
};

const bindExportUI = (session: ISessionApi) => {
  const downloadBtn = document.getElementById(
    "download-btn",
  ) as HTMLButtonElement;
  // Fetch the export object by its name that was given in GrassHopper
  const exportApi = session.getExportByName("Obj Export")[0];

  downloadBtn.addEventListener("click", async () => {
    // 1. Request the computation and file generation
    const result = await exportApi.request();

    // 2. Handle the result (the download link)
    const fileUrl = result.content![0].href;
    window.open(fileUrl, "_blank");
  });
};