

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  MaterialStandardData,
  SDTFItemData
} from "@shapediver/viewer";
import {
  HoverManager,
  InteractionData,
  InteractionEngine,
  SelectManager,
  ISelectEvent
} from "@shapediver/viewer.features.interaction";

const dataTable = <HTMLTableElement>document.getElementById("attributedata")!;

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewer"
  });
  // create a session
  const session = await createSession({
    ticket:
      "e940c3c532b05f84042863d88f25c84483c55726e434d6eae3a29cd76b8861261c6c44d841a96f5bf06bf7fe4f7a646d895951de6e3a431cbd4a7a8b56bd1ea173178365a2acaf6a7fe153ebcbcb9d9171e491b01ebe8bbb7f7d23ce64fdb98fc012cef915ff82-af6db24cc6a2116352f7eb64ab45ed2d",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  const outputNode = session.outputs["0eef99aa65322f8847e3493d73d8c0fb"].node!;
  const contentArrayNode = outputNode.children[0];

  // this model has a mesh that prevents showing the facade panel, that's why we hide it
  const envelopeNode = contentArrayNode.children.find(
    (c) => c.name === "d2defe0a-abbd-408c-ad46-37ade13e2139"
  )!;
  envelopeNode.visible = false;
  envelopeNode.updateVersion();
  viewport.update();

  // how to get to this node may vary depending on your model
  const chunkNode = contentArrayNode.children.find(
    (c) => c.name === "ab7cd2ee-04be-49b9-b6f9-5b51adb58642"
  )!;

  // event listener for SELECT_ON
  addListener(EVENTTYPE.INTERACTION.SELECT_ON, (e) => {
    const node = (<ISelectEvent>e).node;
    // how to get to the item data may vary depending on your model
    const itemData = <SDTFItemData>node.children[0].data[0];

    while (dataTable.firstChild) dataTable.removeChild(dataTable.firstChild);

    const headerRow = <HTMLTableRowElement>document.createElement("tr");

    const nameHeader = <HTMLTableCellElement>document.createElement("th");
    nameHeader.innerText = "Name";
    headerRow.appendChild(nameHeader);

    const nameValue = <HTMLTableCellElement>document.createElement("th");
    nameValue.innerText = "Value";
    headerRow.appendChild(nameValue);

    dataTable.appendChild(headerRow);

    for (let a in itemData.attributes) {
      const row = <HTMLTableRowElement>document.createElement("tr");

      const nameEntry = <HTMLTableCellElement>document.createElement("td");
      nameEntry.innerText = a;
      row.appendChild(nameEntry);

      const valueEntry = <HTMLTableCellElement>document.createElement("td");
      valueEntry.innerText = itemData.attributes[a].value;
      row.appendChild(valueEntry);

      dataTable.appendChild(row);
    }
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the selectionManager and add it
  const selectManger = new SelectManager();
  interactionEngine.addInteractionManager(selectManger);

  selectManger.effectMaterial = new MaterialStandardData({ color: "#ff0000" });

  for (let i = 0; i < chunkNode.children.length; i++) {
    chunkNode.children[i].data.push(new InteractionData({ select: true }));
    chunkNode.children[i].updateVersion();
  }
})();
