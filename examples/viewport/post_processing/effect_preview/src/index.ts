import * as SDV from "@shapediver/viewer";
import {
  createSession,
  createViewport,
  POST_PROCESSING_EFFECT_TYPE
} from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "95aa45115f2bfa0e9501127bf9c9f392c977792e44c62c6b2a5575133426c4066ead20626932b8c199eec88594bbc03a80854a6d06f3db775880a00df465c8bd3e53dd290464b51c69f4afad03e8bbe80f0a70b7dc9896a43ca4c75eaa97dc11713e1bacd650d1-6c09ff8204f1fce099cde4b86dd74ba5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  const hbaoEffectToken = viewport.postProcessing.addEffect({
    properties: {
      intensity: 7
    },
    type: POST_PROCESSING_EFFECT_TYPE.HBAO
  });

  const bloomEffectToken = viewport.postProcessing.addEffect({
    properties: {
      intensity: 1.5,
      luminanceThreshold: 0.5,
      kernelSize: SDV.KernelSize.HUGE
    },
    type: POST_PROCESSING_EFFECT_TYPE.BLOOM
  });

  const hueSaturationEffectToken = viewport.postProcessing.addEffect({
    properties: {
      saturation: -1
    },
    type: POST_PROCESSING_EFFECT_TYPE.HUE_SATURATION
  });

  const vignetteEffectToken = viewport.postProcessing.addEffect({
    type: POST_PROCESSING_EFFECT_TYPE.VIGNETTE
  });
})();
