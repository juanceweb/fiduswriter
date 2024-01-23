import {parseTracks, addTracks} from "./track"

// :: NodeSpec
// An ordered list [node spec](#model.NodeSpec). Has a single
// attribute, `order`, which determines the number at which the list
// starts counting, and defaults to 1. Represented as an `<ol>`
// element.
export const ordered_list = {
    group: "block",
    content: "list_item+",
    attrs: {
        id: {default: false},
        order: {default: 1},
        track: {default: []},

    },
    parseDOM: [{tag: "ol", getAttrs(dom) {
        return {
            id: dom.id,
            order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
            track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id}
        if (node.attrs.order !== 1) {
            attrs.start = node.attrs.order
        }
        addTracks(node, attrs)
        return ["ol", attrs, 0]
    }
}

export function randomListId() {
    return "L" + Math.round(Math.random() * 10000000) + 1
}

// :: NodeSpec
// A bullet list node spec, represented in the DOM as `<ul>`.
export const bullet_list = {
    group: "block",
    content: "list_item+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "ul", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id}
        addTracks(node, attrs)
        return ["ul", attrs, 0]
    }
}

export const actividades = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "actividades_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

export const lectura_obligatoria = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "lectura_obligatoria_borde"}
        const attrs_namespace = {class: "tool-namespace"}
        const attrs_span = {class: "tool-namespace-span"}
        addTracks(node, attrs)
        return ['div', attrs, ["div", attrs_namespace, ["span", attrs_span, "lectura obligatoria"] ], ["div", 0] ]
    }
}

export const para_reflexionar = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "para_reflexionar_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

export const leer_con_atencion = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "leer_con_atencion_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

export const texto_aparte = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "texto_aparte_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

export const ejemplo = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "ejemplo_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

export const lectura_recomendada = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {default: false},
        track: {default: []}
    },
    parseDOM: [{tag: "div", getAttrs(dom) {
        return {
            id: dom.id,
            //track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "lectura_recomendada_borde"}
        addTracks(node, attrs)
        return ["div", attrs, 0]
    }
}

// :: NodeSpec
// A list item (`<li>`) spec.
export const list_item = {
    content: "block+",
    marks: "annotation",
    attrs: {
        track: {default: []}
    },
    parseDOM: [{tag: "li", getAttrs(dom) {
        return {
            track: parseTracks(dom.dataset.track)
        }
    }}],
    toDOM(node) {
        const attrs = {}
        addTracks(node, attrs)
        return ["li", attrs, 0]
    },
    defining: true
}
