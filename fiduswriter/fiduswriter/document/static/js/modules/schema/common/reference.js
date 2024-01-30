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
        const {href, title} = node.attrs
        const attrs = title || href.charAt(0) !== "#" ? {href, title} : {href, title: gettext("Missing target"), class: "missing-target"}
        return ["a", attrs, 0]
    }
}

export const video = {
    group: "block",
    content: "blockquote+",
    attrs: {
        titulo: {
            default: null
        },
        desc: {
            default: null
        },
        urlVideo: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {
                    desc: dom.getAttribute("desc"),
                    urlVideo: dom.getAttribute("urlVideo"),
                    titulo: dom.getAttribute("titulo")

                }
            }
        }
    ],
    toDOM(node) {
        const attrs = {id: node.attrs.id, class: "video_borde"}
        const attrsVideo = {width:"300", height:"200", src:"https://www.youtube.com/embed/"+node.attrs.urlVideo}
        console.log(node.attrs)
        addTracks(node, attrs)
        return ["div", attrs , ["p", node.attrs.titulo ] , ["iframe", attrsVideo, 0] , ["p", node.attrs.desc] ]
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
        },
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
        const attrs = {id: node.attrs.id, class: "audio_borde"}

        const attrsAudio = {frameBorder:'0', allowFullScreen:'', scrolling:'no', height:'200', style:'width:100%;', src:node.attrs.urlAudio ,loading:'lazy'}
        addTracks(node, attrs)
        return ["div", attrs , ["p", node.attrs.titulo ] , ["iframe", attrsAudio, 0] , ["p", node.attrs.desc] ]
    }
}

export const randomAnchorId = () => {
    return `A${Math.round(Math.random() * 10000000) + 1}`
}

export const encuesta = {
    group: "block",
    content: "blockquote+",
    attrs: {

        urlEncuesta: {
            default: null
        }
    },
    inclusive: false,
    parseDOM: [
        {
            getAttrs(dom) {
                return {

                    urlEncuesta: dom.getAttribute("urlEncuesta")
                }
            }
        }
    ],
    toDOM(node) {
        const attrs = {width:"833", height:"532", src:node.attrs.urlEncuesta ,id: node.attrs.id, class: "encuesta_borde"}
        addTracks(node, attrs)
        return ["iframe", attrs, 0]
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
