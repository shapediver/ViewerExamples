import { DataEngine, ISphere, ITag3D, TAG3D_JUSTIFICATION, sceneTree } from '@shapediver/viewer';

/**
 * Create text nodes for the cardinal directions
 * 
 * @param bs 
 */
export const createCardinalDirectionsText = async (bs: ISphere) => {
    const node = await DataEngine.instance.loadContent({
        format: 'tag3d',
        data: [
            <ITag3D>{
                location: {
                    normal: { X: 0, Y: 0, Z: 1 },
                    yAxis: { X: 0, Y: 1, Z: 0 },
                    xAxis: { X: 1, Y: 0, Z: 0 },
                    origin: { X: bs.center[0], Y: bs.center[1] + bs.radius, Z: 0 }
                },
                version: '',
                text: 'North',
                justification: TAG3D_JUSTIFICATION.MIDDLE_CENTER,
                color: '#000000',
                size: 100
            },
            <ITag3D>{
                location: {
                    normal: { X: 0, Y: 0, Z: 1 },
                    yAxis: { X: 0, Y: 1, Z: 0 },
                    xAxis: { X: 1, Y: 0, Z: 0 },
                    origin: { X: bs.center[0], Y: bs.center[1] - ((bs.radius * 3) / 4), Z: 0 }
                },
                version: '',
                text: 'South',
                justification: TAG3D_JUSTIFICATION.MIDDLE_CENTER,
                color: '#000000',
                size: 100
            },
            <ITag3D>{
                location: {
                    normal: { X: 0, Y: 0, Z: 1 },
                    yAxis: { X: 0, Y: 1, Z: 0 },
                    xAxis: { X: 1, Y: 0, Z: 0 },
                    origin: { X: bs.center[0] - bs.radius, Y: bs.center[1], Z: 0 }
                },
                version: '',
                text: 'West',
                justification: TAG3D_JUSTIFICATION.MIDDLE_CENTER,
                color: '#000000',
                size: 100
            },
            <ITag3D>{
                location: {
                    normal: { X: 0, Y: 0, Z: 1 },
                    yAxis: { X: 0, Y: 1, Z: 0 },
                    xAxis: { X: 1, Y: 0, Z: 0 },
                    origin: { X: bs.center[0] + bs.radius, Y: bs.center[1], Z: 0 }
                },
                version: '',
                text: 'East',
                justification: TAG3D_JUSTIFICATION.MIDDLE_CENTER,
                color: '#000000',
                size: 100
            }
        ]
    });

    sceneTree.root.addChild(node);
    sceneTree.root.updateVersion();
};