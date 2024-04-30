import {
  createViewport,
  createSession,
  SESSION_SETTINGS_MODE
} from "@shapediver/viewer";

(async () => {
  // create a viewport1
  const viewport1 = await createViewport({
    canvas: document.getElementById("canvas1") as HTMLCanvasElement,
    id: "myViewport1",
    sessionSettingsId: "mySession1",
    sessionSettingsMode: SESSION_SETTINGS_MODE.MANUAL
  });

  // create a session 1
  const session1 = await createSession({
    ticket:
      "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession1",
    excludeViewports: ["myViewport2"]
  });

  // create a viewport2
  const viewport2 = await createViewport({
    canvas: document.getElementById("canvas2") as HTMLCanvasElement,
    id: "myViewport2",
    sessionSettingsId: "mySession2",
    sessionSettingsMode: SESSION_SETTINGS_MODE.MANUAL
  });

  // create a session 2
  const session2 = await createSession({
    ticket:
      "1f7d4fd2b94916d5548ee31fb39ccc2edb73d21be3fb3dc5511b61271b9f12ec7a2c36bc750c61e1f2c4f62da8db065d686624f8b51d2f6e793a49380744f81d5a9d35a9fc302ac713a7786e9985082678b9dce17a30d387c149d970025c2ce9e7a785acd18ab3-c958c4d50d48072e9ce0905913b6e774",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession2",
    excludeViewports: ["myViewport1"]
  });
})();
