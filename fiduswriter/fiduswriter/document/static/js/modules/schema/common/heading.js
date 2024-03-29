import {parseTracks, addTracks} from "./track"

export const randomHeadingId = () => {
    return `H${Math.round(Math.random() * 10000000) + 1}`
}


const createHeading = level => ({
    group: "block heading",
    content: "inline*",
    marks: "_",
    defining: true,
    attrs: {
        id: {
            default: false
        },
        track: {
            default: []
        }
    },
    parseDOM: [
        {
            tag: `h${level}`,
            getAttrs(dom) {
                return {
                    id: dom.id,
                    track: parseTracks(dom.dataset.track)
                }
            }
        }
    ],
    toDOM(node) {
        const attrs = {id: node.attrs.id}
        addTracks(node, attrs)

        if (node.attrs.id == "H7367051") {
            const attrs_namespace = {class: "section-namespace-unidad"}
            const attrs_span = {class: "section-namespace-span-unidad", readonly: "true"}
            attrs.class = "espacio-unidad";
            return ["section", ["div", attrs_namespace, ["span", attrs_span, "UNIDAD"] ], ["p", attrs, 0 ] ] 
       
        }
        else {
            return [`h${level}`, attrs, 0]
        }
    }
})

export const heading1 = createHeading(1)
export const heading2 = createHeading(2)
export const heading3 = createHeading(3)
export const heading4 = createHeading(4)
export const heading5 = createHeading(5)
export const heading6 = createHeading(6)
