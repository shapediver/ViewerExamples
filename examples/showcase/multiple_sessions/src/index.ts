import { create, update } from "./ui";
import {
  createSession,
  createViewport,
  HTMLElementAnchorCustomData,
  ISessionApi,
  ITreeNode,
  SESSION_SETTINGS_MODE,
  sessions,
  VISIBILITY_MODE
} from "@shapediver/viewer";
import { mat4, vec3 } from "gl-matrix";

const models: {
  ticket: string;
  modelViewUrl: string;
  scale?: number;
}[] = [
  {
    ticket:
      "69b81f2b2d2f2f803c90cf1bd8fc826decedf34b8cc32c61056712eb955a16aad23e3b56000c4187bef164d3868e3e47a0f4a3f1f93a8eaeb75cf8848d042388f06ef1b7baf0511ad9a5a93c91240aa6abc7ede8add5a2e54f23f431e4fd8c2db4b57568e70190-dd7a9b34a2476bf506aa7c1047468c9d",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    scale: 0.5
  },
  {
    ticket:
      "03fb98fed9b4616478f802621e58a37d673b9d1ae243ac2cdc7b4a0f7e7468f0597c70e205fbd71ee6a46e56cdda92686d21ca851fb85228f4bc81a5041e1929b3958c11d2e7ad7f064d7e46c88d00bc88f9bdc50934dd45c7ccc437b65875f0380a5e5df7dabb-6e6e2dca66e788d0510e933ba592425f",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    scale: 0.6
  },
  {
    ticket:
      "72a4305455093300dc2605971f981476b32264ad4825bb4d3516100cd2e0002e2b2b1ba685a18ce10ffea0f198ec74407b7c307bb8a44f94f815b8295b8be8799429d0228c4b7cbe45562bbe8d9fcd93056854bcf8f2056de068afc32644d393abad08bc6aa0a7-e786759cd92500df46be12e74fdb833a",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    scale: 0.4
  },
  {
    ticket:
      "c72745aadb065c8882f8249ba8203aa49a57c974dff33c4e80b324570b880ae908d35bbc99c84c23d45c6df34e8cae3f2994836f5ba971903915de5bb81845d83948d386557315694a16d7d0bcca0cff84f80c4e0df7751c0393e5bdd59d7dd84b021beece3fb0-3e73af9b03a772f3f3e536386f44ef93",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com"
  }
];

/**
 * Center and scale the model
 * If the scale is not defined, the model will not be scaled
 * (this is the case for the last model which includes the city geometry)
 *
 * @param node
 * @param center
 * @param scale
 * @returns
 */
const centerAndScale = (node: ITreeNode, center: vec3, scale?: number) => {
  if (!scale) return;

  const transformation = mat4.create();
  // scale the model and move it to the center
  mat4.translate(transformation, transformation, center);
  mat4.scale(transformation, transformation, [scale, scale, scale]);

  node.addTransformation({
    id: "centerAndScale",
    matrix: transformation
  });
};

/**
 * Update the UI
 * Remove the existing UI and add a new one
 *
 * @param session
 * @param node
 * @param center
 */
const updateUi = (session: ISessionApi, node: ITreeNode, center: vec3) => {
  for (let i = 0; i < node.data.length; i++) {
    if (node.data[i] instanceof HTMLElementAnchorCustomData) {
      // remove
      node.data.splice(i, 1);
      i--;
    }
  }

  const customUiAnchor = new HTMLElementAnchorCustomData({
    location: center,
    data: { session },
    hideable: false,
    create,
    update
  });
  node.data.push(customUiAnchor);
};

/**
 * Add a callback to the session
 * First update the UI and then center and scale the model
 *
 * @param session
 * @param center
 * @param uiOffset
 * @param scale
 */
const addCallback = (
  session: ISessionApi,
  center: vec3,
  uiOffset: vec3,
  scale?: number
) => {
  const callback = (newNode?: ITreeNode) => {
    if (!newNode) return;

    updateUi(session, newNode, vec3.add(vec3.create(), center, uiOffset));
    centerAndScale(newNode, center, scale);
    newNode.updateVersion();
  };
  session.updateCallback = callback;
  callback(session.node);
};

(async () => {
  // create the viewport
  // the visibility is set to manual, so the viewport will not be shown until the show property is set to true
  // the session settings mode is set to manual, so that we can specify the session settings id
  const viewport = await createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas"),
    visibility: VISIBILITY_MODE.MANUAL,
    sessionSettingsId: "session_3",
    sessionSettingsMode: SESSION_SETTINGS_MODE.MANUAL
  });

  const promises: Promise<ISessionApi>[] = [];

  // create the sessions
  models.forEach((model, i) => {
    promises.push(
      createSession({
        id: `session_${i}`,
        ticket: model.ticket,
        modelViewUrl: model.modelViewUrl
      })
    );
  });

  // wait until all sessions are created
  await Promise.all(promises);

  // get the session_3, which contains the city geometry and the centers of the towers
  const session_3 = sessions["session_3"];

  // get the centers of the towers
  const centers: vec3[] = session_3.getOutputByName("centers")[0].content![0]
    .data;

  // calculate the direction between the centers so that we can offset the UI
  const centerDirection = vec3.normalize(
    vec3.create(),
    vec3.sub(vec3.create(), centers[3], centers[0])
  );

  // add the callbacks to the sessions
  models.forEach((model, i) => {
    // create an offset depending on the index on a range of 40
    const range = 40;
    const uiOffset = vec3.scale(
      vec3.create(),
      centerDirection,
      (i / (models.length - 1)) * range + -range / 2
    );
    // add the callback to the session
    addCallback(sessions[`session_${i}`], centers[i], uiOffset, model.scale);
  });

  // show the viewport
  viewport.show = true;
})();
