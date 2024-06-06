

import {
  createViewport,
  createSession,
  IFileParameterApi,
  generalOptions,
  LOGGING_LEVEL
} from "@shapediver/viewer";

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

(async () => {
  generalOptions.loggingLevel = LOGGING_LEVEL.DEBUG;

  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "c69f63675005e5ab1ae445e6ceb87ec4aabd45902b2af2bc7ace7edaeb369124e5925df416c5f40dc4014cc328a548ad13d0131efffa10ef85cdd4531a373aefe96edc746a4508c15df88d23395da5479aa23884f2cafbbabff110d4071a748da12c5a2fb63b4a-641f296d59b353ab1efc90c24fad7d88",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // get the file input parameter
  const fileInputParameter = session.getParameterByName(
    "Image Import"
  )[0] as IFileParameterApi;

  // load some data
  const result = await (
    await fetch("https://viewer.shapediver.com/v3/graphics/logo.png")
  ).blob();

  // set the value of the file input
  fileInputParameter.value = result;

  // upload the file manually
  // this would normally be done in the session.customize call
  const fileUploadId = await fileInputParameter.upload();

  // set the received fileUploadId in the export request
  // here you can also set other parameter values as well
  // this allows to not do a customization request before the export
  const response = await session.getExportByName("Image Export")[0].request({
    [fileInputParameter.id]: fileUploadId
  });

  if (response.content && response.content[0]) {
    console.log(result);
    const filename = `${response.filename}.${response.content[0].format}`;
    fetchFileWithToken(response.content[0].href, filename, session.jwtToken);
  } else {
    alert(response.msg);
  }
})();
