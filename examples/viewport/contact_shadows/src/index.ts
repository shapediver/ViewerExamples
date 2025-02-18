import { createViewport, createSession } from "@shapediver/viewer";
import { createCustomUi, IBooleanElement, ISliderElement } from "@shapediver/viewer.shared.demo-helper";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewer"
  });

  // create a session
  const session = await createSession({
    ticket:
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create the parameter ui on the right side
  const uiDiv = document.createElement('div');
  uiDiv.style.position = 'absolute';
  uiDiv.style.width = '20rem';
  document.body.appendChild(uiDiv);
  createCustomUi([
    <IBooleanElement>{
      type: 'boolean',
      value: viewport.contactShadowVisibility,
      name: 'visibility',
      onChangeCallback: async (value: boolean) => {
        viewport.contactShadowVisibility = value;
      }
    },
    <ISliderElement>{
      type: 'slider',
      value: viewport.contactShadowHeight,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'contactShadowHeight',
      onChangeCallback: async (value: number) => {
        viewport.contactShadowHeight = +value;
        viewport.update();
      }
    },
    <ISliderElement>{
      type: 'slider',
      value: viewport.contactShadowDarkness,
      min: 0,
      max: 10,
      step: 0.01,
      name: 'contactShadowDarkness',
      onChangeCallback: async (value: number) => {
        viewport.contactShadowDarkness = +value;
      }
    },
    <ISliderElement>{
      type: 'slider',
      value: viewport.contactShadowBlur,
      min: 0,
      max: 10,
      step: 0.01,
      name: 'contactShadowBlur',
      onChangeCallback: async (value: number) => {
        viewport.contactShadowBlur = +value;
      }
    },
    <ISliderElement>{
      type: 'slider',
      value: viewport.contactShadowOpacity,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'contactShadowOpacity',
      onChangeCallback: async (value: number) => {
        viewport.contactShadowOpacity = +value;
      }
    }
  ], uiDiv);
})();
