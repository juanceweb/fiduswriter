import {Plugin, PluginKey, NodeSelection} from "prosemirror-state"
import {DOMSerializer} from "prosemirror-model"
import {ContentMenu} from "../../common"

const key = new PluginKey("interactivoMenu")


class InteractivoView {
    constructor(node, view, getPos, options) {

        this.node = node
        this.view = view
        this.getPos = getPos
        this.options = options
        this.dom = document.createElement("div")
        this.dom.classList.add("interactivo")
        this.serializer = DOMSerializer.fromSchema(node.type.schema)
        const contentDOM = this.serializer.serializeNode(this.node)
        contentDOM.classList.forEach(className => this.dom.classList.add(className))
        contentDOM.classList.value = ""
        this.dom.appendChild(contentDOM)
        this.contentDOM = contentDOM
        this.menuButton = document.createElement("button")
        this.menuButton.classList.add("audiovisual-menu-btn")
        this.menuButton.innerHTML = "<span class=\"dot-menu-icon\"><i class=\"fa fa-ellipsis-v\"></i></span>"
        this.dom.appendChild(this.menuButton)
    }

    stopEvent(event) {
        let stopped = false
        if (event.type === "mousedown") {
            const composedPath = event.composedPath()
            if (composedPath.includes(this.menuButton)) {
                stopped = true
                const tr = this.view.state.tr
                const $pos = this.view.state.doc.resolve(this.getPos())
                tr.setSelection(new NodeSelection($pos))
                this.view.dispatch(tr)
                const contentMenu = new ContentMenu({
                    menu: this.options.editor.menu.interactivoMenuModel,
                    width: 280,
                    page: this.options.editor,
                    menuPos: {X: parseInt(event.pageX) + 20, Y: parseInt(event.pageY) - 100},
                    onClose: () => {
                        this.view.focus()
                    }
                })
                contentMenu.open()
            } 
        }

        return stopped
    }


}


export const interactivoPlugin = function(options) {
    return new Plugin({
        key,
        state: {
            init(_config, _state) {
                if (options.editor.docInfo.access_rights === "write") {
                    this.spec.props.nodeViews["interactivo"] =
                        (node, view, getPos) => new InteractivoView(node, view, getPos, options)
                }
                return {}
            },
            apply(tr, prev) {
                return prev
            }
        },
        props: {
            nodeViews: {}
        }
    })
}