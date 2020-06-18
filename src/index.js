import { h, mount, patch } from './vdom'

const root = document.getElementById('root');
/*const oldVnode = h('ul' ,{id: 'container'},
    h('li',{ style: {backgroundColor: '#110000'},key: 'A'}, 'A'),
    h('li',{ style: {backgroundColor: '#440000'},key: 'B'}, 'B'),
    h('li',{ style: {backgroundColor: '#770000'},key: 'C'}, 'C'),
    h('li',{ style: {backgroundColor: '#AA0000'},key: 'D'}, 'D'),
);
const newVnode = h('ul' ,{id: 'container'},
    //h('li',{ style: {backgroundColor: '#AA0000'},key: 'E'}, 'E'),
    //h('li',{ style: {backgroundColor: '#EE0000'},key: 'F'}, 'F'),
    h('li',{ style: {backgroundColor: '#AA0000'},key: 'E'}, 'E'),
    //
    h('li',{ style: {backgroundColor: '#440000'},key: 'B'}, 'B1'),
    h('li',{ style: {backgroundColor: '#110000'},key: 'A'}, 'A1'),
    h('li',{ style: {backgroundColor: '#AA0000'},key: 'D'}, 'D1'),
    //h('li',{ style: {backgroundColor: '#770000'},key: 'C'}, 'C1'),
    h('li',{ style: {backgroundColor: '#EE0000'},key: 'F'}, 'F'),
);*/

const oldVnode = h('ul' ,{id: 'container'},
    h('li',{ style: {backgroundColor: '#110000'},key: 'A'}, 'A'),
    h('li',{ style: {backgroundColor: '#440000'}}, 'B'),
    h('li',{ style: {backgroundColor: '#770000'},key: 'C'}, 'C'),
    h('li',{ style: {backgroundColor: '#AA0000'}}, 'D'),
);
const newVnode = h('ul' ,{id: 'container'},
    h('li',{ style: {backgroundColor: '#440000'}}, 'B1'),
    h('li',{ style: {backgroundColor: '#110000'},key: 'A'}, 'A1'),

    h('li',{ style: {backgroundColor: '#AA0000'},key: 'Y'}, 'Y'),
    //
    h('li',{ style: {backgroundColor: '#AA0000'}}, 'X'),
    h('li',{ style: {backgroundColor: '#770000'}}, 'E'),
    h('li',{ style: {backgroundColor: '#EE0000'},key: 'C'}, 'C'),
);

mount(oldVnode, root)
// Dom节点 =》 文本节点
//const newNode = h('ul', {id: 'newContainer'})
setTimeout(() => {
    patch(oldVnode, newVnode)
}, 1000)
