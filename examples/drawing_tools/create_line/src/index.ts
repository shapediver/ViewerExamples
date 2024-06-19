import * as SDV from '@shapediver/viewer';
import {
    createDrawingTools,
    IDrawingToolsEvent,
    IDrawingToolsApi,
    PointsData,
    RESTRICTION_TYPE,
    Settings
} from '@shapediver/viewer.features.drawing-tools';
import { createUi } from '@shapediver/viewer.shared.demo-helper';
(<any>window).SDV = SDV;

(async () => {
    // create a viewport
    const viewport = await SDV.createViewport({
        canvas: document.getElementById('canvas') as HTMLCanvasElement,
        id: 'myViewport'
    });
    // create a session
    const session = await SDV.createSession({
        ticket:
            '1636173cca09293804fb0084bb4726040b742d1a17fb18dd1801ef70a2cd3c76a45c2a442c6dc602495c43c39f2a5dd1e168a8f8f5edfebca7ad13b6b3fecdb60b0e1d914a8a25a1b16ba61ac9ff2a5a84e27cbfed31c5a4d1e5b416e78abd86a8f76a99b1eb5c-39e4dbd01454d7afbd92052722e1743f',
        modelViewUrl: 'https://sdr7euc1.eu-central-1.shapediver.com',
        id: 'mySession',
        initialParameterValues: {
            'points': '{"points":[]}'
        }
    });

    const customizationProperties: Settings = {
        general: {
            // If the drawing tool is updated automatically when the drawing is changed.
            autoUpdate: true,
            // The unit that will be displayed in the distance and point labels. 
            displayUnit: 'm'
        },
        geometry: {
            // If the line is automatically closed.
            autoClose: false,
            // The minimum amount of points
            minPoints: 4,
            // The maximum number of points
            maxPoints: 12,
        },
        restrictions: {
            plane: {
                gridSnapRestriction: {
                    gridUnit: 10
                },
                origin: [450, 450, 0],
                type: RESTRICTION_TYPE.PLANE,
            },
            axis: {
                type: RESTRICTION_TYPE.AXIS,
            }
        }
    };

    /**
     * Callback function for the drawing tool
     * executed when the drawing tool is finished
     * 
     * @param geometryData 
     */
    const onUpdate = async (pointsData: PointsData) => {
        console.log('Drawing tools updated', pointsData);

        const pointsParameter = session.getParameterByName('points')[0];
        pointsParameter.value = JSON.stringify({ 'points': pointsData });
        await session.customize();

    };

    /**
     * Callback function for the drawing tool
     * executed when the drawing tool is cancelled
     */
    const onCancel = () => {
        console.log('Drawing tools cancelled');

        // remove ui
        const menuDiv = document.getElementById('menu');
        if (menuDiv) {
            menuDiv.remove();
        }
    };

    const sendNotification = (title: string, message: string) => {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    };

    SDV.addListener(SDV.EVENTTYPE_DRAWING_TOOLS.MINIMUM_POINTS, (event: SDV.IEvent) => {
        sendNotification('Minimum points reached', (event as IDrawingToolsEvent).message!);
    });

    SDV.addListener(SDV.EVENTTYPE_DRAWING_TOOLS.MAXIMUM_POINTS, (event: SDV.IEvent) => {
        sendNotification('Maximum points reached', (event as IDrawingToolsEvent).message!);
    });

    SDV.addListener(SDV.EVENTTYPE_DRAWING_TOOLS.UNCLOSED_LOOP, (event: SDV.IEvent) => {
        sendNotification('Line loop not closed', (event as IDrawingToolsEvent).message!);
    });

    const drawingToolsApi: IDrawingToolsApi | undefined = createDrawingTools(viewport, { onUpdate, onCancel }, customizationProperties);
    (window as any).drawingToolsApi = drawingToolsApi;
        
    // create the parameter ui on the right side
    const parameterUiDiv = document.createElement("div");
    parameterUiDiv.style.position = 'absolute';
    parameterUiDiv.style.top = '5.5rem';
    parameterUiDiv.style.right = '1rem';
    parameterUiDiv.style.zIndex = '100';
    document.body.appendChild(parameterUiDiv);
    createUi(session, parameterUiDiv);

    /**
     * 
     * CAMERA SWITCH
     * 
     */

    const imgCameraSwitch = document.createElement('img');
    imgCameraSwitch.src = 'https://viewer.shapediver.com/v3/graphics/cameraswitch.svg';
    imgCameraSwitch.width = 50;
    imgCameraSwitch.height = 50;
    imgCameraSwitch.style.position = 'absolute';
    imgCameraSwitch.style.top = '1rem';
    imgCameraSwitch.style.right = '1rem';
    imgCameraSwitch.onclick = async () => {
        if (viewport.camera?.type === SDV.CAMERA_TYPE.PERSPECTIVE) {
            viewport.assignCamera('top');
        } else {
            viewport.assignCamera('perspective');
        }
    };
    document.body.appendChild(imgCameraSwitch);
})();
