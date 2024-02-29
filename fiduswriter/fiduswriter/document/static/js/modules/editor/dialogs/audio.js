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
                    let id = "audio-" + urlAudio

                    const view = this.editor.currentView
                    const posFrom = view.state.selection.from
                    const tr = view.state.tr

                    const nodeAudio = view.state.schema.nodes["audio"].create({id: id, urlAudio: urlAudio, titulo: titulo, desc : desc})
                    const nodePara = view.state.schema.nodes["paragraph"].create()

                    tr.insert(posFrom, nodePara).replaceSelectionWith(nodeAudio, false)
                  
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