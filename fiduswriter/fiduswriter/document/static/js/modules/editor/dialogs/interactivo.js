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
        let urlInteractivo = ""
        let titulo = ""
        let desc = ""
        let fuente = ""
        let iframe = ""
        let alt = ""

        if (typeof this.node !== 'undefined') {
            console.log(this.node.attrs.iframe)
            urlInteractivo = this.node.attrs.iframe
            titulo = this.node.attrs.titulo
            desc = this.node.attrs.desc
            fuente = this.node.attrs.fuente
            alt = this.node.attrs.alt
        }

        //initialize dialog and open it
        this.dialog = new Dialog({
            body: InteractivoDialogTemplate(urlInteractivo, titulo, desc, fuente, alt),
            height: 350,
            width: 600,
            buttons: [{
                    text: this.equationSelected ? gettext("Update") : gettext("Insert"),
                    classes: "fw-dark insert-math",
                    click: () => {

                        let parser = new DOMParser();
                        iframe = this.dialog.dialogEl.querySelector("textarea.interactivo-field").value;

                        if(iframe != ""){
                            var doc = parser.parseFromString(iframe, 'text/html');
                            var elementoIframe = doc.getElementsByTagName('iframe')
                            urlInteractivo = elementoIframe[0]['src']
                        }

                        titulo = this.dialog.dialogEl.querySelector("input.interactivo-titulo").value;
                        desc = this.dialog.dialogEl.querySelector("textarea.interactivo-desc").value;
                        fuente = this.dialog.dialogEl.querySelector("input.interactivo-fuente").value;
                        alt = this.dialog.dialogEl.querySelector("input.interactivo-alt").value;
                        let id = "interactivo-" + urlInteractivo

                        const view = this.editor.currentView,
                        posFrom = view.state.selection.from,
                        tr = view.state.tr
               
                        const nodeInteractivo = view.state.schema.nodes["interactivo"].create({id: id, urlInteractivo: urlInteractivo, titulo: titulo, desc : desc, fuente: fuente, iframe: iframe, alt: alt})
                        const nodePara = view.state.schema.nodes["paragraph"].create()
    
                        if (typeof this.node !== 'undefined') {
                            tr.replaceSelectionWith(nodeInteractivo)
                        }
                        else {
                            tr.insert(posFrom, nodePara).insert(posFrom, nodeInteractivo)
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