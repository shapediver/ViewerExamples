import {
    createViewport,
    DataEngine,
    ENVIRONMENT_MAP,
    ITreeNode,
    IViewportApi,
    MaterialVariantsData,
    sceneTree
  } from "@shapediver/viewer";
  
  const dataEngine: DataEngine = DataEngine.instance;
  
  const models: {
    [key: string]: {
      screenshot: string;
      href: string;
      description: string;
      node?: ITreeNode;
    };
  } = {};
  
  models["GlamVelvetSofa"] = {
    description: `
    <p dir="auto">This model represents a real product, a velvet sofa bed being sold <a href="https://www.wayfair.com/furniture/pdp/mercer41-frankie-velvet-86-recessed-arm-sofa-bed-mcrf6337.html" rel="nofollow">on the Wayfair website</a>. The model uses several extensions:</p>
    <ul dir="auto">
    <li><a href="https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual">KHR_lights_punctual</a> to provide a key light for better velvet illumination. Sheen seems to respond better to punctual lights than with image-based lighting alone.</li>
    <li><a href="https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_sheen">KHR_materials_sheen</a> for velvet sheen.</li>
    <li><a href="https://github.com/KhronosGroup/glTF/pull/1719" data-hovercard-type="pull_request" data-hovercard-url="/KhronosGroup/glTF/pull/1719/hovercard">KHR_materials_specular</a> to colorize facing-angle reflections, which occurs with some fabrics (satins, silks, velvets, etc.).</li>
    <li><a href="https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_variants/README.md">KHR_materials_variants</a> to represent the five fabric color options on this product.</li>
    </ul>
    <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/GlamVelvetSofa" rel="nofollow">Source</a>`,
    screenshot: "./images/GlamVelvetSofa.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb"
  };
  models["MaterialsVariantsShoe"] = {
    description: `
    <p dir="auto">This model uses the KHR_materials_variants extension. It is a shoe with 3 color variants in it: "Beach", "Midnight", and "Street".</p>
  <p dir="auto">If each variant was a separate model, they would be 5.4 MB each. Combined they make up a single model that is 7.8MB since they share geometry and all textures except the base color texture.</p>
  <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/MaterialsVariantsShoe" rel="nofollow">Source</a>`,
    screenshot: "./images/MaterialsVariantsShoe.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb"
  };
  
  models["ToyCar"] = {
    description: `<p dir="auto">This model demonstrates the usage of <a href="https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_sheen/README.md">KHR_materials_sheen</a>, <a href="https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_transmission/README.md">KHR_materials_transmission</a> and <a href="https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md">KHR_materials_clearcoat</a>.</p>
    <p dir="auto">This model also includes eight sample cameras, featuring different angles on the car and its materials.  In software packages that represent camera locations with 3D markers, it may be beneficial to reduce the size of these markers, as marker size is not specified in glTF.</p>
    <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/ToyCar" rel="nofollow">Source</a>`,
    screenshot: "./images/ToyCar.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb"
  };
  models["WaterBottle"] = {
    description: `
    <p dir="auto">This model demonstrates the usage of various materials, including different metallic surfaces.</p>
    <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/WaterBottle" rel="nofollow">Source</a>`,
    screenshot: "./images/WaterBottle.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb"
  };
  
  models["DamagedHelmet"] = {
    description: `
    <p dir="auto">This model demonstrates the usage of various materials, including emissive elements (display on the helmet).</p>
    <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/DamagedHelmet" rel="nofollow">Source</a>`,
    screenshot: "./images/DamagedHelmet.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
  };
  models["TransmissionTest"] = {
    description: `
    <p dir="auto">This model demonstrates the usage of the KHR_materials_transmission. The grid of spheres demonstrate different combinations of uniform transmission and textured transmission and how they should render in conjunction with opacity (baseColor.a) and surface roughness/metalicity.</p>
    <a href="https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/TransmissionTest" rel="nofollow">Source</a>`,
    screenshot: "./images/TransmissionTest.png",
    href:
      "https://raw.githubusercontent.com/shapediver/glTF-Sample-Models/master/2.0/TransmissionTest/glTF-Binary/TransmissionTest.glb"
  };
  
  const screenshotsDiv = <HTMLDivElement>document.getElementById("screenshots");
  const animationsDiv = <HTMLDivElement>document.getElementById("animations");
  const materialsDiv = <HTMLDivElement>document.getElementById("materials");
  const descriptionDiv = <HTMLDivElement>document.getElementById("description");
  
  let currentNode: ITreeNode | null = null;
  let viewport: IViewportApi;
  
  const loadModel = (name: string) => {
    const modelDescription = models[name];
  
    const img = new Image(50, 50);
    img.id = name;
    img.src = modelDescription.screenshot;
    img.style.display = "none";
    screenshotsDiv.appendChild(img);
  
    img.onclick = () => {
      if (currentNode) sceneTree.removeNode(currentNode);
      currentNode = null;
      if (modelDescription.node) {
        currentNode = modelDescription.node;
        sceneTree.addNode(currentNode);
        sceneTree.root.updateVersion();
        viewport.show = true;
      } else {
        viewport.show = false;
      }
      viewport.update();
  
      while (materialsDiv.hasChildNodes())
        materialsDiv.removeChild(materialsDiv.firstChild!);
  
      while (animationsDiv.hasChildNodes())
        animationsDiv.removeChild(animationsDiv.firstChild!);
  
      while (descriptionDiv.hasChildNodes())
        descriptionDiv.removeChild(descriptionDiv.firstChild!);
  
      descriptionDiv.innerHTML = modelDescription.description;
  
      const materialVariantsData = <MaterialVariantsData>(
        modelDescription.node!.children[0].data.find(
          (d) => d instanceof MaterialVariantsData
        )
      );
      if (materialVariantsData) {
        const select = <HTMLSelectElement>document.createElement("select");
        materialsDiv.appendChild(select);
        for (let i = 0; i < materialVariantsData.variants.length; i++) {
          let option = <HTMLOptionElement>document.createElement("option");
          option.value = i + "";
          option.setAttribute(
            "name",
            materialVariantsData.variants[i] || "material_" + i
          );
          option.innerHTML = materialVariantsData.variants[i] || "material_" + i;
          select.appendChild(option);
        }
  
        const changeButton = <HTMLButtonElement>document.createElement("button");
        changeButton.innerHTML = "Change";
        materialsDiv.appendChild(changeButton);
  
        changeButton.onclick = () => {
          materialVariantsData.geometryData.forEach((p) => {
            const variant = p.materialVariants.find(
              (m) => m.variant === +select.value
            );
            if (variant) {
              p.material = variant.material;
            } else {
              p.material = p.standardMaterial;
            }
            modelDescription.node!.updateVersion();
          });
          viewport.update();
        };
      }
  
      if (Object.values(viewport.animations).length > 0) {
        const select = <HTMLSelectElement>document.createElement("select");
        animationsDiv.appendChild(select);
        for (let i in viewport.animations) {
          let option = <HTMLOptionElement>document.createElement("option");
          option.value = i + "";
          option.setAttribute(
            "name",
            viewport.animations[i].name || "animation_" + i
          );
          option.innerHTML = viewport.animations[i].name || "animation_" + i;
          select.appendChild(option);
        }
  
        const playButton = <HTMLButtonElement>document.createElement("button");
        playButton.innerHTML = "Play";
        animationsDiv.appendChild(playButton);
  
        playButton.onclick = () => {
          viewport.animations[+select.value].startAnimation();
        };
      }
  
      viewport.camera!.set([0, -7.5, 5], [0, 0, 0], { duration: 0 }).then(() => {
        viewport.camera!.zoomTo(undefined, { duration: 0 });
      });
    };
  
    dataEngine
      .loadContent({
        format: "gltf",
        href: modelDescription.href
      })
      .then((node: ITreeNode) => {
        img.style.display = "";
        modelDescription.node = node;
        console.log(name, node);
        if (Object.keys(models)[0] === name) img.click();
      });
  };
  
  (async () => {
    viewport = await createViewport({
      canvas: <HTMLCanvasElement>document.getElementById("canvas"),
      id: "myViewport",
      branding: {
        backgroundColor: "#303030"
      }
    });
    viewport.createLightScene();
    viewport.environmentMap = ENVIRONMENT_MAP.PHOTO_STUDIO;
    viewport.clearColor = "#303030";
    viewport.groundPlaneVisibility = false;
    viewport.gridVisibility = false;
    viewport.shadows = false;
  
    for (let m in models) loadModel(m);
  })();
  