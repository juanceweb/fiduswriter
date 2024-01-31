import {audioDialogTemplate} from "./templates"
import {Dialog} from "../../common"


/**
 * Class to work with formula dialog
 */
export class AudioDialog {
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
            body: audioDialogTemplate(),
            height:250,
            width: 600,
            buttons: [{
                text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                classes: "fw-dark insert-math",
                click: () => {

                    var htmlString = this.dialog.dialogEl.querySelector("input.audio-url").value

                    // Crear un rango y un fragmento contextual
                    var range = document.createRange();
                    var fragment = range.createContextualFragment(htmlString);
                    let urlAudio = fragment.firstChild['src']
                    let titulo = this.dialog.dialogEl.querySelector("input.audio-titulo").value;
                    let desc = this.dialog.dialogEl.querySelector("input.audio-desc").value;

                    const view = this.editor.currentView,
                        posFrom = view.state.selection.from
                    let posTo = view.state.selection.to
                    const tr = view.state.tr

                    const markType = view.state.schema.marks.audio.create({
                        desc
                    })

                    tr.insertText(desc, posFrom, posTo)
                    posTo = tr.mapping.map(posFrom, 1)
                    markType.attrs = {
                        desc,
                        urlAudio,
                        titulo

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
            title: "Audio",
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