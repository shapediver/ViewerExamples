import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  const viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  const session = await SDV.createSession({
    id: "mySession",
    ticket:
      "1ab7708e06714a702a90248fb1d06c5bc6068376d105504955e98204240e1d552f02c035d7362e88fc6b78b7c5eeaf527a543d522aa3beeb35e92ce8352ba8819e64da9da122cb52344f804bf0bd4760a6430b8060943f4f63a6b42ff8240f44277377098e49d0-a4cad54266de85e5afff6df45be312c3",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });

  // customization takes 5 seconds (if it isn't cached)
  session.getParameterByName("Delay [sec]")[0].value = 5;
  session.customize();

  // we cancel it after 1 second
  setTimeout(() => {
    session.cancelCustomization();
  }, 1000);
})();
