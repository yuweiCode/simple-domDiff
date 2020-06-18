import {isSameNode} from "./vnode";

function createDOMElementFromVnode(vnode) {
    let {type ,props, children} = vnode
    if(type) {
        let domElement = vnode.domElement =  document.createElement(type)
        updateProperties(vnode)
        if(Array.isArray(vnode.children)) {
            children.forEach(child => domElement.appendChild(createDOMElementFromVnode(child)))
        }
    } else {
        vnode.domElement = document.createTextNode(vnode.text)
    }
    return vnode.domElement
}

function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.props
    let domElement = vnode.domElement
    let oldStyle = oldProps.style || {}
    let newStyle = newProps.style || {}

    for(let oldAttrName in oldStyle) {
        if(!newStyle[oldAttrName]) {
            domElement.style[oldAttrName] = ''
        }
    }

    for(let oldPropName in oldProps) {
        if(!newProps[oldPropName]) {
            delete domElement[oldPropName]
        }
    }

    for(let newPropName in newProps) {
        if(newPropName === 'style') {
            let styleObject = newProps.style
            for(let newAttrName in styleObject) {
                domElement.style[newAttrName] = styleObject[newAttrName]
            }
        }else {
            domElement[newPropName] = newProps[newPropName]
        }
    }
}

export function mount(vnode ,container) {
    let newDOMElement = createDOMElementFromVnode(vnode)
    container.appendChild(newDOMElement)
}

export function patch(oldNode, newNode) {
    if(oldNode.type !== newNode.type) {
        oldNode.domElement.parentNode.replaceChild(createDOMElementFromVnode(newNode),oldNode.domElement)
    }
    if(typeof newNode.text !== 'undefined') {
        return oldNode.domElement.textContent = newNode.text
    }
    //类型一样
    let domElement = newNode.domElement = oldNode.domElement
    updateProperties(newNode,oldNode.props)

    let oldChildren = oldNode.children
    let newChildren = newNode.children

    if(oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(domElement,oldChildren,newChildren)

    } else if (oldChildren.length > 0) {
        oldNode.domElement.innerHTML = ''
    } else if (newChildren.length > 0) {
        for (let i = 0; i < newChildren.length;i++) {
            oldNode.domElement.appendChild(createDOMElementFromVnode(newChildren[i]))
        }
    }
}

function createKeyToIndexMap(children) {
    let map = {}
    for(let i = 0;i < children.length;i++) {
        let key = children[i].key
        if(key) {
            map[key] = i
        }
    }
    return map
}

function updateChildren(parentDomElement, oldChildren, newChildren) {
    let oldStartIndex = 0,oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1,oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0,newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1,newEndVnode = newChildren[newEndIndex]
    let oldKeyToIndexMap = createKeyToIndexMap(oldChildren)

    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex]
        } else if(!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        }
        else if(isSameNode(oldStartVnode,newStartVnode)) {
            patch(oldStartVnode,newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if(isSameNode(oldEndVnode,newEndVnode)) {
            patch(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if(isSameNode(oldEndVnode,newStartVnode)) {
            patch(oldEndVnode,newStartVnode)
            parentDomElement.insertBefore(oldEndVnode.domElement,oldStartVnode.domElement)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if(isSameNode(oldStartVnode,newEndVnode)) {
            patch(oldStartVnode,newEndVnode)
            parentDomElement.insertBefore(oldStartVnode.domElement,oldEndVnode.domElement.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else {
             let oldIndexByKey = oldKeyToIndexMap[newStartVnode.key]
            if(oldIndexByKey == null) {
                parentDomElement.insertBefore(createDOMElementFromVnode(newStartVnode),oldStartVnode.domElement)
            }else {
                let oldVnodeToMove = oldChildren[oldIndexByKey]
                if(oldVnodeToMove.type !== newStartVnode.type) {
                    parentDomElement.insertBefore(createDOMElementFromVnode(newStartVnode),oldStartVnode.domElement)
                }
                patch(oldVnodeToMove, newStartVnode)
                oldChildren[oldIndexByKey] = undefined
                parentDomElement.insertBefore(oldVnodeToMove.domElement,oldStartVnode.domElement)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }

    if(newStartIndex <= newEndIndex) {
        let beforeDOMElement =
            newChildren[newEndIndex + 1] == null
                ? null
                : newChildren[newEndIndex + 1].domElement
        //console.log(beforeDOMElement)

        for (let i = newStartIndex;i <= newEndIndex; i++) {
            //console.log(createDOMElementFromVnode(newChildren[i]))
            parentDomElement.insertBefore(createDOMElementFromVnode(newChildren[i]),beforeDOMElement)
            //parentDomElement.appendChild(createDOMElementFromVnode(newChildren[i]))
        }
    }

    if(oldStartIndex <= oldEndIndex) {
        for (let i= oldStartIndex; i <= oldEndIndex;i++) {
            parentDomElement.removeChild(oldChildren[i].domElement)
        }
    }
}
