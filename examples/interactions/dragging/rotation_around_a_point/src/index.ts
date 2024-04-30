

import {
    addListener,
    createSession,
    createViewport,
    EVENTTYPE,
    IEvent,
    MaterialStandardData
  } from "@shapediver/viewer";
  import {
    DragManager,
    HoverManager,
    IDragEvent,
    InteractionData,
    InteractionEngine,
    PlaneConstraint
  } from "@shapediver/viewer.features.interaction";
  import { vec3, mat4 } from "gl-matrix";
  
  (async () => {
    // create a viewport
    const viewport = await createViewport({
      canvas: document.getElementById("canvas") as HTMLCanvasElement,
      id: "myViewer"
    });
    // create a session
    const session = await createSession({
      ticket:
        "50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5",
      modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
      id: "mySession"
    });
  
    for (const t in viewport.postProcessing.getEffectTokens())
      viewport.postProcessing.removeEffect(t);
  
    // create the interactionEngine and provide it the viewport object
    const interactionEngine = new InteractionEngine(viewport);
  
    // create the hoverManager and add it
    const hoverManager = new HoverManager();
    interactionEngine.addInteractionManager(hoverManager);
    hoverManager.effectMaterial = new MaterialStandardData({ color: "#0000ff" });
  
    // create the dragManager and add it
    const dragManager = new DragManager();
    dragManager.effectMaterial = new MaterialStandardData({ color: "#00ff00" });
    interactionEngine.addInteractionManager(dragManager);
  
    // add the interaction data
    const interactiveOutputData = new InteractionData({
      drag: true,
      hover: true
    });
    interactiveOutputData.dragOrigin = [0, 0, 0];
  
    //add all interactive data to output
    const output = session.getOutputByName("Shelf")[0];
    output.node!.data.push(interactiveOutputData);
    output.node!.updateVersion();
  
    // add a plane constraint
    const planeConstraint = new PlaneConstraint([0, 0, 1], [0, 0, 0]);
    // use the token to remove the constraint again (removeDragConstraint)
    dragManager.addDragConstraint(planeConstraint);
  
    const cb = (dragEvent: IDragEvent) => {
      const draggedNode = dragEvent.node;
      const dragTransformation = draggedNode.getTransformation("SD_drag_matrix")!;
  
      // get the translation of the object
      const translation = vec3.negate(
        vec3.create(),
        mat4.getTranslation(vec3.create(), dragEvent.matrix)
      );
  
      // convert it to a rotation
      const inv = mat4.transpose(
        mat4.create(),
        mat4.fromValues(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
      );
      dragTransformation.matrix = mat4.mul(
        mat4.create(),
        mat4.targetTo(
          mat4.create(),
          vec3.create(),
          translation,
          vec3.fromValues(0, 0, 1)
        ),
        inv
      );
  
      draggedNode.updateVersion();
    };
  
    addListener(EVENTTYPE.INTERACTION.DRAG_MOVE, cb as (e: IEvent) => void);
    addListener(EVENTTYPE.INTERACTION.DRAG_END, cb as (e: IEvent) => void);
  })();
  