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
        let urlAudio = ""
        let titulo = ""
        let desc = ""
        let fuente = ""
        let iframe = ""
        let alt = ""

        if (typeof this.node !== 'undefined') {
            urlAudio = this.node.attrs.iframe
            titulo = this.node.attrs.titulo
            desc = this.node.attrs.desc
            fuente = this.node.attrs.fuente
            alt = this.node.attrs.alt
        }

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: audioDialogTemplate(urlAudio, titulo, desc, fuente, alt),
            height:350,
            width: 600,
            buttons: [{
                text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                classes: "fw-dark insert-math",
                click: () => {

                    iframe = this.dialog.dialogEl.querySelector("input.audio-url").value
                    if(iframe != "") {
                        let range = document.createRange();
                        let fragment = range.createContextualFragment(iframe)
                        urlAudio = fragment.firstChild['src']
                    }
                    titulo = this.dialog.dialogEl.querySelector("input.audio-titulo").value;
                    desc = this.dialog.dialogEl.querySelector("textarea.audio-desc").value;
                    fuente = this.dialog.dialogEl.querySelector("input.audio-fuente").value;
                    alt = this.dialog.dialogEl.querySelector("input.audio-alt").value
                    let id = "audio-" + urlAudio

                    const view = this.editor.currentView
                    const posFrom = view.state.selection.from
                    const tr = view.state.tr

                    const nodeAudio = view.state.schema.nodes["audio"].create({id: id, urlAudio: urlAudio, titulo: titulo, desc : desc, fuente: fuente, iframe: iframe, alt: alt})
                    const nodePara = view.state.schema.nodes["paragraph"].create()

                    if (typeof this.node !== 'undefined') {
                        tr.replaceSelectionWith(nodeAudio)
                    }
                    else {
                        tr.insert(posFrom, nodePara).insert(posFrom, nodeAudio)
                    }
                  
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