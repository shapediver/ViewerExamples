

import {
  createViewport,
  createSession,
  IFileParameterApi
} from "@shapediver/viewer";
import {
  mapMimeTypeToFileEndings,
  extendMimeTypes,
  guessMimeTypeFromFilename
} from "@shapediver/viewer.utils.mime-type";

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "4a14b24341eefff0b01b2c19e728f9ccf7d34923cc56613f991b0b386e810eb943e9d4eeb17ef295e24ed56a4a18bb8530a06644747daa6525c69517f59d3d6a525e65b8bb285bee4c898d49c0e7ee88df133ce16f4337e6aa297ee6e9335fff2a9d833a109f05-a7471836c4498e8957718ae447c5ca11",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // get the file input
  const fileInputParameter = session.getParameterByName(
    "Image Import"
  )[0] as IFileParameterApi;

  // the input
  const parameterInputElement = document.getElementById(
    "fileInput"
  ) as HTMLInputElement;

  // get all allowed file endings
  const fileEndings = mapMimeTypeToFileEndings(
    extendMimeTypes(fileInputParameter.format!)
  );

  // remove duplicates
  let uniqueFileEndings: string[] = [];
  fileEndings.forEach((element) => {
    if (!uniqueFileEndings.includes(element)) uniqueFileEndings.push(element);
  });

  // set these values for accept property
  parameterInputElement.accept = uniqueFileEndings.join(",");

  // the callback
  parameterInputElement.onchange = async () => {
    if (!parameterInputElement.files || !parameterInputElement.files[0]) return;

    // some uploaded files do not have a type specified
    const file = parameterInputElement.files[0];
    let fileWithMimeType = file;
    if (!fileWithMimeType.type)
      fileWithMimeType = new File([file], file.name, {
        type: guessMimeTypeFromFilename(file.name)[0]
      });

    fileInputParameter.value = fileWithMimeType;
    await session.customize();
  };
})();
