import { createViewport, createSession } from "@shapediver/viewer";

const viewportDiv = document.getElementById("viewportDiv");

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    viewportDiv?.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

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

  // add a button to toggle fullscreen
  const fullscreenButton = document.createElement("button");
  fullscreenButton.textContent = "Toggle Fullscreen";
  fullscreenButton.style.position = "absolute";
  fullscreenButton.onclick = toggleFullscreen;
  viewportDiv?.append(fullscreenButton);
})();
