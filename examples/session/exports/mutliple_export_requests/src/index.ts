

import { createViewport, createSession, ShapeDiverResponseExport } from "@shapediver/viewer";

const sendNotification = (title: string, message: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }
};

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

  // create a session
  const session = await createSession({
    ticket:
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // request the exports
  const result = await session.requestExports({
      exports: [
        session.getExportByName("Image Export")[0].id,
        session.getExportByName("Obj Export")[0].id
      ],
      parameters: {
        Length: 2
      }
  });

  for (const exportId in result.exports) {
    const exportResult = result.exports[exportId] as ShapeDiverResponseExport;

    if (exportResult.content && exportResult.content[0]) {
      console.log(exportResult);
      const filename = `${exportResult.filename}.${exportResult.content[0].format}`;
      fetchFileWithToken(exportResult.content[0].href, filename, session.jwtToken);
    } else {
      sendNotification("Export failed", exportResult.msg!);
    }
  }
})();
