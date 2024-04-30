import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  const viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "3b5fbadd8b20ede476feeba00fa2aaebde1e3d9500b6ff87c30da56afd9fac39a435d0cb08de109c9857f7a626a2a275b9902678ead17b9596119142562aa75bca8efa7cbe646577811c9b0e0c7a30f91f06a81ec50fe63cb7bc3bce8c7fd625fd20f14cd3273f-5ac2798236496b0fd3df167bc1f00a76",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  });

  // wait until the first beauty rendering kicks in
  await new Promise((resolve) =>
    SDV.addListener(SDV.EVENTTYPE.RENDERING.BEAUTY_RENDERING_FINISHED, resolve)
  );

  // get the file upload parameter
  const fileUploadParameter = session.getParameterByName("ImportBmp")[0];

  // take a screenshot
  const screenshotAsDataURL = viewport.getScreenshot();

  // Convert the data URL to a Blob object
  const dataURLtoBlob = (dataURL: string) => {
    // Split the data URL to get the base64 data
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = window.atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // Convert the binary string to a Uint8Array
    while (n--) u8arr[n] = bstr.charCodeAt(n);

    // Create a Blob object from the Uint8Array
    return new Blob([u8arr], { type: mime });
  };

  // Convert the data URL to a Blob object
  const screenShotAsBlob = dataURLtoBlob(screenshotAsDataURL);

  // Set the value of the file upload parameter to the screenshot
  fileUploadParameter.value = screenShotAsBlob;

  // Update the session
  await session.customize();
})();
