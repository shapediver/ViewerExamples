import { createViewport, createSession } from "@shapediver/viewer";
import { createCustomUi, IBooleanElement, ISliderElement } from "@shapediver/viewer.shared.demo-helper";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewer"
  });
  // read out query parameters for "ticket" and "modelViewUrl"
  const urlParams = new URLSearchParams(window.location.search);
  const ticket = urlParams.get('ticket');
  const modelViewUrl = urlParams.get('modelViewUrl');

  const session = await createSession({
    id: 'mySession',
    ticket: ticket ?? 'aa8f99304bdad13693a123c9187a6a764c13345c448814ad7c70d79dae1b555b72795fbb2fd6faa368ff8cdee1368821771bec38f4b39c5e9fb7955be8c2b5f8f8da605fd4cdc1708402118ad706e8578a108c1fb6b6429f1e7279e19b12d0944a317848fa3ba8-78c86ce3f2f177c0b6ac5dafbb94e84e',
    modelViewUrl: modelViewUrl ?? 'https://sdr8euc1.eu-central-1.shapediver.com'
  });

  // create the parameter ui on the right side
  const uiDiv = document.createElement('div');
  uiDiv.style.position = 'absolute';
  uiDiv.style.top = '0';
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
