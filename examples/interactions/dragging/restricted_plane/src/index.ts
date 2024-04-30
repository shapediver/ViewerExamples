

import {
  addListener,
  Box,
  createSession,
  createViewport,
  EVENTTYPE,
  MaterialStandardData
} from '@shapediver/viewer';
import {
  CameraPlaneConstraint,
  DragManager,
  HoverManager,
  IDragEvent,
  InteractionData,
  InteractionEngine,
  LineConstraint,
  PlaneConstraint,
  PointConstraint,
  SelectManager
} from '@shapediver/viewer.features.interaction';
import { vec3, mat4 } from 'gl-matrix';

(async () => {
  // create a viewport
  const viewport = await createViewport({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      id: 'myViewer'
  });
  // create a session
  const session = await createSession({
      ticket:
          'deb711cb6ab9c36348f167ae36e4ff1690cfd6442dc8289fed0461f8a301a28d9b5465a7b4f15cc5b6f82004a177d6394b87ecee93e8398ecaaf84d79522193f000fc88fe322bf54237d14b5cf019b2ca5fe850a5f30c9264c35ca29e9bc4d2041c38a6179e89a-2e6d954fa3f35e088e037a4fb359e4da',
      modelViewUrl: 'https://sdr7euc1.eu-central-1.shapediver.com',
      id: 'mySession'
  });

  // create the interactionEngine and provide it the viewport object
  const interactionEngine = new InteractionEngine(viewport);

  // create the hoverManager and add it
  const hoverManager = new HoverManager();
  interactionEngine.addInteractionManager(hoverManager);

  hoverManager.effectMaterial = new MaterialStandardData({ color: '#0000ff' });

  // create the dragManager and add it
  const dragManager = new DragManager();
  dragManager.effectMaterial = new MaterialStandardData({ color: '#00ff00' });
  interactionEngine.addInteractionManager(dragManager);

  // add the interaction data
  const interactiveOutput = session.getOutputByName('Box')[0].node!;
  const interactiveOutputData = new InteractionData({ drag: true, hover: true });
  interactiveOutputData.dragOrigin = [0, 0, 0];

  //get anchor output data
  const anchorCoordsObjArr = session.getOutputByName('SNAP ANCHOR')[0].content![0].data;
  const anchorCoordsArr: number[][] = anchorCoordsObjArr.map((anchorObj: string) => {
      return JSON.parse(anchorObj.replace(/{(.*)}/, '[$1]'));
  });

  const min = vec3.fromValues(Infinity, Infinity, Infinity);
  const max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
  //add anchor data to interactive manager
  anchorCoordsArr.forEach((coords) => {
      dragManager.addDragConstraint(new PointConstraint(vec3.fromValues(coords[0], coords[1], coords[2]), 5));
      vec3.min(min, min, vec3.fromValues(coords[0], coords[1], coords[2]));
      vec3.max(max, max, vec3.fromValues(coords[0], coords[1], coords[2]));
  });

  //add all interactive data to output
  interactiveOutput.data.push(interactiveOutputData);
  interactiveOutput.updateVersion();

  // add a plane constraint
  const planeConstraint = new PlaneConstraint([0, 0, 1], [0, 0, 0]);
  // use the token to remove the constraint again (removeDragConstraint)
  dragManager.addDragConstraint(planeConstraint);
  //create point constraint object for origin

  const pointConstraint = new PointConstraint([0, 0, 0], 2); //last param is the radius, but changing this has a minimal effect on dragging
  dragManager.addDragConstraint(pointConstraint);

  const restrictPosition = (e: IDragEvent) => {
      const draggedNode = e.node;
      const dragTransformation = draggedNode.getTransformation('SD_drag_matrix')!;
      const translation = vec3.create();
      mat4.getTranslation(translation, dragTransformation.matrix);
      vec3.min(translation, translation, max);
      vec3.max(translation, translation, min);
      mat4.fromTranslation(dragTransformation.matrix, translation);
      viewport.updateNodeTransformation(draggedNode);
  };

  const dragMoveListenerToken = addListener(EVENTTYPE.INTERACTION.DRAG_MOVE, (e) => {
      restrictPosition(e as IDragEvent);
  });

  const dragEndListenerToken = addListener(EVENTTYPE.INTERACTION.DRAG_END, (e) => {
      restrictPosition(e as IDragEvent);
  });
})();
