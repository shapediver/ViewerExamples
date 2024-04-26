import {
    AnimationData,
    IAnimationTrack,
    IOutputApi,
    ISessionApi,
    IViewportApi,
    sceneTree
  } from "@shapediver/viewer";
  import { quat, vec3 } from "gl-matrix";
  
  export const createAnimation = async (
    session: ISessionApi,
    viewport: IViewportApi
  ) => {
    const wheelsOutput = session
      .getOutputByName("wheels")
      .find((o: IOutputApi) => o.material !== undefined)!;
  
    const wheelNodes = [];
    wheelNodes.push(wheelsOutput.node!.children[0].children[0].children[0]);
    wheelNodes.push(wheelsOutput.node!.children[1].children[0].children[0]);
    wheelNodes.push(wheelsOutput.node!.children[2].children[0].children[0]);
    wheelNodes.push(wheelsOutput.node!.children[3].children[0].children[0]);
  
    wheelNodes.push(wheelsOutput.node!.children[0].children[0].children[1]);
    wheelNodes.push(wheelsOutput.node!.children[1].children[0].children[1]);
    wheelNodes.push(wheelsOutput.node!.children[2].children[0].children[1]);
    wheelNodes.push(wheelsOutput.node!.children[3].children[0].children[1]);
  
    wheelNodes.push(wheelsOutput.node!.children[0].children[0].children[2]);
    wheelNodes.push(wheelsOutput.node!.children[1].children[0].children[2]);
    wheelNodes.push(wheelsOutput.node!.children[2].children[0].children[2]);
    wheelNodes.push(wheelsOutput.node!.children[3].children[0].children[2]);
  
    wheelNodes.push(wheelsOutput.node!.children[0].children[0].children[3]);
    wheelNodes.push(wheelsOutput.node!.children[1].children[0].children[3]);
    wheelNodes.push(wheelsOutput.node!.children[2].children[0].children[3]);
    wheelNodes.push(wheelsOutput.node!.children[3].children[0].children[3]);
  
    const quat0 = quat.create();
    const quat1 = quat.setAxisAngle(
      quat.create(),
      vec3.fromValues(0, 1, 0),
      -Math.PI
    );
    const quat2 = quat.setAxisAngle(
      quat.create(),
      vec3.fromValues(0, 1, 0),
      -Math.PI * 2
    );
  
    const maxTime = 6;
  
    const tracks: IAnimationTrack[] = [];
    wheelNodes.forEach((node) => {
      const segments = 5;
      const segmentLength = (maxTime - 1) / segments;
      for (let i = 0; i < segments; i++) {
        const segmentStart = i * segmentLength;
        tracks.push({
          times: [
            segmentStart,
            segmentStart + segmentLength / 2,
            segmentStart + segmentLength
          ],
          node: node,
          values: [
            quat0[0],
            quat0[1],
            quat0[2],
            quat0[3],
            quat1[0],
            quat1[1],
            quat1[2],
            quat1[3],
            quat2[0],
            quat2[1],
            quat2[2],
            quat2[3]
          ],
          path: "rotation",
          interpolation: "linear"
        });
      }
    });
  
    const slerp = (
      quat0: quat,
      quat1: quat,
      quat2: quat,
      factor: number
    ): quat => {
      if (factor < 0.5) {
        return quat.slerp(quat.create(), quat0, quat1, factor * 2);
      } else {
        return quat.slerp(quat.create(), quat1, quat2, factor * 2 - 1);
      }
    };
  
    wheelNodes.forEach((node) => {
      const step = 0.1;
  
      let addedFactor = 0.0;
      let prevQuat = slerp(quat0, quat1, quat2, addedFactor);
  
      for (let i = 5; i < 6; i = i + step) {
        const factor = (i + step - 5) / (6 - 5);
        addedFactor += step * (1 - factor);
        const quat = slerp(quat0, quat1, quat2, addedFactor);
        tracks.push({
          times: [i, i + step],
          node: node,
          values: [
            prevQuat[0],
            prevQuat[1],
            prevQuat[2],
            prevQuat[3],
            quat[0],
            quat[1],
            quat[2],
            quat[3]
          ],
          path: "rotation",
          interpolation: "linear"
        });
        prevQuat = quat;
      }
    });
  
    const data = new AnimationData("myAnimation", tracks, 0, maxTime);
    data.reset = false;
    sceneTree.root.data.push(data);
  
    sceneTree.root.updateVersion();
    viewport.update();
  
    viewport.camera!.set([-1000, 450, 250], [0, 0, 75], { duration: 0 });
    viewport.show = true;
  
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 100)
    );
    const { position, target } = viewport.camera!.calculateZoomTo(
      undefined,
      [700, 300, 120],
      [0, 0, 70]
    );
  
    data.startAnimation();
    await viewport.camera!.animate(
      [
        {
          position: [-1000, 450, 250],
          target: [0, 0, 75]
        },
        {
          position: [0, 800, 450],
          target: [0, 0, 75]
        },
        { position, target }
      ],
      { duration: 6000, easing: "Linear.None" }
    );
  };
  
  export const openDoors = async (
    session: ISessionApi,
    viewport: IViewportApi
  ) => {
    const doorOutput = session
      .getOutputByName("door_exterior")
      .find((o: IOutputApi) => o.material !== undefined)!;
  
    const tracks: IAnimationTrack[] = [];
  
    const data = new AnimationData("myAnimation", tracks, 0, 5);
    data.reset = false;
    sceneTree.root.data.push(data);
  
    sceneTree.root.updateVersion();
    viewport.update();
  
    data.startAnimation();
  };
  