

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
      "3ba64ce05a6eeb74681d5afb782d7bd14dd5f5c040d133c10a9a33c194d62f35dd04cf1e35606eb03dfd9ed8f6674896d3c6ae2a837e0ae5396d69ab39eb44a4b477a7d4e36b9733145998ec4ccb8bc7daef039cbe2d127b846271896b265e3d1f274e418baeb8-e6b7a5d50d457a08acc2bf82da080191",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // "getOutputByName" returns an array with all outputs that have the desired name
  const dataOutput = session.getOutputByName("NumberOfSeats")[0];
  console.log("How many seats are there?", dataOutput.content![0].data);
})();
