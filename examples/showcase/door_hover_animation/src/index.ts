import {
    createViewport,
    createSession,
    EVENTTYPE_INTERACTION,
    ITreeNode,
    IAnimationData,
    AnimationData,
    addListener,
    SessionOutputData
} from '@shapediver/viewer';
import {
    HoverManager,
    InteractionData,
    InteractionEngine,
    InteractionEventResponseMapping
} from '@shapediver/viewer.features.interaction';
import { quat } from 'gl-matrix';

/**
* Type definition for the animation definition.
* 
* The animation definition is a JSON object that defines the animations for the doors.
* This object is created by the ShapeDiver model and is passed to the viewer as a JSON string.
* 
* The key of the object is the name of the door.
* The value of the object is an object with the following properties:
*  - type: The type of the animation. Currently only "rotation" is supported.
*  - values: An array of objects with the following properties:
*      - axis: The axis of the rotation as a 3D vector.
*      - angle: The angle of the rotation in radians.
*  - times: An array of times in seconds.
*  - pivot: The pivot point of the rotation as a 3D vector.
*  - start: The start time of the animation in seconds.
*  - duration: The duration of the animation in seconds.
*/
type AnimationDefinition = {
    [key: string]: {
        type: 'rotation';
        values: { axis: [number, number, number]; angle: number }[];
        times: number[];
        pivot: [number, number, number];
        start: number;
        duration: number;
    };
};

/**
* The animation definition object.
* 
* This object is used to store the animation definition that is passed to the viewer by the ShapeDiver model.
*/
let animationDefinition: AnimationDefinition = {};

(async () => {
    // create the viewport
    const viewport = await createViewport({
        id: 'myViewport',
        canvas: <HTMLCanvasElement>document.getElementById('canvas')
    });
    // create the session
    const session = await createSession({
        id: 'mySession',
        ticket:
            'bd1aae54986404b828b724aac6b626f6dff189fe386882864c0479cc2b3ad7cd02fe76347e2aeef7bcf5e82403494591a1a51ff2085f1a77b5b313bad9362d5d16745c6373ebf539875027203b30362741ee29c2944a143ff68cdb7a9b6cc6da5dba57e24cf6a2-0fccb6a4771a0b62c528a827d199c5bc',
        modelViewUrl: 'https://sdr7euc1.eu-central-1.shapediver.com'
    });

    // create the interaction engine
    const interactionEngine = new InteractionEngine(viewport);

    // create the hover manager and add it to the interaction engine
    const hoverManager = new HoverManager();
    interactionEngine.addInteractionManager(hoverManager);

    // read out the door data output and doors output
    const doorDataOutput = session.getOutputByName('DoorData')[0];
    const doorOutput = session.getOutputByName('Doors')[0];

    /**
     * Add an event listener for the hover on event.
     * 
     * This event listener is triggered when the user hovers over a node.
     * When the user hovers over a node, the animation for the node is started.
     * 
     * Note: The addListener functions returns a token that can be used to remove the event listener.
     */
    addListener(EVENTTYPE_INTERACTION.HOVER_ON, (e) => {
        const selectionEvent = e as InteractionEventResponseMapping[EVENTTYPE_INTERACTION.HOVER_ON];
        const selectedNode = selectionEvent.nodes[0];
        const selectedNodeName = selectedNode.name;
        if (viewport.animations[selectedNodeName].animate === false)
            viewport.animations[selectedNodeName].startAnimation();
    });

    /**
     * Register an update callback for the door data output.
     * 
     * This update callback is triggered when the door data output is updated.
     * 
     * @param newNode 
     * @returns 
     */
    doorDataOutput.updateCallback = (newNode?: ITreeNode) => {
        if (!newNode) return;

        // extract the animation definition from the output data
        const outputData = newNode.data.find((d) => d instanceof SessionOutputData)!;
        animationDefinition = (outputData as SessionOutputData).responseOutput.content![0]
            .data as AnimationDefinition;

        // trigger the update callback for the doors output
        if (doorOutput.updateCallback)
            doorOutput.updateCallback(doorOutput.node);
    };
    // trigger the update callback for the door data output once to initialize the animation definition
    doorDataOutput.updateCallback(doorDataOutput.node);

    /**
     * Register an update callback for the doors output.
     * 
     * This update callback is triggered when the doors output is updated.
     * 
     * @param newNode 
     * @returns 
     */
    doorOutput.updateCallback = (newNode?: ITreeNode) => {
        if (!newNode) return;

        // remove all existing animation data from the nodes
        newNode.data
            .filter((d) => d instanceof AnimationData)
            .forEach((ad) => newNode.removeData(ad));

        // traverse the animation definition and add the animation data to the nodes
        for (const key in animationDefinition) {
            const animationDef = animationDefinition[key];

            // find the node by name
            const nodes = newNode.getNodesByName(key);

            // check if no node was found, or if multiple nodes were found
            if (!nodes || nodes.length === 0 || nodes.length > 1) {
                console.error(`Node ${key} not found or multiple nodes found.`);
                continue;
            }

            const node = nodes[0];

            // remove all existing interaction data from the node
            node.data
                .filter((d) => d instanceof InteractionData)
                .forEach((id) => node.removeData(id));

            // add the hover interaction data to the node
            node.addData(new InteractionData({ hover: true }));
            node.updateVersion();

            // create the animation data and add it to the node
            const animationData: IAnimationData = new AnimationData(
                key,
                [
                    {
                        path: animationDef.type,
                        // convert the rotation values to quaternions
                        values: animationDef.values
                            .map((v) => {
                                const q = quat.setAxisAngle(quat.create(), v.axis, v.angle);
                                return [q[0], q[1], q[2], q[3]];
                            })
                            .flat(),
                        times: animationDef.times,
                        pivot: animationDef.pivot,
                        interpolation: 'linear',
                        node: nodes[0]
                    }
                ],
                animationDef.start,
                animationDef.duration
            );

            // add the animation data to the node
            newNode.addData(animationData);
        }
        newNode.updateVersion();
    };
    // trigger the update callback for the doors output once to initialize the animation data
    doorOutput.updateCallback(doorOutput.node);
})();
