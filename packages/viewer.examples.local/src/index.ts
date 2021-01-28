import "reflect-metadata"

import * as a from "@shapediver/viewer.api"
import * as b from "@shapediver/viewer.data-engine.data-engine"
import * as c from "@shapediver/viewer.data-engine.geometry-engine"
import * as d from "@shapediver/viewer.data-engine.material-engine"
import * as e from "@shapediver/viewer.monitoring.error-handler"
import * as f from "@shapediver/viewer.monitoring.logger"
import * as g from "@shapediver/viewer.monitoring.performance-evaluator"
import * as h from "@shapediver/viewer.node-tree.tree"
import * as i from "@shapediver/viewer.node-tree.tree-node"
import * as j from "@shapediver/viewer.node-tree.tree-node-data"
import * as k from "@shapediver/viewer.sdtf.converter"
import * as l from "@shapediver/viewer.sdtf.parser"
import * as m from "@shapediver/viewer.sdtf.shared"
import * as n from "@shapediver/viewer.session-engine.session-engine"
import * as o from "@shapediver/viewer.shared.event-engine"
import * as p from "@shapediver/viewer.shared.settings-engine"
import * as q from "@shapediver/viewer.shared.types"
import * as r from "@shapediver/viewer.utils.http-client"
import * as s from "@shapediver/viewer.utils.image-loader"
import * as t from "@shapediver/viewer.utils.uuid"
import * as u from "@shapediver/viewer.visualization-engine.camera-engine"
import * as v from "@shapediver/viewer.visualization-engine.canvas-engine"
import * as w from "@shapediver/viewer.visualization-engine.light-engine"
import * as x from "@shapediver/viewer.visualization-engine.rendering-engine"
import * as y from "@shapediver/viewer.visualization-engine.rendering-engine-babylonjs"
import * as z from "@shapediver/viewer.visualization-engine.rendering-engine-management"
import * as a1 from "@shapediver/viewer.visualization-engine.rendering-engine-threejs"

// TODO this for every package
console.log(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,a1)



import { api } from "@shapediver/viewer.api"
import { RendererType } from "@shapediver/viewer.api";
import { mat4 } from "gl-matrix";



const modelViewUrl = 'https://sdeuc1.eu-central-1.shapediver.com';
const ticket = 'd6f62ac43b39b2899c85de0258e4f395a49617f6c485da65f1450430f8991e1c31231c434b3504254444b4bb81bc7799e26056b92fcd2fd8f8f1500bbdf73867ed2e87862a9a1349bb182bd4d4a764ff4689bfe19a87b07ebff5847565a83db1ab3002ec006a90841bed2a95fa3ae9663655e05febde-78055df2d71f54f8ca8d3815a352e2c8';

const init = async () => {
    await api.createSession(ticket, modelViewUrl, 'mySession');
    await api.createViewer(RendererType.THREE, <HTMLCanvasElement>document.getElementById('canvas'), 'myViewer')
}
init();

(<any>window).instances = async (count: number) => {
    const session = api.getSession('mySession');
    for(let x = 0; x < count; x++) {
        for(let y = 0; y < count; y++) {
            for(let z = 0; z < count; z++) {
                const instanceClone = session.node.cloneInstance();
                const translation = mat4.create();
                mat4.fromTranslation(translation, [x*100 - ((count-1)*100) / 2, y*25- ((count-1)*25) / 2, z*25- ((count-1)*25) / 2]);
                instanceClone.transformations.push({
                    id: `transformation_x_${x}_y_${y}_z_${z}`,
                    name: `transformation_x_${x}_y_${y}_z_${z}`,
                    matrix: translation
                })
                api.sceneTree.addNode(instanceClone)
            }
        }
    }
    api.sceneTree.root.updateVersion();
    api.onUpdate()
}

(<any>window).sceneTree = api.sceneTree;

(<any>window).changeParameter = async (name: string, value: string) => {
    const param = api.getSession('mySession').getParameterByName(name);
    for(let i = 0; i < param.length; i++)
        param[i].value = value;
    await api.getSession('mySession').customize();
}

(<any>window).addSDTFOutput = async (uri: string) => {
    const session = api.getSession('mySession');
    const output = session.createOutput('sdtfFile');
    output.content = [];
    output.content.push({
        format: 'sdtf',
        href: uri
    });
    await session.customize();
}