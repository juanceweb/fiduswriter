import {Dialog, escapeText, addAlert, get} from "../../common"
import {SaveCopy} from "../../exporter/native"

export class ModDocumentTemplate {
    constructor(editor) {
        editor.mod.documentTemplate = this
        this.editor = editor
        this.exportTemplates = []
        this.documentStyles = []
    }

    setStyles(styles) {
        this.exportTemplates = styles.export_templates
        this.documentStyles = styles.document_styles
        this.documentTemplates = styles.document_templates
        this.addExportTemplateMenuEntries()
        this.addDocumentStylesMenuEntries()
        if (Object.keys(this.documentTemplates).length) {
            this.addCopyAsMenuEntry()
        }
        if (this.editor.menu.headerView) {
            this.editor.menu.headerView.update()
        }
        //Cache the template files using Service Worker
        for (const key in styles.export_templates) {
            const template = styles.export_templates[key]
            get(template.template_file)
        }
        //Cache the required font related files too!
        this.documentStyles.forEach(docStyle => {
            docStyle.documentstylefile_set.forEach(([url, _filename]) => get(url))
        })
    }

    addDocPartSettings() {
        const hideableDocParts = []
        this.editor.view.state.doc.firstChild.forEach((child, offset, index) => {
            if (child.attrs.optional) {
                hideableDocParts.push([child, index])
            }
        })
        if (!hideableDocParts.length) {
            return
        }

        const metadataMenu = {
            id: "metadata",
            title: gettext("Optional sections"),
            type: "menu",
            tooltip: gettext("Choose which optional sections to enable."),
            order: 6,
            disabled: editor => editor.docInfo.access_rights !== "write",
            content: hideableDocParts.map(([node, index]) => ({
                title: node.attrs.title,
                type: "setting",
                tooltip: `${gettext("Show/hide")} ${node.attrs.title}`,
                order: index,
                action: editor => {
                    let offset = 0, // We need to add one as we are looking at offset values within the firstChild
                        newNode,
                        nodeId,
                        secondLine
                        
                    let idList = []

                    let anchorPos = editor.view.state.selection.$anchor.pos
                    let anchorParentOffset = editor.view.state.selection.$anchor.parentOffset
                    let anchorDepth = editor.view.state.selection.$anchor.depth
                    let new_offset = anchorPos - anchorParentOffset - anchorDepth
                    let offset_check = false
                    let second_offset_check = false
                    let secondoffset
                    let firstrenglonselect

                    editor.view.state.doc.firstChild.forEach((docNode, docNodeOffset) => {

                        if (offset_check == true) {
                            offset += docNodeOffset
                            offset_check = false
                        }

                        if (second_offset_check == true) {
                            secondoffset = docNodeOffset
                            second_offset_check = false
                        }
                        
                        if (docNode.attrs.id === node.attrs.id) {
                            newNode = docNode.type.create(docNode.attrs, docNode.content, docNode.marks)
                            nodeId = docNode.attrs.id
                        }

                        // en el caso de que se posicione en la primer linea del objeto seleccion
                        if (new_offset == docNodeOffset) {
                                offset_check = true
                                firstrenglonselect = true
                        }

                        // en el caso de que se posicione en una linea que no sea la primera de la seccion
                        if (new_offset > docNodeOffset) {
                            secondLine = docNodeOffset
                            second_offset_check = true
                        }

                        idList.push(docNode.attrs.id)

                    })

                    let partes = nodeId.split("-")
                    let parte_cuerpo = partes[0]
                    let contador = 0

                    idList.forEach(element => {
                        let partes_element = element.split("-")
                        if (partes_element[0] == parte_cuerpo) {
                            contador ++
                        }
                    });

                    newNode.attrs.id = parte_cuerpo + "-" + contador
                    newNode.attrs.optional = false
                    newNode.attrs.hidden = false
                    newNode.attrs.deleted = true

                    if (firstrenglonselect == true) {
                        editor.view.dispatch(editor.view.state.tr.insert(offset, newNode))
                    } else {
                        editor.view.dispatch(editor.view.state.tr.insert(secondoffset, newNode))
                    }

                  
                },
            }))
        }
        const settingsMenu = this.editor.menu.headerbarModel
        settingsMenu.content = settingsMenu.content.filter(item => item.id !== "metadata")
        settingsMenu.content.push(metadataMenu)
    }

    showSafariErrorMessage() {
        const dialog = new Dialog({
            title: gettext("Safari bug warning"),
            height: 100,
            body: gettext("Unfortunately Safari has a bug which makes it impossible to export to this format. Please use Chrome or Firefox (on a desktop computer)."),
            buttons: [{type: "close"}]
        })
        dialog.open()
    }

    addCopyAsMenuEntry() {
        const fileMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id === "file")
        // Cancel if run already
        if (fileMenu.content.find(menuItem => menuItem.id === "copy_as")) {
            return
        }
        fileMenu.content.push({
            id: "copy_as",
            title: gettext("Create copy as ..."),
            type: "action",
            tooltip: gettext("Create copy of the current document with a specific template."),
            order: 3.5,
            action: editor => {
                const selectTemplateDialog = new Dialog({
                    title: gettext("Choose document template"),
                    body: `<p>
                        ${gettext("Select document template for copy.")}
                        </p>
                        <select class="fw-button fw-large fw-light">${
    Object.entries(editor.mod.documentTemplate.documentTemplates).map(
        ([importId, dt]) => `<option value="${escapeText(importId)}">${escapeText(dt.title)}</option>`
    ).join("")
}</select>`,
                    buttons: [
                        {
                            text: gettext("Copy"),
                            classes: "fw-dark",
                            click: () => {
                                if (editor.app.isOffline()) {
                                    addAlert("error", "You are offline. Please try again after you are online.")
                                    selectTemplateDialog.close()
                                } else {
                                    const copier = new SaveCopy(
                                        editor.getDoc(),
                                        editor.mod.db.bibDB,
                                        editor.mod.db.imageDB,
                                        editor.user,
                                        selectTemplateDialog.dialogEl.querySelector("select").value
                                    )
                                    copier.init().then(({docInfo}) =>
                                        editor.app.goTo(`/document/${docInfo.id}/`)
                                    ).catch(() => false)
                                    selectTemplateDialog.close()
                                }

                            }
                        },
                        {
                            type: "cancel"
                        }
                    ]
                })
                selectTemplateDialog.open()
            },
            disabled: editor => editor.app.isOffline()
        })

        fileMenu.content = fileMenu.content.sort((a, b) => a.order - b.order)
    }

    addExportTemplateMenuEntries() {
        const exportMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id === "export")
        // Remove any previous entries in case we run this a second time
        exportMenu.content = exportMenu.content.filter(menuItem => menuItem.class !== "export_template")
        const exportMenuEntries = this.exportTemplates.map(template => {
            if (template.file_type === "docx") {
                return {
                    class: "export_template",
                    title: `${template.title} (DOCX)`,
                    type: "action",
                    tooltip: gettext("Export the document to a DOCX file with the given template."),
                    action: editor => {
                        if (navigator.vendor ===  "Apple Computer, Inc.") {
                            this.showSafariErrorMessage()
                            return
                        }
                        import("../../exporter/docx").then(({DocxExporter}) => {
                            const exporter = new DocxExporter(
                                editor.getDoc({changes: "acceptAllNoInsertions"}),
                                template.template_file,
                                editor.mod.db.bibDB,
                                editor.mod.db.imageDB,
                                editor.app.csl
                            )
                            exporter.init()
                        })
                    },
                    disabled: editor => editor.app.isOffline()
                }
            } else {
                return {
                    class: "export_template",
                    title: `${template.title} (ODT)`,
                    type: "action",
                    tooltip: gettext("Export the document to an ODT file with the given template."),
                    action: editor => {
                        if (navigator.vendor ===  "Apple Computer, Inc.") {
                            this.showSafariErrorMessage()
                            return
                        }
                        import("../../exporter/odt").then(({OdtExporter}) => {
                            const exporter = new OdtExporter(
                                editor.getDoc({changes: "acceptAllNoInsertions"}),
                                template.template_file,
                                editor.mod.db.bibDB,
                                editor.mod.db.imageDB,
                                editor.app.csl
                            )
                            exporter.init()
                        })
                    },
                    disabled: editor => editor.app.isOffline()
                }
            }
        })
        exportMenu.content = exportMenu.content.concat(exportMenuEntries)
    }

    addDocumentStylesMenuEntries() {
        const settingsMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id === "settings"),
            documentStyleMenu = settingsMenu.content.find(menu => menu.id === "document_style")

        documentStyleMenu.content = this.documentStyles.map(docStyle => {
            return {
                title: docStyle.title,
                type: "setting",
                action: editor => {
                    const article = editor.view.state.doc.firstChild
                    const attrs = Object.assign({}, article.attrs)
                    attrs.documentstyle = docStyle.slug
                    editor.view.dispatch(
                        editor.view.state.tr.setNodeMarkup(0, false, attrs).setMeta("settings", true)
                    )
                },
                selected: editor => editor.view.state.doc.firstChild.attrs.documentstyle === docStyle.slug,
                disabled: editor => editor.app.isOffline(),
            }
        })
    }

    getCitationStyles() {
        return this.editor.app.csl.getStyles().then(
            styles => {
                this.citationStyles = styles
            }
        )
    }

    addCitationStylesMenuEntries() {
        const settingsMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id === "settings"),
            citationStyleMenu = settingsMenu.content.find(menu => menu.id === "citation_style")
        if (citationStyleMenu) {
            citationStyleMenu.content = this.editor.view.state.doc.firstChild.attrs.citationstyles.map(citationstyle => {
                return {
                    title: this.citationStyles[citationstyle],
                    type: "setting",
                    action: editor => {
                        const article = editor.view.state.doc.firstChild
                        const attrs = Object.assign({}, article.attrs, {citationstyle})
                        editor.view.dispatch(
                            editor.view.state.tr.setNodeMarkup(0, false, attrs).setMeta("settings", true)
                        )
                    },
                    selected: editor => {
                        return editor.view.state.doc.firstChild.attrs.citationstyle === citationstyle
                    }
                }
            })
        }
    }

}
