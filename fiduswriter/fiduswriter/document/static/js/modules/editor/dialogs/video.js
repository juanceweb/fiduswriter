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

        if (typeof this.node !== 'undefined') {
            urlVideo = this.node.attrs.urlVideo
            titulo = this.node.attrs.titulo
            desc = this.node.attrs.desc
        }

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: videoDialogTemplate(urlVideo, titulo, desc),
            height:250,
            width: 600,
            buttons: [{
                text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                classes: "fw-dark insert-math",
                click: () => {

                    urlVideo = this.dialog.dialogEl.querySelector("input.video-url").value.replace('https://www.youtube.com/watch?v=', '');
                    titulo = this.dialog.dialogEl.querySelector("input.video-titulo").value;
                    desc = this.dialog.dialogEl.querySelector("input.video-desc").value;
                    let id = "video-" + urlVideo 

                    const view = this.editor.currentView
                    const posFrom = view.state.selection.from
                    const tr = view.state.tr

                    const nodeVideo = view.state.schema.nodes["video"].create({id: id, urlVideo: urlVideo, titulo: titulo, desc : desc})
                    const nodePara = view.state.schema.nodes["paragraph"].create()

                    tr.insert(posFrom, nodePara).replaceSelectionWith(nodeVideo)

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