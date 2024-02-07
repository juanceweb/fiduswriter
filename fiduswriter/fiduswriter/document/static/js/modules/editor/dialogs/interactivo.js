import {InteractivoDialogTemplate} from "./templates"
import {Dialog} from "../../common"
import {wrapInList} from "prosemirror-schema-list"
import {sub, sup, subChars, supChars} from "./subsup"
import {Schema} from "prosemirror-model"


/**
 * Class to work with formula dialog
 */
export class InteractivoDialog {
    constructor(editor) {
        this.editor = editor
        this.node = this.editor.currentView.state.selection.node
        this.equationSelected = this.node && this.node.attrs && this.node.attrs.equation ? true : false
        this.equation = this.equationSelected ? this.node.attrs.equation : ""
    }

    init() {
        //get selected node

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: InteractivoDialogTemplate(),
            height: 85,
            width: 600,
            buttons: [{
                    text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                    classes: "fw-dark insert-math",
                    click: () => {


                        let urlInteractivo = this.dialog.dialogEl.querySelector("input.interactivo-field").value;

                        const view = this.editor.currentView,
                        posFrom = view.state.selection.from,
                        tr = view.state.tr
                        let posTo = view.state.selection.to

                            const markType = view.state.schema.marks.interactivo.create({
                            urlInteractivo
                        })

                        tr.insertText(urlInteractivo, posFrom, posTo)
                        posTo = tr.mapping.map(posFrom, 1)
                        markType.attrs ={

                            urlInteractivo,
                        }
                        tr.addMark(
                            posFrom,
                            posTo,
                            markType
                        )
                        view.dispatch(tr)
                        view.focus()
                        this.dialog.close()
                        //return
                        }
                },
                {
                    type: "cancel"
                }
            ],
            title: "Interactivo",
            beforeClose: () => {
                if (this.mathField) {
                    this.mathField = false
                }
            },
            classes: "math",
            onClose: () => this.editor.currentView.focus()
        })
        this.dialog.open()
    }
}