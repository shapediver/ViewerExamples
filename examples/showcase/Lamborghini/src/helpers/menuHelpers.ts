import { changeBodyMaterial } from "./materialHelpers";
import { mat4 } from "gl-matrix";
import { IOutputApi, ISessionApi, IViewportApi } from "@shapediver/viewer";

export const createMenu = (session: ISessionApi, viewport: IViewportApi) => {
  const iconLambo = <HTMLImageElement>document.getElementById("lambo-logo");
  const iconColor = <HTMLImageElement>document.getElementById("iconColor");
  const iconRims = <HTMLImageElement>document.getElementById("iconRims");
  const iconGrill = <HTMLImageElement>document.getElementById("iconGrill");
  const iconPlate = <HTMLImageElement>document.getElementById("iconPlate");

  const colorDiv = <HTMLDivElement>document.getElementById("colorDiv");
  const rimsDiv = <HTMLDivElement>document.getElementById("rimsDiv");
  const grillDiv = <HTMLDivElement>document.getElementById("grillDiv");
  const plateDiv = <HTMLDivElement>document.getElementById("plateDiv");
  colorDiv.classList.add("slide-in");

  iconLambo.onclick = () => {
    const { position, target } = viewport.camera!.calculateZoomTo(
      undefined,
      [700, 300, 120],
      [0, 0, 70]
    );
    viewport.camera?.set(position, target);

    colorDiv.classList.remove("slide-out");
    colorDiv.classList.add("slide-in");
    rimsDiv.classList.remove("slide-out");
    rimsDiv.classList.add("slide-in");
    grillDiv.classList.remove("slide-out");
    grillDiv.classList.add("slide-in");
    plateDiv.classList.remove("slide-out");
    plateDiv.classList.add("slide-in");
  };

  iconColor.onclick = () => {
    if (!colorDiv.classList.contains("slide-out")) {
      const { position, target } = viewport.camera!.calculateZoomTo(
        undefined,
        [700, 300, 120],
        [0, 0, 70]
      );
      viewport.camera?.set(position, target);

      colorDiv.classList.remove("slide-in");
      colorDiv.classList.add("slide-out");

      rimsDiv.classList.remove("slide-out");
      rimsDiv.classList.add("slide-in");
      grillDiv.classList.remove("slide-out");
      grillDiv.classList.add("slide-in");
      plateDiv.classList.remove("slide-out");
      plateDiv.classList.add("slide-in");
    } else {
      colorDiv.classList.remove("slide-out");
      colorDiv.classList.add("slide-in");
    }
  };

  const wheelsOutput = session
    .getOutputByName("wheels")
    .find((o: IOutputApi) => o.material !== undefined)!;
  const leftFrontWheel = wheelsOutput.node!.children[1].children[0].children[0];

  rimsDiv.classList.add("slide-in");
  iconRims.onclick = () => {
    if (!rimsDiv.classList.contains("slide-out")) {
      const zoomExtentsFactor = viewport.camera!.zoomToFactor;
      viewport.camera!.zoomToFactor = 2;
      const { position, target } = viewport.camera!.calculateZoomTo(
        leftFrontWheel.boundingBox
          .clone()
          .applyMatrix(
            mat4.fromRotation(mat4.create(), Math.PI / 2, [0, 0, 1])
          ),
        [150, 450, 45],
        [125, -13, 45]
      );
      viewport.camera!.zoomToFactor = zoomExtentsFactor;
      viewport.camera?.set(position, target);
      rimsDiv.classList.remove("slide-in");
      rimsDiv.classList.add("slide-out");

      colorDiv.classList.remove("slide-out");
      colorDiv.classList.add("slide-in");
      grillDiv.classList.remove("slide-out");
      grillDiv.classList.add("slide-in");
      plateDiv.classList.remove("slide-out");
      plateDiv.classList.add("slide-in");
    } else {
      rimsDiv.classList.remove("slide-out");
      rimsDiv.classList.add("slide-in");
    }
  };

  grillDiv.classList.add("slide-in");
  iconGrill.onclick = () => {
    if (!grillDiv.classList.contains("slide-out")) {
      const { position, target } = viewport.camera!.calculateZoomTo(
        undefined,
        [680, 0, 75],
        [125, 0, 45]
      );
      viewport.camera?.set(position, target);
      grillDiv.classList.remove("slide-in");
      grillDiv.classList.add("slide-out");

      colorDiv.classList.remove("slide-out");
      colorDiv.classList.add("slide-in");
      rimsDiv.classList.remove("slide-out");
      rimsDiv.classList.add("slide-in");
      plateDiv.classList.remove("slide-out");
      plateDiv.classList.add("slide-in");
    } else {
      grillDiv.classList.remove("slide-out");
      grillDiv.classList.add("slide-in");
    }
  };

  plateDiv.classList.add("slide-in");
  iconPlate.onclick = () => {
    if (!plateDiv.classList.contains("slide-out")) {
      const { position, target } = viewport.camera!.calculateZoomTo(
        undefined,
        [-680, 0, 100],
        [-65, 0, 30]
      );
      viewport.camera?.set(position, target);
      plateDiv.classList.remove("slide-in");
      plateDiv.classList.add("slide-out");

      colorDiv.classList.remove("slide-out");
      colorDiv.classList.add("slide-in");
      rimsDiv.classList.remove("slide-out");
      rimsDiv.classList.add("slide-in");
      grillDiv.classList.remove("slide-out");
      grillDiv.classList.add("slide-in");
    } else {
      plateDiv.classList.remove("slide-out");
      plateDiv.classList.add("slide-in");
    }
  };

  const plateText = <HTMLInputElement>document.getElementById("plateText");
  plateText.onchange = () => {
    session.parameters["28c647ad-2e66-461a-be2f-c754095a6ffe"].value =
      plateText.value;
    session.customize();
  };

  const iconArancioXanto = <HTMLImageElement>(
    document.getElementById("iconArancioXanto")
  );
  iconArancioXanto.onclick = () => changeBodyMaterial(session, "#8c0b00b");

  const iconBiancoAsopo = <HTMLImageElement>(
    document.getElementById("iconBiancoAsopo")
  );
  iconBiancoAsopo.onclick = () => changeBodyMaterial(session, "#92918d");

  const iconBluNethuns = <HTMLImageElement>(
    document.getElementById("iconBluNethuns")
  );
  iconBluNethuns.onclick = () => changeBodyMaterial(session, "#002750");

  const iconGialloBelenus = <HTMLImageElement>(
    document.getElementById("iconGialloBelenus")
  );
  iconGialloBelenus.onclick = () => changeBodyMaterial(session, "#886000");

  const iconGrigioTelesto = <HTMLImageElement>(
    document.getElementById("iconGrigioTelesto")
  );
  iconGrigioTelesto.onclick = () => changeBodyMaterial(session, "#030303");

  const iconVerdeSelvans = <HTMLImageElement>(
    document.getElementById("iconVerdeSelvans")
  );
  iconVerdeSelvans.onclick = () => changeBodyMaterial(session, "#437600");

  const iconViolaPasifae = <HTMLImageElement>(
    document.getElementById("iconViolaPasifae")
  );
  iconViolaPasifae.onclick = () => changeBodyMaterial(session, "#090011");

  const parameterNumberOfSpokes =
    session.parameters["61e2037a-6927-4ca9-8557-4f44b223768c"];
  const inputNumberOfSpokes = <HTMLInputElement>(
    document.getElementById("inputNumberOfSpokes")
  );

  inputNumberOfSpokes.min = "5";
  inputNumberOfSpokes.max = parameterNumberOfSpokes.max! + "";
  inputNumberOfSpokes.value = +(parameterNumberOfSpokes.value as string) + "";
  inputNumberOfSpokes.onchange = () => {
    parameterNumberOfSpokes.value = inputNumberOfSpokes.value;
    session.customize();
  };

  const valueNumberOfSpokes = <HTMLParagraphElement>(
    document.getElementById("valueNumberOfSpokes")
  );
  valueNumberOfSpokes.innerText = inputNumberOfSpokes.value;
  inputNumberOfSpokes.oninput = () => {
    valueNumberOfSpokes.innerText = inputNumberOfSpokes.value;
  };

  const parameterIngoingForce =
    session.parameters["29ee88fe-0e68-4fac-a594-9795ed362978"];
  const inputIngoingForce = <HTMLInputElement>(
    document.getElementById("inputIngoingForce")
  );
  inputIngoingForce.min = "-15";
  inputIngoingForce.max = "15";
  inputIngoingForce.value = +(parameterIngoingForce.value as string) + "";
  inputIngoingForce.onchange = () => {
    parameterIngoingForce.value = inputIngoingForce.value;
    session.customize();
  };

  const valueIngoingForce = <HTMLParagraphElement>(
    document.getElementById("valueIngoingForce")
  );
  valueIngoingForce.innerText = inputIngoingForce.value;
  inputIngoingForce.oninput = () => {
    valueIngoingForce.innerText = inputIngoingForce.value;
  };

  const parameterGoInsane =
    session.parameters["2521eef2-4570-49e9-8978-4f0bc807522f"];
  const inputGoInsane = <HTMLInputElement>(
    document.getElementById("inputGoInsane")
  );
  inputGoInsane.min = parameterGoInsane.min! + "";
  inputGoInsane.max = parameterGoInsane.max! + "";
  inputGoInsane.value = +(parameterGoInsane.value as string) + "";
  inputGoInsane.onchange = () => {
    parameterGoInsane.value = inputGoInsane.value;
    session.customize();
  };

  const valueGoInsane = <HTMLParagraphElement>(
    document.getElementById("valueGoInsane")
  );
  valueGoInsane.innerText = inputGoInsane.value;
  inputGoInsane.oninput = () => {
    valueGoInsane.innerText = inputGoInsane.value;
  };

  const parameterHorizontal =
    session.parameters["316b5941-8b82-413c-9deb-102cdc985f81"];
  const inputHorizontal = <HTMLInputElement>(
    document.getElementById("inputHorizontal")
  );
  const divHorizontal = <HTMLInputElement>(
    document.getElementById("divHorizontal")
  );
  inputHorizontal.min = "2";
  inputHorizontal.max = parameterHorizontal.max! + "";
  inputHorizontal.value = +(parameterHorizontal.value as string) + "";
  inputHorizontal.onchange = () => {
    parameterHorizontal.value = inputHorizontal.value;
    session.customize();
  };

  const valueHorizontal = <HTMLParagraphElement>(
    document.getElementById("valueHorizontal")
  );
  valueHorizontal.innerText = inputHorizontal.value;
  inputHorizontal.oninput = () => {
    valueHorizontal.innerText = inputHorizontal.value;
  };

  const parameterVertical =
    session.parameters["77ccae38-3786-493d-9fae-8fc31aedd99a"];
  const inputVertical = <HTMLInputElement>(
    document.getElementById("inputVertical")
  );
  const divVertical = <HTMLInputElement>document.getElementById("divVertical");
  inputVertical.min = "2";
  inputVertical.max = parameterVertical.max! + "";
  inputVertical.value = +(parameterVertical.value as string) + "";
  inputVertical.onchange = () => {
    parameterVertical.value = inputVertical.value;
    session.customize();
  };

  const valueVertical = <HTMLParagraphElement>(
    document.getElementById("valueVertical")
  );
  valueVertical.innerText = inputVertical.value;
  inputVertical.oninput = () => {
    valueVertical.innerText = inputVertical.value;
  };

  const parameterMorphing =
    session.parameters["640bddde-0c4d-4c19-bbcc-d8516af9fb89"];
  const inputMorphing = <HTMLInputElement>(
    document.getElementById("inputMorphing")
  );
  const divMorphing = <HTMLInputElement>document.getElementById("divMorphing");
  inputMorphing.min = "0.1";
  inputMorphing.max = parameterMorphing.max! + "";
  inputMorphing.step = "0.1";
  inputMorphing.value = +(parameterMorphing.value as string) + "";
  inputMorphing.onchange = () => {
    parameterMorphing.value = inputMorphing.value;
    session.customize();
  };

  const valueMorphing = <HTMLParagraphElement>(
    document.getElementById("valueMorphing")
  );
  valueMorphing.innerText = inputMorphing.value;
  inputMorphing.oninput = () => {
    valueMorphing.innerText = inputMorphing.value;
  };

  const parameterPattern =
    session.parameters["9671ed13-39d6-4b8b-bc6a-39737a4f245b"];
  const inputPattern = <HTMLInputElement>(
    document.getElementById("inputPattern")
  );

  for (let j = 0; j < parameterPattern.choices!.length; j++) {
    let option = document.createElement("option");
    option.setAttribute("value", j + "");
    option.setAttribute("name", parameterPattern.choices![j]);
    option.innerHTML = parameterPattern.choices![j];
    if (parameterPattern.value === j) option.setAttribute("selected", "");
    inputPattern.appendChild(option);
  }

  inputPattern.value = +(parameterPattern.value as string) + "";
  inputPattern.onchange = () => {
    parameterPattern.value = inputPattern.value;

    switch (inputPattern.value) {
      case "0":
        divHorizontal.style.visibility = "hidden";
        divVertical.style.visibility = "hidden";
        divMorphing.style.visibility = "hidden";
        break;

      case "1":
        divHorizontal.style.visibility = "visible";
        divVertical.style.visibility = "visible";
        divMorphing.style.visibility = "visible";
        break;

      case "2":
        divHorizontal.style.visibility = "visible";
        divVertical.style.visibility = "visible";
        divMorphing.style.visibility = "hidden";
        break;

      case "3":
        divHorizontal.style.visibility = "visible";
        divVertical.style.visibility = "visible";
        divMorphing.style.visibility = "hidden";
        break;
      default:
        divHorizontal.style.visibility = "visible";
        divVertical.style.visibility = "visible";
        divMorphing.style.visibility = "visible";
    }

    session.customize();
  };
};
