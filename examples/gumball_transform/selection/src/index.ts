import * as SDV from '@shapediver/viewer';
import { addListener, EVENTTYPE_TRANSFORMATION_TOOLS } from '@shapediver/viewer';
import { GumballTransform, EventResponseMapping } from '@shapediver/viewer.features.transformation-tools';
import { InteractionData, InteractionEngine, MultiSelectManager, InteractionEventResponseMapping, HoverManager, IMultiSelectEvent } from '@shapediver/viewer.features.interaction';

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
        ticket: '15c0551e793c59b3b558655913c0f33efce8ea2effc58b6f6907a063e8c6bb77502f6e72db0408855ac0acb68e4b92a0490cf845bf782d357247a6d5b4604f01880bcf95c43f15c6c0789aa2e8bef59d6df321aac7292c3891e945e4101fbec6f584ef03c17442-710443a1a5148421098322a671d18b37',
        modelViewUrl: 'https://sddev3.eu-central-1.shapediver.com'
    });

    const boxesOutput = session.getOutputByName('Boxes')[0];
    // add interaction data to all boxes
    boxesOutput.node!.getNodesByNameWithRegex(new RegExp(/^box_/)).forEach(box => {
        box.addData(new InteractionData({ hover: true, select: true }));
        box.updateVersion();
    });

    // create the interaction engine
    const interactionEngine = new InteractionEngine(viewport);

    // create the multi select manager
    const multiSelectManager = new MultiSelectManager();
    multiSelectManager.effectMaterial = new SDV.MaterialStandardData({ color: 'red' });
    interactionEngine.addInteractionManager(multiSelectManager);

    // create the hover manager
    const hoverManager = new HoverManager();
    hoverManager.effectMaterial = new SDV.MaterialStandardData({ color: 'blue' });
    interactionEngine.addInteractionManager(hoverManager);

    // create an event listener for the gumball
    const eventListenerToken = addListener(EVENTTYPE_TRANSFORMATION_TOOLS.MATRIX_CHANGED, (e) => {
        const gumballEvent = e as EventResponseMapping[EVENTTYPE_TRANSFORMATION_TOOLS.MATRIX_CHANGED];

        // show the notification
        sendNotification(
            'Gumball has changed',
            `- viewportId: ${gumballEvent.viewportId}
            - nodes: ${gumballEvent.nodes}
            - transformations: ${gumballEvent.transformations}`
        );
    });

    let gumball: GumballTransform | undefined;

    // create a gumball on multi select
    const eventListenerCallback = (e: IMultiSelectEvent) => {
        // close the gumball if it is open
        if (gumball) {
            gumball.close();
        }

        // create the gumball if there are nodes selected
        if (e.nodes.length > 0) {
            gumball = new GumballTransform(viewport, e.nodes);
        }
    };

    // add event listeners for multi select
    addListener(SDV.EVENTTYPE_INTERACTION.MULTI_SELECT_ON, (e) => {
        const multiSelectEvent = e as InteractionEventResponseMapping[SDV.EVENTTYPE_INTERACTION.MULTI_SELECT_ON];
        eventListenerCallback(multiSelectEvent);
    });

    // add event listeners for multi select
    addListener(SDV.EVENTTYPE_INTERACTION.MULTI_SELECT_OFF, (e) => {
        const multiSelectEvent = e as InteractionEventResponseMapping[SDV.EVENTTYPE_INTERACTION.MULTI_SELECT_OFF];
        eventListenerCallback(multiSelectEvent);
    });
})();
