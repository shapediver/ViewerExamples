import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

/**
 * Fetch the file from the url and download it with the given filename.
 * If a token is provided, it is used for authorization.
 *
 * @param url
 * @param filename
 * @param token
 */
const fetchFileWithToken = async (
  url: string,
  filename: string,
  token: string | null = null
) => {
  try {
    // fetch with the authorization token if provided
    const res = await fetch(url, {
      ...(token ? { headers: { Authorization: token } } : {})
    });

    // get the blob
    const blob = await res.blob();

    // download it
    const modelFile = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = modelFile;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.log(e);
  }
};

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

(async () => {
  const viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "7f65a5919e2892160ff323cb7bb56e69b044a42c3c233880353cff4ff5deb1a110e4de92a81a4f1ea94443942baa2225c0ca6bae2bcd32fc1fad254d2382187b8ab9de8a44373be0124dcfa5842a2f1bbd9b8892a79ac2124804bcee30bd789c6bfadf58277942-ccd33b2d9e3f873e20f2098936eb0361",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
  });

  // create a button
  const button = document.createElement("button");
  button.innerHTML = "Request Export with Screenshot";
  button.style.position = "absolute";
  button.style.top = "0";
  document.body.appendChild(button);

  // add event listener
  button.onclick = async () => {
    // take screenshot
    const screenshotData = viewport.getScreenshot();
    // for larger screen sizes taking a screenshot can take some time
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Convert the data URL to a Blob object
    const screenShotAsBlob = dataURLtoBlob(screenshotData);

    // Set the value of the file upload parameter to the screenshot
    const screenshotParameter = session.getParameterByName(
      "screenshot"
    )[0] as SDV.IFileParameterApi;
    screenshotParameter.value = screenShotAsBlob;
    const fileUploadId = await screenshotParameter.upload();

    // request the export
    const screenshotExport = session.getExportByName("screenshot")[0];

    const result = await screenshotExport.request({
      [screenshotParameter.name]: fileUploadId
    });
    if (result.content && result.content[0]) {
      console.log(result);
      const filename = `${result.filename}.${result.content[0].format}`;
      fetchFileWithToken(result.content[0].href, filename, session.jwtToken);
    } else {
      alert(result.msg);
    }
  };
})();
