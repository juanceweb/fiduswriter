import {addTracks} from "./track";

export const cross_reference = {
    inline: true,
    group: "inline",
    attrs: {
        id: {
            default: false
        },
        title: {
            default: null // title === null means that the target is gone
        }
    },
    parseDOM: [{
        tag: "span.cross-reference[data-id][data-title]",
        getAttrs(dom) {
            return {
                id: dom.dataset.id,
                title: dom.dataset.title
            }
        }
    }],
    toDOM(node) {
        return ["span", {
            class: `cross-reference${ node.attrs.title ? "" : " missing-target"}`,
            "data-id": node.attrs.id,
            "data-title": node.attrs.title
        }, node.attrs.title ? node.attrs.title : gettext("Missing Target")]
    }
}

export const hyperlink = {
    attrs: {
        href: {},
        title: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            tag: "a[href]",
            getAttrs(dom) {
                return {
                    href: dom.getAttribute("href"),
                    title: dom.getAttribute("title")
                }
            }
        }
    ],
    toDOM(node) {

        console.log(node.type.name)

        const {href, title} = node.attrs
        const attrs = title || href.charAt(0) !== "#" ? {href, title} : {href, title: gettext("Missing target"), class: "missing-target"}
        return ["a", attrs, 0 ]
    }
}

export const link = {
    attrs: {
        href: {},
        title: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            tag: "a[href]",
            getAttrs(dom) {
                return {
                    href: dom.getAttribute("href"),
                    title: dom.getAttribute("title")
                }
            }
        }
    ],
    toDOM(node) {

        console.log(node.type.name)

        const {href, title} = node.attrs
        const attrs = title || href.charAt(0) !== "#" ? {href, title} : {href, title: gettext("Missing target"), class: "missing-target"}
        return ["a", attrs, 0 ]
    }
}

export const video = {
    group: "block",
    content: "blockquote+",
    attrs: {
        id: {
            default: false
        },
        titulo: {
            default: null
        },
        urlVideo: {
            default: null
        },
        desc: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {
                    id: dom.id,
                    desc: dom.getAttribute("desc"),
                    urlVideo: dom.getAttribute("urlVideo"),
                    titulo: dom.getAttribute("titulo")

                }
            }
        }
    ],
    toDOM(node) {

        const attrs = {id: node.attrs.id, class: "audiovisual-borde"}
        const attrsText = {class: "audiovisual-text", readonly: "true" }
        const attrsVideo = {width:"300", height:"200", src:"https://www.youtube.com/embed/"+node.attrs.urlVideo}
        const attrsDel = {class:"remove-article-part", onclick: "newAlert(event)"}
        const attrs_namespace = {class: "tool-namespace"}
        const attrs_span = {class: "tool-namespace-span", readonly: "true"}
        addTracks(node, attrs)

        return ["div", attrs , ["div", attrs_namespace, ["span", attrs_span, "AUDIOVISUAL"] ], ["p", attrsText, node.attrs.titulo ] , ["iframe", attrsVideo, 0] , ["p", attrsText, node.attrs.desc], ["div", attrsDel, ["i", {class: "fa fa-trash-alt"}] ] ]
    }
}

export const citaTool = {
    group: "block",
    content: "blockquote+",
    attrs: {

        cita: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {

                    cita: dom.getAttribute("urlInteractivo")
                }
            }
        }
    ],
    toDOM(node) {
        const attrs = { id: node.attrs.id, class: "audiovisual-borde" }
        const attrsText = {class: "audiovisual-text", readonly: "true" }
        const attrsDel = {class:"remove-article-part", onclick: "newAlert(event)"}
        const attrs_namespace = {class: "tool-namespace"}
        const attrs_span = {class: "tool-namespace-span"}
        addTracks(node, attrs)

        return ["strong", {class:'class_cita'} , 0 ]
    }
}

export const audio = {
    group: "block",
    content: "blockquote+",
    attrs: {
        titulo: {
            default: null
        },
        desc: {
            default: null
        },
        urlAudio: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {
                    desc: dom.getAttribute("desc"),
                    urlAudio: dom.getAttribute("urlAudio"),
                    titulo: dom.getAttribute("titulo")

                }
            }
        }
    ],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "audiovisual-borde"}
        const attrsText = {class: "audiovisual-text", readonly: "true" }
        const attrsAudio = {frameBorder:'0', allowFullScreen:'', scrolling:'no', height:'150', style:'width:95%;', src:node.attrs.urlAudio ,loading:'lazy'}
        const attrsDel = {class:"remove-article-part", onclick: "newAlert(event)"}
        const attrs_namespace = {class: "tool-namespace"}
        const attrs_span = {class: "tool-namespace-span", readonly: "true"}
        addTracks(node, attrs)

        return ["div", attrs , ["div", attrs_namespace, ["span", attrs_span, "AUDIO"] ], ["p", attrsText, node.attrs.titulo ] , ["iframe", attrsAudio, 0] , ["p", attrsText, node.attrs.desc], ["div", attrsDel, ["i", {class: "fa fa-trash-alt"}] ] ]
    }
}

export const randomAnchorId = () => {
    return `A${Math.round(Math.random() * 10000000) + 1}`
}

export const interactivo = {
    group: "block",
    content: "blockquote+",
    attrs: {

        urlInteractivo: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {

                    urlInteractivo: dom.getAttribute("urlInteractivo")
                }
            }
        }
    ],
    toDOM(node) {
        const attrs = { id: node.attrs.id, class: "audiovisual-borde" }
        const attrsText = {class: "audiovisual-text", readonly: "true" }
        const attrsInteractivo = {frameBorder:'0', allowFullScreen:'', scrolling:'no', width:"300", height:"200", src: node.attrs.urlInteractivo ,loading:'lazy'}
        const attrsDel = {class:"remove-article-part", onclick: "newAlert(event)"}
        const attrs_namespace = {class: "tool-namespace"}
        const attrs_span = {class: "tool-namespace-span", readonly: "true"}
        addTracks(node, attrs)

        return ["div", attrs , ["div", attrs_namespace, ["span", attrs_span, "INTERACTIVO"] ], ["p", attrsText, "" ] , ["iframe", attrsInteractivo, 0] , ["p", attrsText, ""], ["div", attrsDel, ["i", {class: "fa fa-trash-alt"}] ] ]
    }
}

export const anchor = {
    attrs: {
        id: {
            default: false
        }
    },
    inclusive: false,
    group: "annotation",
    parseDOM: [{
        tag: "span.anchor[data-id]",
        getAttrs(dom) {
            return {
                id: dom.dataset.id
            }
        }
    }],
    toDOM(node) {
        return ["span", {
            class: "anchor",
            "data-id": node.attrs.id
        }]
    }
}

