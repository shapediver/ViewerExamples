# Drawing Tools Usage

## Adding Points
There are three ways to add new points via the drawing tools.

1. If _autoStart_ is active, the insertion process will start right away if there are no points present.
2. Press the __Insert__ key. This will add a point at the position of your cursor and once you click. This will continue until you press either __Enter__ or __Escape__.
2. Hover over a line segment. A new point will appear at the center of the line segment. One you move the new point it will be added permanently.

## Removing Points
You can remove points by selecting them and pressing __Delete__.

## Moving Points
You can either move points separately my dragging a point or you can select multiple points by clicking on them an then move them all at once.

You can restrict the movement by:
- pressing __g__ to snap to the grid
- pressing __a__ to snap to angles
- pressing __x__, __y__ or __z__ to snap to the axis

## History of Operations
You can also undo (__Ctrl+z__) and redo (__Ctrl+y__) operations.

## Update & Cancel the Drawing Tools
You can either update or cancel the drawing tools. Updating the drawing tools (__Enter__-key) means that you send the current state of the drawing tools as a customization request to the server and that you can continue the drawing after this process (if _closeOnUpdate_ is set to _false_). Cancelling the drawing tools (__Escape__-key) will result in closing the drawing tools and forgetting about all the progress that was done.

If the option _autoUpdate_ has been selected, the drawing tool will update every time a point has been added, moved or removed.

If the option _autoClose_ has been selected, the drawing will update once the line loop has been closed.