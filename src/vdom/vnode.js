const VNODE_TYPE = 'VNODE_TYPE'

export function isSameNode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type
}

export function isVnode(vnode) {
    return vnode && vnode._type == VNODE_TYPE
}

export function vnode(type, key, props = {}, children = [],text, domElement) {
    return {
        _type: VNODE_TYPE,
        type, key, props, children, text, domElement
    }
}

export default vnode
