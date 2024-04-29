import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  let viewport1 = await SDV.createViewport({
    id: "myViewport1",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  let session1 = await SDV.createSession({
    id: "mySession1",
    ticket:
      "7d6061acf274727aff4710230595ff9e58fbd019a1e173ccd5f2342ecc697fd2397ab08cadc3014b2760f858d18b4aade0aade39fd73a5c1b44fef4d5a457739c1fe28ec6b44ef593a41f6c0cccc78fb3f62234080db167d60c23886b32c759068cdff6af5a8e3-853d465964df80e5db72abe9655cedee",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await session1.close();
  console.log("closed session 1");
  await viewport1.close();
  console.log("closed viewport 1");

  let viewport2 = await SDV.createViewport({
    id: "myViewport2",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  let session2 = await SDV.createSession({
    id: "mySession2",
    ticket:
      "ed2fa7e166b5d967022e69e79ff6941256c196bedf73ee6c7ece2db0f65fc253afa36095ead3c89d0e4e1dfb00d898fc9f5356221948fd62d43ba6f22dcf76096f979aed18ea07ff286da7092a66081ff7cf694e05092f199ac0ca730eb23d2939335d9ab16dea-4b92ab67992bd4b9708ec6a39d7e4797",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await session2.close();
  console.log("closed session 2");
  await viewport2.close();
  console.log("closed viewport 2");

  let viewport3 = await SDV.createViewport({
    id: "myViewport3",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  let session3 = await SDV.createSession({
    id: "mySession3",
    ticket:
      "4de5d2e75f5f32061f9f6cc00934fad4e4cf64f8467a027348c397b088a984da2616f80d5f4bb74c49aac97f7f4e40fd13a32d5792ef6641854102a1fd9fb406bb0a303becb1d38fa9293c63cea0e1288771804bb3acd61316a7d257cd10d319d39322b2a212ea-fa8d0a974a8d6fbb561fedd0b966a5b4",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await session3.close();
  console.log("closed session 3");
  await viewport3.close();
  console.log("closed viewport 3");
})();
