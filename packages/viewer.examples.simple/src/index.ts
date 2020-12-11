import 'reflect-metadata';
import { RendererType, RenderingEngineManagement } from '@shapediver/viewer.visualization-engine.rendering-engine-management';
import { Tree } from '@shapediver/viewer.node-tree.tree';
import { SessionEngine } from '@shapediver/viewer.session-engine.session-engine';
import { container } from 'tsyringe';

const modelViewUrl = 'https://sdeuc1.eu-central-1.shapediver.com';
const ticket1 = 'd6f62ac43b39b2899c85de0258e4f395a49617f6c485da65f1450430f8991e1c31231c434b3504254444b4bb81bc7799e26056b92fcd2fd8f8f1500bbdf73867ed2e87862a9a1349bb182bd4d4a764ff4689bfe19a87b07ebff5847565a83db1ab3002ec006a90841bed2a95fa3ae9663655e05febde-78055df2d71f54f8ca8d3815a352e2c8';

const init = async () => {
    const sceneTree = new Tree();
    sceneTree.addNode(await new SessionEngine(ticket1, modelViewUrl).init());

    const renderingEngineManagement = <RenderingEngineManagement>container.resolve(RenderingEngineManagement);
    let engine = renderingEngineManagement.createNewRenderingEngine(RendererType.THREE, 'rendering-engine', "canvas");
    engine.updateSceneTree(sceneTree.root);

    (<HTMLCanvasElement>document.getElementById('canvas')).width = window.innerWidth;
    (<HTMLCanvasElement>document.getElementById('canvas')).height = window.innerHeight;
}

init();