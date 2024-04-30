import {
    createSession,
    createViewport,
    viewports
} from "@shapediver/viewer";
import { createUi } from "@shapediver/viewer.shared.demo-helper";

(async () => {
    const promises = [];

    // create the viewports
    for (let i = 0; i < 4; i++) {
        promises.push(
            createViewport({
                id: "viewport" + (i + 1),
                canvas: document.getElementById("canvas" + (i + 1)) as HTMLCanvasElement
            })
        );
    }

    // wait for all viewports to be created
    await Promise.all(promises);

    // create a session
    const session = await createSession({
        ticket:
            "03fb98fed9b4616478f802621e58a37d673b9d1ae243ac2cdc7b4a0f7e7468f0597c70e205fbd71ee6a46e56cdda92686d21ca851fb85228f4bc81a5041e1929b3958c11d2e7ad7f064d7e46c88d00bc88f9bdc50934dd45c7ccc437b65875f0380a5e5df7dabb-6e6e2dca66e788d0510e933ba592425f",
        modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
        id: "mySession"
    });

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0%';
    div.style.left = '0%';
    div.style.cursor = 'move';
    document.body.appendChild(div);
    createUi(session, div)

        // JavaScript for making the div movable
        let offsetX = 0, offsetY = 0, isDragging = false;
    
        // Function to start dragging
        function startDragging(e: PointerEvent) {
            isDragging = true;
            offsetX = e.clientX - div.getBoundingClientRect().left;
            offsetY = e.clientY - div.getBoundingClientRect().top;
        }
    
        // Function to stop dragging
        function stopDragging() {
            isDragging = false;
        }
    
        // Function to move the div
        function dragDiv(e: PointerEvent) {
            if (isDragging) {
                div.style.left = (e.clientX - offsetX) + 'px';
                div.style.top = (e.clientY - offsetY) + 'px';
            }
        }
    
        // Event listeners
        div.addEventListener('pointerdown', startDragging);
        document.addEventListener('pointerup', stopDragging);
        document.addEventListener('pointermove', dragDiv);

    // create a dropdown for each viewport to select the camera
    for (let i = 0; i < 4; i++) {
        const viewport = viewports["viewport" + (i + 1)];
        const viewportDiv = document.getElementById("viewportDiv" + (i + 1));

        // container for the dropdown
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = "0%";
        viewportDiv?.appendChild(div);

        // create the dropdown
        const select = document.createElement("select");
        div?.appendChild(select);

        // add the cameras to the dropdown
        for (let c in viewport.cameras) {
            const option = document.createElement("option");
            option.textContent = c;
            option.value = c;
            select.appendChild(option);
        }

        // assign the selected camera to the viewport
        select.onchange = () => {
            viewport.assignCamera(select.value);
        };

        // assign a different camera to each viewport
        select.value = ["top", "perspective", "front", "right"][i];
        viewport.assignCamera(select.value);
    }
})();
