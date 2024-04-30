
import * as SDV from '@shapediver/viewer';

(<any>window).SDV = SDV;

(async () => {
  let viewport1 = await SDV.createViewport({
    id: 'myViewport1',
    canvas: <HTMLCanvasElement>document.getElementById('canvas')
  })
  let session1 = await SDV.createSession({
    id: 'mySession1',
    ticket: '3e44164603b12d8e3d20458042e6cfc81e1af411666147307a558b7c35034c485aabadc822ba90ca57a4834d5994827bf1a2dd6672a02be46dbf75f7c0c35bece5b13afae0eb82c7ce4a918f7fceb839a72c5ef2244f041cefff240d9898b496ed357fe90f3432-448e3033b47a6c2c535940a00bbef73d',
    modelViewUrl: 'https://sdr7euc1.eu-central-1.shapediver.com',
    excludeViewports: ["myViewport2"]
  })

  const hiddenCanvas = document.createElement("canvas") as HTMLCanvasElement;
  hiddenCanvas.style.visibility = "hidden";
  document.body.appendChild(hiddenCanvas)

  let viewport2 = await SDV.createViewport({
    id: 'myViewport2',
    canvas: hiddenCanvas
  })
  let session2 = await SDV.createSession({
    id: 'mySession2',
    ticket: 'f378aba30f86b9b777a2d66379a8d6d73555107ce32414a83eacff589361d9cc220da2e786f3785b6b6a1b43e6ab71fe29f49d57122d8453006c80738d37727613c749a88d10b891b9ebbd1db0fda5cc9f50f12f9c7a7859cd3f9cbcfca4d054de85eae81fe6ca-281392e3616b8d4b4c5d77cb10b41261',
    modelViewUrl: 'https://sdeuc1.eu-central-1.shapediver.com',
    excludeViewports: ["myViewport1"]
  })

  if (viewport2.viewableInAR()) {
    await viewport2.viewInAR();
  } else {
    const qr = await viewport2.createArSessionLink(undefined, true);
    const image = new Image();
    image.src = qr;
    image.style.position = "absolute";
    image.style.bottom = "0%";
    document.body.appendChild(image);
  }
})();