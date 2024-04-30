import { createViewport, EVENTTYPE } from "@shapediver/viewer";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewer",
    branding: {
      logo: "https://help.twitter.com/content/dam/help-twitter/brand/logo.png",
      backgroundColor: "#ff0000aa"
    }
  });
})();
