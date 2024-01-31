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

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: videoDialogTemplate(),
            height:250,
            width: 600,
            buttons: [{
                text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                classes: "fw-dark insert-math",
                click: () => {

                    let urlVideo = this.dialog.dialogEl.querySelector("input.video-url").value.replace('https://www.youtube.com/watch?v=', '');
                    let titulo = this.dialog.dialogEl.querySelector("input.video-titulo").value;
                    let desc = this.dialog.dialogEl.querySelector("input.video-desc").value;
                    let id = "video-" + urlVideo 

                    const view = this.editor.currentView,
                        posFrom = view.state.selection.from
                    let posTo = view.state.selection.to
                    const tr = view.state.tr

                    const markType = view.state.schema.marks.video.create({
                        desc
                    })

                    tr.insertText(desc, posFrom, posTo)
                    posTo = tr.mapping.map(posFrom, 1)
                    markType.attrs = {
                        id,
                        desc,
                        urlVideo,
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