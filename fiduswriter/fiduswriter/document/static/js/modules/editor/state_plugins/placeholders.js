import {Plugin, PluginKey} from "prosemirror-state"
import {Decoration, DecorationSet} from "prosemirror-view"

const key = new PluginKey("placeholders")
export const placeholdersPlugin = function(options) {

    function calculatePlaceHolderDecorations(state) {
        const anchor = state.selection.$anchor
        const head = state.selection.$head
        if (!anchor || !head) {
            return
        }
        const anchorPart = anchor.node(2)
        const headPart = head.node(2)
        if (!anchorPart || !headPart) {
            return
        }
        const currentPart = anchorPart === headPart ? anchorPart : false
        const articleNode = state.doc.firstChild

        const decorations = []

        articleNode.forEach((partElement, offset) => {
            if (
                (partElement.isTextblock && partElement.childCount === 0) ||
                (!partElement.isTextblock && partElement.nodeSize === 4)
            ) {
                if (
                    [
                        state.schema.nodes["tags_part"],
                        state.schema.nodes["contributors_part"]
                    ].includes(partElement.type) &&
                    options.editor.docInfo.access_rights === "write"
                ) {
                    // We don't need to render placeholders for these kinds
                    // of nodes in write mode as their nodeviews will take
                    // care of that.
                    return
                }

                let text = partElement.type === state.schema.nodes["title"] ? `${gettext("Nombre")}...` : `${partElement.attrs.title}...`

                if (text == "Unidad...") {
                    text = "1. Unidad..."
                }
                else if (text == "Nombre...") {
                    text = "Material..."
                }

                const placeHolder = document.createElement("span")
                placeHolder.classList.add("placeholder")
                placeHolder.setAttribute("data-placeholder", text)
                if (currentPart === partElement) {
                    placeHolder.classList.add("selected")
                }
                let position = 2 + offset
                // position of decorator: 2 to get inside (doc (1) + article (1))
                if (!partElement.isTextblock) {
                    // In block nodes that are not text blocks (body + abstract)
                    // place inside the first child node (a paragraph).
                    position += 1
                }
                decorations.push(Decoration.widget(
                    position,
                    placeHolder,
                    {
                        side: 1
                    }
                ))
            } else if (["richtext_part", "table_part"].includes(partElement.type.name)) {
                partElement.descendants((node, pos) => {
                    if (["figure", "table"].includes(node.type.name) && !node.attrs.caption) {
                        return false
                    }
                    if (["figure_caption", "table_caption"].includes(node.type.name) && node.childCount === 0 && state.selection.$anchor.parent !== node) {
                        decorations.push(
                            Decoration.node(2 + offset + pos, 2 + offset + pos + node.nodeSize, {
                                class: "empty",
                                "data-placeholder": `${gettext("Caption")}...`
                            })
                        )
                    }
                })
            }

        })

        return decorations.length ? DecorationSet.create(state.doc, decorations) : false

    }

    return new Plugin({
        key,
        state: {
            init(config, state) {
                return {
                    decos: calculatePlaceHolderDecorations(state)
                }
            },
            apply(tr, prev, oldState, state) {
                let {
                    decos
                } = this.getState(oldState)
                if (tr.docChanged || tr.selectionSet) {
                    decos = calculatePlaceHolderDecorations(state)
                }
                return {
                    decos
                }
            }
        },
        props: {
            decorations(state) {
                const {
                    decos
                } = this.getState(state)
                return decos
            }
        }
    })
}
