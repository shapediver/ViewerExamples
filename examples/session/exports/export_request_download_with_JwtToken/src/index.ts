

import { createViewport, createSession } from "@shapediver/viewer";

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
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });

  // this is where you have to supply your jwtToken so that
  // it can be used for the session creation and the export request
  // https://help.shapediver.com/doc/geometry-backend#GeometryBackend-Authorization
  const jwtToken = "";

  // create a session
  const session = await createSession({
    ticket:
      "8ce890f7447c73b7a94291d3a56fb4718c424f923c7034eb64be5bde7119645dbdb60a505f135c9c93bc8555279554b10602a3a6587fc47f161c6c11d3eaa88145d815f3fe515c263e11096ba409377f1afacfc72cca1958da9c3590b34f721bc25f060d0334c5-eaa53de53d8d9507e504a4fe387afc6d",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    jwtToken,
    id: "mySession"
  });

  // read out the export with the specific name
  const exportObject = session.getExportByName("Export3DModel")[0];

  // request the export
  const exportResult = await exportObject.request();

  // if there is conten to download, fetch it
  if (exportResult.content && exportResult.content[0]) {
    const filename = `${exportResult.filename}.${exportResult.content[0].format}`;
    fetchFileWithToken(exportResult.content[0].href, filename, jwtToken);
  } else {
    console.log(exportResult.msg);
  }
})();
