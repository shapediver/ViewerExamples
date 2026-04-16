import * as SDV from '@shapediver/viewer';
import { addListener, EVENTTYPE_TRANSFORMATION_TOOLS } from '@shapediver/viewer';
import { RESTRICTION_TYPE } from '@shapediver/viewer.features.interaction';
import { RectangleTransform, EventResponseMapping } from '@shapediver/viewer.features.transformation-tools';

(<any>window).SDV = SDV;

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

(async () => {
    // create the viewport
    const viewport = await SDV.createViewport({
        id: 'myViewport',
        canvas: <HTMLCanvasElement>document.getElementById('canvas')
    });

    // create the session
    const session = await SDV.createSession({
        id: 'mySession',
        ticket: '50eb2a26ddaa432ca18288b8a120ef194fa35bb813e4f43ae89d657991a865f9deaa20a1c840e47cdf6dbc019cd16ae15a9a6b3a7d91722455299d6bd29b1f26b3ff3b7adaac1df3d50f3ba4d010a560180dff8f745c946dadb41167a3431e223d69b32743f167-5b9465f92a0cf9c235b8ea315aab0cd5',
        modelViewUrl: 'https://sdr7euc1.eu-central-1.shapediver.com'
    });

    // create the RectangleTransform with a viewport, nodes, and a plane definition
    // the plane defines the surface on which the rectangular handle is drawn
    const rectangleTransform = new RectangleTransform(viewport, [session.node], {
        plane: {
            origin: [0, 0, 0],
            vector_u: [1, 0, 0],
            vector_v: [0, 1, 0],
            type: RESTRICTION_TYPE.PLANE
        },
    });

    // create an event listener for the RectangleTransform
    const eventListenerToken = addListener(EVENTTYPE_TRANSFORMATION_TOOLS.MATRIX_CHANGED, (e) => {
        const event = e as EventResponseMapping[EVENTTYPE_TRANSFORMATION_TOOLS.MATRIX_CHANGED];

        // filter for this specific instance
        if (event.id !== rectangleTransform.id) return;

        // show the notification
        sendNotification(
            'RectangleTransform has changed',
            `- viewportId: ${event.viewportId}
            - nodes: ${event.nodes}
            - transformations: ${event.transformations}`
        );
    });
})();
