import {
  createSession,
  createViewport,
  GeometryData,
  IMaterialAbstractData,
  IMaterialGemData,
  IMaterialGemDataPropertiesDefinition,
  IMaterialStandardData,
  IMaterialStandardDataPropertiesDefinition,
  ITreeNode,
  MaterialEngine,
  SessionOutputData,
  VISIBILITY_MODE,
} from '@shapediver/viewer';
import { createUi } from '@shapediver/viewer.shared.demo-helper';

/**
* Create the material database of currently loaded materials.
* 
* The material database is a dictionary that maps the name of a material to its data.
* The database is created by iterating over the material definitions provided by the MaterialDatabase output.
*/
const materialDatabase: { [key: string]: IMaterialStandardData | IMaterialGemData } = {};

/**
* Cache the material data to avoid creating the same material multiple times.
* 
* The cache key is a stringified version of the material definition.
*/
const cachedMaterials: { [key: string]: IMaterialStandardData | IMaterialGemData } = {};

/**
* Assign the materials from the material database to the geometries in the scene.
* 
* This function traverses the scene graph and assigns the materials from the material database to the geometries.
* The material of a geometry is assigned based on the name of the material that is stored in the geometry data.
* 
* @param node 
*/
const assignMaterials = (node: ITreeNode) => {
  node.traverse((c) => {
      for (let i = 0; i < c.data.length; i++) {
          const data = c.data[i];
          if (data instanceof GeometryData) {
              const materialName = data.material?.name;
              if (materialName) {
                  if (materialDatabase[materialName]) {
                      data.material = materialDatabase[materialName];
                      data.updateVersion();
                      node.updateVersion();
                  } else {
                      console.warn(`Material ${materialName} not found in material database.`);
                  }
              }
          }
      }
  });
};

(async () => {
  const viewport = await createViewport({
      id: 'myViewport',
      canvas: <HTMLCanvasElement>document.getElementById('canvas'),
      // Set the visibility mode to manual to control the visibility of the scene manually.
      visibility: VISIBILITY_MODE.MANUAL,
  });

  const session = await createSession({
      id: 'mySession',
      ticket: 'a4cb27a39d5abfc65036536db4bfead02fd9ee5e0b1f7d0630454fce5cfaa065fb8ab15821dbcb0136287534fdb6a1a5fd342c88e6948722336e6db5b1b8687c446e4741622c10d25476b6aed467b3afcf66c93e5e3d5070c8e850ff5bde5ee8093088e6936efe-59bd8515ca1f04d33b95507842220b8d',
      modelViewUrl: 'https://sdr8euc1.eu-central-1.shapediver.com',
  });

  // Get the MaterialDatabase output.
  const materialDatabaseOutput = session.getOutputByName('MaterialDatabase')[0];

  if (!materialDatabaseOutput) {
      console.error('MaterialDatabase output not found.');

      // If the MaterialDatabase output is not available, make the viewport visible
      viewport.show = true;
      return;
  }

  /**
   * Create a callback function that is called when the MaterialDatabase output is updated.
   * In this callback, the materials are created from the material definitions and stored in the material database.
   * 
   * @param newNode 
   * @returns 
   */
  const cb = (newNode?: ITreeNode) => {
      if (!newNode) return;

      const materialDatabaseDefinition: { [key: string]: | IMaterialStandardDataPropertiesDefinition | IMaterialGemDataPropertiesDefinition; } = (newNode.data.find((d) => d instanceof SessionOutputData) as SessionOutputData).responseOutput.content?.[0].data;

      const promises: Promise<{ name: string; materialData: IMaterialAbstractData; } | void>[] = [];
      for (const key in materialDatabaseDefinition) {
          // Create a cache key for the material definition.
          const cacheKey = JSON.stringify(materialDatabaseDefinition[key]);

          // If the material data is already cached, use the cached material data.
          if (cachedMaterials[cacheKey]) {
              promises.push(Promise.resolve({ name: key, materialData: cachedMaterials[cacheKey] }));
          } else {
              promises.push(
                  // Create the material data from the material definition.
                  MaterialEngine.instance.createMaterialDataFromDefinition(materialDatabaseDefinition[key])
                      .then((materialData) => {
                          cachedMaterials[cacheKey] = materialData;
                          return { name: key, materialData };
                      })
                      .catch((error) => {
                          console.error(`Error creating material ${key} with properties ${materialDatabaseDefinition[key]}: ${error}`);
                          return;
                      })
              );
          }
      }

      // Once all materials are created, store them in the material database and assign them to the geometries.
      Promise.all(promises).then((materials) => {
          // Store the materials in the material database.
          materials.forEach((material) => {
              if (!material) return;

              material.materialData.name = material.name;
              materialDatabase[material.name] = material.materialData;
          });

          // Assign the materials to the geometries in the scene.
          assignMaterials(session.node);

          // Once the materials are assigned, make the viewport visible.
          viewport.show = true;
      });
  };

  // Assign the callback function to the MaterialDatabase output.
  materialDatabaseOutput.updateCallback = cb;
  // And call the callback function once to initialize the material database.
  cb(materialDatabaseOutput.node);

  // Assign the update callback to the session to assign the materials to the geometries when the scene is updated.
  session.updateCallback = (newNode?: ITreeNode) => {
      if (!newNode) return;

      assignMaterials(newNode);
  };

  // Create the UI for the demo.
  const menuDiv = document.createElement('div');
  menuDiv.id = 'menu';
  menuDiv.style.position = 'absolute';
  menuDiv.style.top = '1rem';
  menuDiv.style.left = '1rem';
  menuDiv.style.zIndex = '100';
  document.body.appendChild(menuDiv);

  createUi(session, menuDiv);
})();
