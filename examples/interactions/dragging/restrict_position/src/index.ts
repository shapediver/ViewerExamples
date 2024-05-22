import {
    addListener,
    createViewport,
    createSession,
    MaterialUnlitData,
    ITreeNode,
    EVENTTYPE
  } from "@shapediver/viewer";
  import {
    DragManager,
    HoverManager,
    InteractionData,
    InteractionEngine,
    PlaneConstraint
  } from "@shapediver/viewer.features.interaction";
  import { createUi } from "@shapediver/viewer.shared.demo-helper";
  import { vec3 } from "gl-matrix";
  
  (async () => {
    // create the viewport
    const viewport = await createViewport({
      id: "myViewport",
      canvas: <HTMLCanvasElement>document.getElementById("canvas")
    });
    // create the session
    const session = await createSession({
      id: "mySession",
      ticket:
        "16170507cd93025744c1735ba18d750592cb8bd4adbe0303ffff85915e91e4a595bdf805f32358eba90ee68c00a6341904c74874d25ee1330ceaf2d14707018c2acfbcea9201110bf379a8cda569651fd02718922004328c5f43660ac2d55711aa909ee58a94d72a87d37b3075a2453bafd60faecfa5-d27bf5756f1355709ceb4dfe0e8670c2",
      modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
    });
  
    // create the interaction engine, drag manager and hover manager
    const interactionEngine = new InteractionEngine(viewport);
  
    // create the drag manager and add a place constraint
    const dragManager = new DragManager();
    dragManager.effectMaterial = new MaterialUnlitData({ color: "red" });
    dragManager.addDragConstraint(new PlaneConstraint(vec3.fromValues(0, 1, 0)));
    interactionEngine.addInteractionManager(dragManager);
  
    // add a hover manager
    const hoverManager = new HoverManager();
    hoverManager.effectMaterial = new MaterialUnlitData({ color: "green" });
    interactionEngine.addInteractionManager(hoverManager);
  
    // create the parameter ui on the right side
    const parameterUiDiv = document.createElement("div");
    parameterUiDiv.style.position = "absolute";
    parameterUiDiv.style.width = "20rem";
    parameterUiDiv.style.overflow = "scroll";
    parameterUiDiv.style.height = "100%";
    document.body.appendChild(parameterUiDiv);
    createUi(session, parameterUiDiv);
  
    // // we hide the points parameter as we do this via interactions
    // session.getParameterByName("Points")[0].hidden = true;
  
    // retrieve the sphere output
    const sphereOutput = session
      .getOutputByName("ControlPnts")
      .find((o) => !o.format.includes("material"))!;
  
    let sphereNodes: ITreeNode[] = [];
    // callback to assign interaction data
    const cb = (newNode?: ITreeNode) => {
      if(!newNode) return;
  
      // retrieve all sphere nodes in this hierarchy setup
      sphereNodes = newNode.children;
  
      // assign the interaction data
      sphereNodes.forEach((n) => {
        // check if the interaction data was already assigned
        // this can happen if the customization didn't update the specific node
        if (!n.data.find((d) => d instanceof InteractionData)) {
          n.addData(new InteractionData({ hover: true, drag: true }));
          n.updateVersion();
        }
        n.updateVersion();
      });
    };
  
    // assign this callback to be triggered whenever output updates happen
    sphereOutput.updateCallback = cb;
    // and call it once at the start
    cb(sphereOutput.node);
  
    // whenever the dragging stops create the input for the parameter und customize the session
    addListener(EVENTTYPE.INTERACTION.DRAG_END, async () => {
      session.getParameterByName("tableCrvJSON")[0].value = JSON.stringify({
        points: sphereNodes.map((n) => {
          return {
            x: n.boundingBox.boundingSphere.center[0],
            y: n.boundingBox.boundingSphere.center[1],
            z: n.boundingBox.boundingSphere.center[2]
          };
        })
      });
      await session.customize();
    });
  })();
  