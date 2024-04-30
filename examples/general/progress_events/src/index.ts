import * as SDV from "@shapediver/viewer";

(<any>window).SDV = SDV;

(async () => {
  const processes: {
    [key: string]: HTMLProgressElement;
  } = {};

  const div = document.createElement("div");
  document.body.appendChild(div);
  div.style.position = "absolute";
  div.style.display = "grid";
  div.style.top = "0%";

  SDV.addListener(SDV.EVENTTYPE.TASK.TASK_START, (e) => {
    const taskEvent = e as SDV.ITaskEvent;
    console.log(taskEvent.id);
    const divInner = document.createElement("div");
    div.appendChild(divInner);

    const progress = document.createElement("progress");
    progress.value = 0;
    progress.max = 1;
    divInner.appendChild(progress);
    processes[taskEvent.id] = progress;

    const label = document.createElement("label");
    label.innerText = taskEvent.type;
    divInner.appendChild(label);

    progress.value = taskEvent.progress;

    if (taskEvent.type === SDV.TASK_TYPE.MATERIAL_CONTENT_LOADING)
      console.log("start", e, processes[taskEvent.id]);
  });

  SDV.addListener(SDV.EVENTTYPE.TASK.TASK_PROCESS, (e) => {
    const taskEvent = e as SDV.ITaskEvent;

    if (taskEvent.type === SDV.TASK_TYPE.MATERIAL_CONTENT_LOADING)
      console.log("progress", e, processes[taskEvent.id]);
    if (processes[taskEvent.id])
      processes[taskEvent.id].value = taskEvent.progress;
  });

  SDV.addListener(SDV.EVENTTYPE.TASK.TASK_END, (e) => {
    const taskEvent = e as SDV.ITaskEvent;
    if (taskEvent.type === SDV.TASK_TYPE.MATERIAL_CONTENT_LOADING)
      console.log("end", e, processes[taskEvent.id]);
    if (processes[taskEvent.id])
      processes[taskEvent.id].value = taskEvent.progress;
  });

  let viewport = await SDV.createViewport({
    id: "myViewport",
    canvas: <HTMLCanvasElement>document.getElementById("canvas")
  });
  let session = await SDV.createSession({
    id: "mySession",
    ticket:
      "9600def8d1b57c806e8471b16c31ae26ba5d9964b1d925f58439d50e589bf5bdcd1610ae1e389b9ded8ae85020376406dda2323d5b4ff101b4b97633a9bc78f7ae7281ed6cdf42d52f4323066b5e77840b40c73ec56d50500833886aa531cc14b6828abf48e9c1-6cb0b81573229f3b7c1198ad32dcff9a",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  });
})();
