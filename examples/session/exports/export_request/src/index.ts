

import { createViewport, createSession } from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });

  // create a session
  const session = await createSession({
    ticket:
      "8ce890f7447c73b7a94291d3a56fb4718c424f923c7034eb64be5bde7119645dbdb60a505f135c9c93bc8555279554b10602a3a6587fc47f161c6c11d3eaa88145d815f3fe515c263e11096ba409377f1afacfc72cca1958da9c3590b34f721bc25f060d0334c5-eaa53de53d8d9507e504a4fe387afc6d",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // read out the export with the specific name
  const exportObject = session.getExportByName("Export3DModel")[0];

  // request the export
  console.log(await exportObject.request());
})();
