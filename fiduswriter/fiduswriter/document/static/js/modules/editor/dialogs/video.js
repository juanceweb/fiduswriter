import {videoDialogTemplate} from "./templates"
import {Dialog} from "../../common"


/**
 * Class to work with formula dialog
 */
export class VideoDialog {
    constructor(editor) {
        this.editor = editor
        this.node = this.editor.currentView.state.selection.node
        this.equationSelected = this.node && this.node.attrs && this.node.attrs.equation ? true : false
        this.equation = this.equationSelected ? this.node.attrs.equation : ""
    }

    init() {
        //get selected node
        let urlVideo = ""
        let titulo = ""
        let desc = ""
        let fuente = ""
        let alt = ""

        if (typeof this.node !== 'undefined') {
            urlVideo = this.node.attrs.urlVideo
            titulo = this.node.attrs.titulo
            desc = this.node.attrs.desc
            fuente = this.node.attrs.fuente
            alt = this.node.attrs.alt
        }

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: videoDialogTemplate(urlVideo, titulo, desc, fuente, alt),
            height:350,
            width: 600,
            buttons: [{
                text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                classes: "fw-dark insert-math",
                click: () => {

                    urlVideo = this.dialog.dialogEl.querySelector("input.video-url").value.replace('https://www.youtube.com/watch?v=', '')
                    titulo = this.dialog.dialogEl.querySelector("input.video-titulo").value
                    desc = this.dialog.dialogEl.querySelector("textarea.video-desc").value
                    fuente = this.dialog.dialogEl.querySelector("input.video-fuente").value
                    alt = this.dialog.dialogEl.querySelector("input.video-alt").value
                    let id = "video-" + urlVideo 

                    const view = this.editor.currentView
                    const posFrom = view.state.selection.from
                    const tr = view.state.tr

                    const nodeVideo = view.state.schema.nodes["video"].create({id: id, urlVideo: urlVideo, titulo: titulo, desc : desc, fuente: fuente, alt: alt})
                    const nodePara = view.state.schema.nodes["paragraph"].create()

                    if (typeof this.node !== 'undefined') {
                        tr.replaceSelectionWith(nodeVideo)
                    }
                    else {
                        tr.insert(posFrom, nodePara).insert(posFrom, nodeVideo)
                    }

                    view.dispatch(tr)
                    view.focus()
                    this.dialog.close()
                }
            },
                {
                    type: "cancel"
                }
            ],
            title: "Video",
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