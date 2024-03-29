import {CitaToolDialogTemplate} from "./templates"
import {Dialog} from "../../common"


/**
 * Class to work with formula dialog
 */
export class CitaToolDialog {
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
            body: CitaToolDialogTemplate(),
            height: 390,
            width: 820,
            buttons: [
                    {
                    text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                    classes: "fw-dark insert-math",
                    click: () => {

                        let cita = this.dialog.dialogEl.querySelector("input.cita-input").value;
                        let citaCorta = this.dialog.dialogEl.querySelector("input.cita-corta-input").value;

                        const view = this.editor.currentView,
                        posFrom = view.state.selection.from,
                        tr = view.state.tr
                        let posTo = view.state.selection.to

                            const markType = view.state.schema.marks.citaTool.create({
                            cita,citaCorta
                        })

                        tr.insertText(citaCorta, posFrom, posTo)
                        posTo = tr.mapping.map(posFrom, 1)
                        markType.attrs ={
                            cita,citaCorta
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
            title: "Cita Corta",
            beforeClose: () => {},
            onClose: () => this.editor.currentView.focus()
        })
        this.dialog.open()
        document.getElementById('select_apa').addEventListener('change', function() {
            let ejemplo = document.getElementsByClassName('cita-ejemplo')
            ejemplo[0].innerHTML = this.value
        });
        document.getElementById('select_apa_corto').addEventListener('change', function() {
            let ejemplo = document.getElementsByClassName('cita-corta-ejemplo')
            ejemplo[0].innerHTML = this.value
        });
    }
}