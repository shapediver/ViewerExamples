import {
  createSession,
  createViewport,
  ISessionApi,
  PARAMETER_TYPE,
} from "@shapediver/viewer";

const init = async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport",
  });
  // create a session
  const session = await createSession({
    ticket: "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
    modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    id: "mySession",
  });

  const uiDiv = document.getElementById("controls") as HTMLDivElement;
  createUi(session, uiDiv);
};

init();

const createUi = (session: ISessionApi, parent: HTMLDivElement) => {
  for (const p in session.parameters) {
    if (session.parameters[p].hidden) continue;

    const parameterObject = session.parameters[p];

    // create div for the current parameter
    const paramDiv = document.createElement("div");

    // create a label with the name of the parameter
    const label = document.createElement("label");
    label.textContent = parameterObject.name;

    // create a div that will contain the label
    const div = document.createElement("div");
    paramDiv.appendChild(div);
    div.appendChild(label);

    if (
      parameterObject.type === PARAMETER_TYPE.INT ||
      parameterObject.type === PARAMETER_TYPE.FLOAT ||
      parameterObject.type === PARAMETER_TYPE.EVEN ||
      parameterObject.type === PARAMETER_TYPE.ODD
    ) {
      // the slider
      const parameterInputElement = document.createElement(
        "input",
      ) as HTMLInputElement;
      parameterInputElement.id = parameterObject.id;
      parameterInputElement.type = "range";
      parameterInputElement.min = parameterObject.min + "";
      parameterInputElement.max = parameterObject.max + "";
      parameterInputElement.value = parameterObject.value as string;
      if (parameterObject.type === PARAMETER_TYPE.INT) {
        parameterInputElement.step = "1";
      } else if (
        parameterObject.type === PARAMETER_TYPE.EVEN ||
        parameterObject.type === PARAMETER_TYPE.ODD
      ) {
        parameterInputElement.step = "2";
      } else {
        parameterInputElement.step =
          1 / Math.pow(10, parameterObject.decimalplaces!) + "";
      }
      paramDiv.appendChild(parameterInputElement);

      parameterInputElement.onchange = async () => {
        parameterObject.value = parameterInputElement.value;
        await session.customize();
      };
    } else if (parameterObject.type === PARAMETER_TYPE.BOOL) {
      // the toggle
      const parameterInputElement = document.createElement(
        "input",
      ) as HTMLInputElement;
      parameterInputElement.id = parameterObject.id;
      parameterInputElement.type = "checkbox";
      if (parameterObject.value) parameterInputElement.checked = true;
      paramDiv.appendChild(parameterInputElement);

      // the callback
      parameterInputElement.onchange = async () => {
        parameterObject.value = parameterInputElement.checked;
        await session.customize();
      };
    } else if (parameterObject.type === PARAMETER_TYPE.STRING) {
      // the input
      const parameterInputElement = document.createElement(
        "input",
      ) as HTMLInputElement;
      parameterInputElement.id = parameterObject.id;
      parameterInputElement.type = "text";
      parameterInputElement.value = parameterObject.value as string;
      paramDiv.appendChild(parameterInputElement);

      // the callback
      parameterInputElement.onchange = async () => {
        parameterObject.value = parameterInputElement.value;
        await session.customize();
      };
    } else if (parameterObject.type === PARAMETER_TYPE.COLOR) {
      // the color input
      const parameterColorInputElement = document.createElement(
        "input",
      ) as HTMLInputElement;
      parameterColorInputElement.id = parameterObject.id;
      parameterColorInputElement.type = "color";
      parameterColorInputElement.value = (<string>parameterObject.value)
        .replace("0x", "#")
        .substring(0, 7);
      paramDiv.appendChild(parameterColorInputElement);

      // the callback
      parameterColorInputElement.onchange = async () => {
        parameterObject.value = parameterColorInputElement.value;
        await session.customize();
      };
    } else if (parameterObject.type === PARAMETER_TYPE.STRINGLIST) {
      // the dropdown
      const parameterInputElement = document.createElement(
        "select",
      ) as HTMLSelectElement;
      parameterInputElement.id = parameterObject.id;
      for (let j = 0; j < parameterObject.choices!.length; j++) {
        const option = document.createElement("option");
        option.value = j + "";
        option.textContent = parameterObject.choices![j];
        if (+(parameterObject.value as string) == j)
          option.selected = true;
        parameterInputElement.appendChild(option);
      }
      paramDiv.appendChild(parameterInputElement);

      // the callback
      parameterInputElement.onchange = async () => {
        parameterObject.value = parameterInputElement.value;
        await session.customize();
      };
    } else if (parameterObject.type === PARAMETER_TYPE.FILE) {
      // the file input
      const parameterInputElement = document.createElement(
        "input",
      ) as HTMLInputElement;
      parameterInputElement.id = parameterObject.id;
      parameterInputElement.type = "file";
      parameterInputElement.accept = parameterObject.format!.join(",");
      paramDiv.appendChild(parameterInputElement);

      // the callback
      parameterInputElement.onchange = async () => {
        // Exit if no files selected
        if (!parameterInputElement.files) return;

        parameterObject.value = parameterInputElement.files[0];
        await session.customize();
      };
    }

    parent.appendChild(paramDiv);
  }
};
