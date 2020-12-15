import "reflect-metadata"
import { api } from "@shapediver/viewer"
import { RendererType } from "@shapediver/viewer";

const modelViewUrl = 'https://sdeuc1.eu-central-1.shapediver.com';
const ticket = 'd6f62ac43b39b2899c85de0258e4f395a49617f6c485da65f1450430f8991e1c31231c434b3504254444b4bb81bc7799e26056b92fcd2fd8f8f1500bbdf73867ed2e87862a9a1349bb182bd4d4a764ff4689bfe19a87b07ebff5847565a83db1ab3002ec006a90841bed2a95fa3ae9663655e05febde-78055df2d71f54f8ca8d3815a352e2c8';

const init = async () => {
    await api.createSession(ticket, modelViewUrl, 'mySession');
    await api.createViewer(RendererType.THREE, <HTMLCanvasElement>document.getElementById('canvas'), 'myViewer')
}
init();

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