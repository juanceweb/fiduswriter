import {convertLatexToMarkup} from "mathlive"
import pretty from "pretty"

import {escapeText} from "../../common"
import {CATS} from "../../schema/i18n"

export class HTMLExporterConvert {
    constructor(exporter, imageDB, bibDB, settings, xhtml = false, epub = false) {
        this.exporter = exporter
        this.settings = settings
        this.imageDB = imageDB
        this.bibDB = bibDB
        this.xhtml = xhtml
        this.epub = epub
        this.endSlash = this.xhtml ? "/" : ""

        this.imageIds = []
        this.categoryCounter = {} // counters for each type of figure (figure/table/photo)
        this.affiliations = {} // affiliations of authors and editors
        this.affCounter = 0
        this.parCounter = 0
        this.headingCounter = 0
        this.currentSectionLevel = 0
        this.listCounter = 0
        this.orderedListLengths = []
        this.footnotes = []
        this.fnCounter = 0
        this.metaData = {
            title: this.exporter.docTitle,
            authors: [],
            abstract: false,
            keywords: [],
            copyright: {
                licenses: []
            }
        }
        this.features = {
            math: false
        }
        this.citInfos = []
        this.citationCount = 0
        this.numeracion = 0
        this.apartado_num = 0
        this.subapartado_num = 0
        this.apartado_num_index = 0
        this.subapartado_num_index = 0
        this.id_tools = 1
        this.actividades_num = 0
        this.pastillaNum = 0
        this.pastillaDom = ''
        this.lastelement = false
    }

    init(docContent) {
        this.preWalkJson(docContent)
        this.findCitations(docContent)
        return this.exporter.citations.init(this.citInfos).then(() => {
            const body = this.assembleBody(docContent)
            const indice = this.assebleIndice(docContent)
            const back = this.assembleBack()
            const head = this.assembleHead()
            const html = this.exporter.htmlExportTemplate({
                head,
                body,
                back,
                settings: this.exporter.doc.settings,
                lang: this.exporter.doc.settings.language.split("-")[0],
                xhtml: this.xhtml,
                indice
            })
            return {
                html,
                imageIds: this.imageIds
            }
        })
    }

    // Find information for meta tags in header
    preWalkJson(node) {

        switch (node.type) {
    
        case "article":
            this.metaData.copyright = node.attrs.copyright
            break
        case "title":
        {
            const title = this.textWalkJson(node)
            if (title.length) {
                this.metaData.title = title
            }
            break
        }
        case "richtext_part":
            if (
                node.attrs.metadata === "abstract" &&
                    !node.attrs.language &&
                    this.metaData.abstract
            ) {
                this.metaData.abstract = this.walkJson(node)
            }
            break
        case "tags_part":
            if (
                node.attrs.metadata === "keywords" &&
                node.content
            ) {
                node.content.forEach(tag => {
                    this.metaData.keywords.push(tag.attrs.tag)
                })
            }
            break
        case "contributors_part":
            if (
                node.attrs.metadata === "authors" &&
                node.content
            ) {
                node.content.forEach(author => {
                    this.metaData.authors.push(author)
                })
            }
            break
        case "equation":
        case "figure_equation":
            this.features.math = true
            this.exporter.addMathliveStylesheet()
            break
        default:
            break
        }
        if (node.content) {
            node.content.forEach(child => this.preWalkJson(child))
        }
    }

    findCitations(node) {
        switch (node.type) {
        case "citation":
            this.citInfos.push(JSON.parse(JSON.stringify(node.attrs)))
            break
        case "footnote":
            node.attrs.footnote.forEach(child => this.findCitations(child))
            break
        default:
            break
        }
        if (node.content) {
            node.content.forEach(child => this.findCitations(child))
        }
    }

    assembleHead() {
        let head = `${escapeText(this.metaData.title)}`
        if (this.metaData.authors.length) {
            const authorString = this.metaData.authors.map(author => {
                if (author.firstname || author.lastname) {
                    const nameParts = []
                    if (author.firstname) {
                        nameParts.push(author.firstname)
                    }
                    if (author.lastname) {
                        nameParts.push(author.lastname)
                    }
                    return nameParts.join(" ")
                } else if (author.institution) {
                    return author.institution
                }
            }).join(", ")
            if (authorString.length) {
                head += `<meta name="author" content="${escapeText(authorString)}">`
            }
        }
        if (this.metaData.copyright.holder) {
            head  += `<link rel="schema.dcterms" href="http://purl.org/dc/terms/"${this.endSlash}>`
            const year = this.metaData.copyright.year ? this.metaData.copyright.year : new Date().getFullYear()
            head += `<meta name="dcterms.dateCopyrighted" content="${year}"${this.endSlash}>`
            head += `<meta name="dcterms.rightsHolder" content="${escapeText(this.metaData.copyright.holder)}"${this.endSlash}>`
            // TODO: Add this.metaData.copyright.freeToRead if present

            head += this.metaData.copyright.licenses.map(license =>
                `<link rel="license" href="${escapeText(license.url)}"${this.endSlash}>` // TODO: Add this.metaData.copyright.license.start info if present
            ).join("")
        }
        if (this.metaData.abstract.default) {
            head += this.walkJson(this.metaData.abstract.default)
        }
        Object.keys(this.metaData.abstract).filter(language => language !== "default").forEach(language => {
            head += this.walkJson(this.metaData.abstract[language])
        })
        if (this.metaData.keywords.length) {
            head += `<meta name="keywords" content="${escapeText(this.metaData.keywords.join(", "))}"${this.endSlash}>`
        }
        head += this.exporter.styleSheets.map(
            sheet => sheet.filename ?
                `<link rel="stylesheet" type="text/css" href="${sheet.filename}"${this.endSlash}>` :
                `<style>${sheet.contents}</style>`
        ).join("")
        return head
    }

    // Only allow for text output
    textWalkJson(node) {
        let content = ""
        if (node.type === "text") {
            content += escapeText(node.text).normalize("NFC")
        } else if (node.content) {
            node.content.forEach(child => {
                content += this.textWalkJson(child)
            })
        }
        return content
    }

    walkJson(node, options = {}) {
        let start = "", content = "", end = ""

        switch (node.type) {
        case "article":
            break
        case "title":

            node.content = ""
            // start += "<div class=\"article-part article-title\" id=\"title\">"
            // end = "</div>" + end
            break
        case "heading_part":

            if (node.content) {

                if (node.attrs.title == "Unidad"){

                    this.numeracion = this.obtenerNumeroTitulo(node, options)
                    
                    start += "<h3 class='index-color' id='unidad-title'>"
                    end = "</h3>" + end
                    break
                }
                else if (node.attrs.title == "Objetivos") {

                    start += `<h4 class="inicio-unidad" id="${node.attrs.id}" ${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    end = "</h4>" + end
                    break
                }
                else if (node.attrs.title == "Introduccion") {

                    start += `<h4 class="introduccion-unidad" id="${node.attrs.id}" ${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    end = "</h4>" + end
                    break
                }
                else if (node.attrs.title == "Subtitulo-1"){

                    start += "<h6><strong>"
                    end = "</strong></h6>" + end
                    break
                }
                else if (node.attrs.title == "Apartado") {

                    start += `<div class="spy apartado" id="${node.attrs.id}" ${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    
                    this.apartado_num++
                    this.subapartado_num = 0
                    this.actividades_num = 0
                    
                    let apartado = this.numeracion + "." + this.apartado_num + "."       
                    
                    start += `<h4><span class="index-color">${apartado}</span>`
                    end = "</h4></div>" + end
                    break
                }

                else if  (node.attrs.title == "Subapartado") {

                    start += `<div class="spy subapartado" id="${node.attrs.id}" ${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    
                    this.subapartado_num++
                    
                    let subapartado = this.numeracion + "." + this.apartado_num + "." + this.subapartado_num + "."
                    
                    start += `<h5><span class="index-color">${subapartado}</span>`
                    end = "</h5></div>" + end
                    break

                }
                else {
                    break
                }
            }
            else {
                break
            }
            //     // Ignore - we deal with the heading inside
            // break
        case "contributor":
            // Ignore - we deal with contributors_part instead.
            break
        case "contributors_part":
            if (node.content) {
                start += `<div class="article-part article-contributors ${node.attrs.metadata || "other"}">`
                end = "</div>" + end
                const contributorTypeId = node.attrs.id
                let counter = 0
                const contributorOutputs = []
                node.content.forEach(childNode => {
                    const contributor = childNode.attrs
                    let output = ""
                    if (contributor.firstname || contributor.lastname) {
                        output += `<span id="${contributorTypeId}-${counter++}" class="person">`
                        const nameParts = []
                        if (contributor.firstname) {
                            nameParts.push(`<span class="firstname">${escapeText(contributor.firstname)}</span>`)
                        }
                        if (contributor.lastname) {
                            nameParts.push(`<span class="lastname">${escapeText(contributor.lastname)}</span>`)
                        }
                        if (nameParts.length) {
                            output += `<span class="name">${nameParts.join(" ")}</span>`
                        }
                        if (contributor.institution) {
                            let affNumber
                            if (this.affiliations[contributor.institution]) {
                                affNumber = this.affiliations[contributor.institution]
                            } else {
                                affNumber = ++this.affCounter
                                this.affiliations[contributor.institution] = affNumber
                            }
                            output += `<a class="affiliation" href="#aff-${affNumber}">${affNumber}</a>`
                        }
                        output += "</span>"
                    } else if (contributor.institution) {
                        // There is an affiliation but no first/last name. We take this
                        // as a group collaboration.
                        output += `<span id="${contributorTypeId}-${counter++}" class="group">`
                        output += `<span class="name">${escapeText(contributor.institution)}</span>`
                        output += "</span>"
                    }
                    contributorOutputs.push(output)
                })
                content += contributorOutputs.join(", ")
            }
            break
        case "tags_part":
            if (node.content) {
                start += `<div class="article-part article-tags" id="${node.attrs.id}"${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                end = "</div>" + end
            }
            break
        case "tag":
            content += `<span class='tag'>${escapeText(node.attrs.tag)}</span>`
            break
        case "richtext_part":
            if (node.content) {

                if (node.attrs.title == "Cuerpo") {
                    start += `<div class="bloque-texto" id="${node.attrs.id}" ${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    end = "</div>" + end
                    break
                }
                else {
                    start += `<div class="article-part article-richtext ${node.attrs.id}"${ node.attrs.language ? ` lang="${node.attrs.language}"` : ""}>`
                    end = "</div>" + end
                    break
                }
            } 
            else {
                break
            }
        case "table_of_contents":
            content += `<div class="article-part table-of-contents"><h1>${escapeText(node.attrs.title)}</h1></div>`
            break
        case "separator_part":
            content += `<hr class="article-separator_part article-${node.attrs.id}">`
            break
        case "table_part":
            // table parts will simply show the table inside of them.
            break
        case "paragraph":

            if (this.lastelement == "leer_con_atencion") {
                start += `<p id="p-${++this.parCounter}" class='tool_parrafo'>`
            }
            else {
                start += `<p id="p-${++this.parCounter}" >`
            }
            end = "</p>" + end
            break
        case "heading1":
        case "heading2":
        case "heading3":
        case "heading4":
        case "heading5":
        case "heading6": {
            // const level = parseInt(node.type.slice(-1))
            // start += `<h${level}>`
            // end = `</h${level}>` + end
            break
        }
        case "code_block":
            start += "<code>"
            end = "</code>" + end
            break
        
        case "blockquote":
            start += "<blockquote>"
            end = "</blockquote>" + end
            break
        
        case "actividades":

            this.actividades_num++

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Actividad">K</span>'
            start += '<span class="bloque-type-title"><b>Actividad ' + this.apartado_num + '.' + this.actividades_num + '</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-'+ this.id_tools +'" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end

            this.id_tools++

            break

        case "leer_con_atencion":

            start += '<div class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Leer con atenciónd">L</span>'
            start += '<span class="bloque-type-title"><b>Leer con Atención</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end

            this.id_tools++

            break

        case "recurso_web":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Recurso Web">W</span>'
            start += '<span class="bloque-type-title"><b>Recurso Web</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end

            this.id_tools++

            break

        case "texto_aparte":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Texto aparte">?</span>'
            start += '<span class="bloque-type-title"><b>Texto aparte</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break   

        case "ejemplo":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Ejemplo">X</span>'
            start += '<span class="bloque-type-title"><b>Ejemplo</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break   

        case "para_ampliar":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Para ampliar">A</span>'
            start += '<span class="bloque-type-title"><b>Para ampliar</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break   
            
        case "para_reflexionar":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Para reflexionar">P</span>'
            start += '<span class="bloque-type-title"><b>Para reflexionar</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break    
            
        case "lectura_recomendada":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Lectura recomendada">R</span>'
            start += '<span class="bloque-type-title"><b>Lectura recomendada</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break

        case "lectura_obligatoria":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Lectura obligatoria">O</span>'
            start += '<span class="bloque-type-title"><b>Lectura obligatoria</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
            start += '<div class="bloque-content">'
           
            end = "</div></div></div>" + end


            this.id_tools++

            break  

        case "video":

            console.log(node.attrs)

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Audiovisual">E</span>'
            start += '<span class="bloque-type-title"><b>Audiovisual</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'

            if (node.attrs.titulo != "") {
                start += '<p><strong>'+ node.attrs.titulo +'</strong></p>'
            }

            if (node.attrs.desc != "") {
                start += '<p>' + node.attrs.desc + '</p>'
            }
            
            end = "</div></div>" + end

            this.id_tools++

            content = '<p><div class="video-responsive"><iframe alt="' + node.attrs.alt + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/' + node.attrs.urlVideo + '" title="YouTube video player" width="560"></iframe></div></p>'

            if (node.attrs.fuente != "") {
                content += '<p><div class="fuente">Fuente: ' + node.attrs.fuente +'</div></p>'
            }
    
            break

        case "audio":

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Audio">S</span>'
            start += '<span class="bloque-type-title"><b>Audio</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'

            if (node.attrs.titulo != "") {
                start += '<p><strong>'+ node.attrs.titulo +'</strong></p>'
            }

            if (node.attrs.desc != "") {
                start += '<p>' + node.attrs.desc + '</p>'
            }
        
            end = "</div></div>" + end

            this.id_tools++

            content = '<p><div class="audio-responsive"><iframe alt="' + node.attrs.alt + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="315" src="' + node.attrs.urlAudio + '" title="Audio ivoox player" width="560"></iframe></div></p>'

            if (node.attrs.fuente != "") {
                content += '<p><div class="fuente">Fuente: ' + node.attrs.fuente +'</div></p>'
            }

            break

        case "interactivo": 

            start += '<div id="" class="container-fluid bloque "><div class="row header-bloque">'
            start += '<div class="col-12">'
            start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Interactivo">E</span>'
            start += '<span class="bloque-type-title"><b>Interactivo</b></span>'
            start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-' + this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="false" aria-controls="bloque-content-'+ this.id_tools + '">+</div></div></div>'
            start += '<div class="row collapse show" id="bloque-content-' + this.id_tools + '">'
                
            if (node.attrs.titulo != "") {
                start += '<p><strong>'+ node.attrs.titulo +'</strong></p>'
            }

            if (node.attrs.desc != "") {
                start += '<p>' + node.attrs.desc + '</p>'
            }
            
            end = "</div></div>" + end

            this.id_tools++

            content = '<p><div class="video-responsive"><iframe alt="' + node.attrs.alt + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="315" src="' + node.attrs.urlInteractivo + '" title="Interactivo player" width="560"></iframe></div></p>'

            if (node.attrs.fuente != "") {
                content += '<p><div class="fuente">Fuente: ' + node.attrs.fuente +'</div></p>'
            }

            break    

        case "ordered_list": {
            if (node.attrs.order == 1) {
                start += `<ol id="list-${++this.listCounter}">`
            } else {
                start += `<ol id="list-${++this.listCounter}" start="${node.attrs.order}">`
            }
            end = "</ol>" + end
            break
        }
        case "bullet_list":
            start += `<ul id="list-${++this.listCounter}">`
            end = "</ul>" + end
            break
        case "list_item":
            start += "<li>"
            end = "</li>" + end
            break
        case "footnote":
            content += `<a class="footnote"${this.epub ? "epub:type=\"noteref\" " : ""} href="#fn-${++this.fnCounter}">${this.fnCounter}</a>`
            options = Object.assign({}, options)
            options.inFootnote = true
            this.footnotes.push(this.walkJson({
                type: "footnotecontainer",
                attrs: {
                    id: `fn-${this.fnCounter}`,
                    label: this.fnCounter // Note: it's unclear whether the footnote number is required as a label
                },
                content: node.attrs.footnote
            }, options))
            break
        case "footnotecontainer":
            start += `<aside class="footnote"${this.epub ? "epub:type=\"footnote\" " : ""} id="${node.attrs.id}"><label>${node.attrs.label}</label>`
            end = "</aside>" + end
            break
        case "text": {
            let strong, em, underline, hyperlink, pastilla
            // Check for hyperlink, bold/strong, italic/em and underline

            if (node.marks) {
                strong = node.marks.find(mark => mark.type === "strong")
                em = node.marks.find(mark => mark.type === "em")
                underline = node.marks.find(mark => mark.type === "underline")
                pastilla = node.marks.find(mark => mark.type === "link")
                hyperlink = node.marks.find(mark => mark.type === "hyperlink")
            }
            if (em) {
                start += "<em>"
                end = "</em>" + end
            }
            if (strong) {
                start += "<strong>"
                end = "</strong>" + end
            }
            if (underline) {
                start += "<span class=\"underline\">"
                end = "</span>" + end
            }
            if (hyperlink) {
                start += `<a href="${hyperlink.attrs.href}">`
                end = "</a>" + end
            }
            if (pastilla) {

                this.pastillaNum += 1

                end = '<a href="#" class="pastilla" id="openModal-' + this.pastillaNum + '" data-bs-toggle="modal" data-bs-target="#modalPastilla-' + this.pastillaNum + '"><span class="icon">N</span></a>'

                this.pastillaDom += '<div class="modal fade" id="modalPastilla-' + this.pastillaNum + '" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">'
                this.pastillaDom += '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header">'
                this.pastillaDom += '<h3 class="modal-title" id="modalPastillaTitle-' + this.pastillaNum + '"><span class="icon">N</span><h5>Pastilla</h5></h3>'
                this.pastillaDom += ' <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>'
                this.pastillaDom += '<div class="modal-body"><div class="container">'
                this.pastillaDom += '<p>'+ pastilla.attrs.href +'</p>'
                this.pastillaDom += '</div></div>'
                this.pastillaDom += '<div class="modal-footer"><button class="btn btn-primary" id="modalPastilla' + this.pastillaNum + '" type="button" data-bs-dismiss="modal">Cerrar</button></div>'
                this.pastillaDom += '</div></div></div>'

            }
            content += escapeText(node.text).normalize("NFC")

            break
        }
        case "cross_reference": {
            start += `<a class="reference" href="#${node.attrs.id}">`
            content += escapeText(node.attrs.title || "MISSING TARGET")
            end = "</a>" + end
            break
        }
        case "citation": {
            const citationText = this.exporter.citations.citationTexts[this.citationCount++]
            if (options.inFootnote || this.exporter.citations.citFm.citationType !== "note") {
                content += citationText
            } else {
                content += `<a class="footnote"${this.epub ? "epub:type=\"noteref\" " : ""} href="#fn-${++this.fnCounter}">${this.fnCounter}</a>`
                this.footnotes.push(
                    `<aside class="footnote"${this.epub ? "epub:type=\"footnote\" " : ""} id="fn-${this.fnCounter}"><label>${this.fnCounter}</label><p id="p-${++this.parCounter}">${citationText}</p></aside>`
                )
            }
            break
        }
        case "figure": {
            let imageFilename, copyright
            const image = node.content.find(node => node.type === "image")?.attrs.image || false
            if (image !== false) {
                this.imageIds.push(image)
                const imageDBEntry = this.imageDB.db[image],
                    filePathName = imageDBEntry.image
                copyright = imageDBEntry.copyright
                imageFilename = filePathName.split("/").pop()
            }
            const caption = node.attrs.caption ? node.content.find(node => node.type === "figure_caption")?.content || [] : []
            if (
                node.attrs.category === "none" &&
                    imageFilename &&
                    !caption.length &&
                    (!copyright || !copyright.holder)
            ) {
                content += `<img id="${node.attrs.id}" src="images/${imageFilename}"${this.endSlash}>`
            } else {

                start += '<div class="container-fluid bloque "><div class="row header-bloque"><div class="col-12">'
                start += '<span class="icon bloque-icon" aria-hidden="true" aria-label="icono Figura">I</span><span class="bloque-type-title"><b>Figura 3.1.</b></span>'
                start += '<div class="bloque-collapse-button rotate" data-bs-toggle="collapse" href="#bloque-content-'+ this.id_tools + '" role="button" aria-hidden="true" aria-label="Boton abrir" aria-expanded="true" aria-controls="bloque-content-'+ this.id_tools +'">+</div></div></div>'
                start += '<div class="row collapse show" id="bloque-content-'+ this.id_tools +'"><h5>Cinco fuerzas de Porter</h5><div class="bloque-content"><p><a target="_blank"  href="">'

                this.id_tools++

                end = '<p>Fuente: <span style="font-size:10.5pt"><span style="line-height:115%"><span style="font-family:"Times New Roman",serif"><span style="color:black"><span style="font-size:10.0pt"><span style="line-height:115%">'

                end += '<a href="https://economipedia.com/wp-content/uploads/5-FUERZAS-DE-PORTER.jpg" target="_blank">https://economipedia.com/wp-content/uploads/5-FUERZAS-DE-PORTER.jpg</a></span></span></span></span></span></span></p></div></div></div>'

                const equation = node.content.find(node => node.type === "figure_equation")?.attrs.equation

                if (image && copyright?.holder) {
                    let figureFooter = `<footer class="copyright ${copyright.freeToRead ? "free-to-read" : "not-free-to-read"}"><small>`
                    figureFooter += "© "
                    const year = copyright.year ? copyright.year : new Date().getFullYear()
                    figureFooter += `<span class="copyright-year">${year}</span> `
                    figureFooter += `<span class="copyright-holder">${escapeText(copyright.holder)}</span> `
                    figureFooter += copyright.licenses.map(license =>
                        `<span class="license"><a rel="license"${license.start ? ` data-start="${license.start}"` : ""}>${escapeText(license.url)}</a></span>`
                    ).join("")
                    figureFooter += "</small></footer>"
                    end = figureFooter + end
                }

                const category = node.attrs.category
                if (caption.length || category !== "none") {
                    let figcaption = "<figcaption>"
                    if (category !== "none") {
                        if (!this.categoryCounter[category]) {
                            this.categoryCounter[category] = 0
                        }
                        const catCount = ++this.categoryCounter[category]
                        const catLabel = `${CATS[category][this.settings.language]} ${catCount}`
                        figcaption += `<label>${escapeText(catLabel)}</label>`
                    }
                    if (caption.length) {
                        figcaption += `<p>${caption.map(node => this.walkJson(node)).join("")}</p>`
                    }
                    figcaption += "</figcaption>"
                    if (category === "table") {
                        start += figcaption
                    } else {
                        end = figcaption + end
                    }
                }

                if (equation) {
                    start += `<div class="figure-equation" data-equation="${escapeText(equation)}">`
                    end = "</div>" + end
                    content = convertLatexToMarkup(equation, {mathstyle: "displaystyle"})
                } else {
                    if (imageFilename) {
                        content += `<img class="zoom" alt="" src="images/${imageFilename}"${this.endSlash}/></a></p>`
                    }
                }
            }
            break
        }
        case "figure_caption":
            // We are already dealing with this in the figure. Prevent content from being added a second time.
            return ""
        case "figure_equation":
            // We are already dealing with this in the figure.
            break
        case "image":
            // We are already dealing with this in the figure.
            break
        case "table": {
            start += `<table
                class="table-${node.attrs.width}
                table-${node.attrs.aligned}
                table-${node.attrs.layout}"
                data-width="${node.attrs.width}"
                data-aligned="${node.attrs.aligned}"
                data-layout="${node.attrs.layout}"
                data-category="${node.attrs.category}"
            >`
            end = "</table>" + end
            const category = node.attrs.category
            if (category !== "none") {
                if (!this.categoryCounter[category]) {
                    this.categoryCounter[category] = 0
                }
                const catCount = ++this.categoryCounter[category]
                const catLabel = `${CATS[category][this.settings.language]} ${catCount}`
                start += `<label>${escapeText(catLabel)}</label>`
            }
            const caption = node.attrs.caption ? node.content[0].content || [] : []
            if (caption.length) {
                start += `<caption><p>${caption.map(node => this.walkJson(node)).join("")}</p></caption>`
            }
            start += "<tbody>"
            end = "</tbody>" + end
            break
        }
        case "table_body":
            // Pass through to table.
            break
        case "table_caption":
            // We already deal with this in 'table'.
            return ""
        case "table_row":
            start += "<tr>"
            end = "</tr>" + end
            break
        case "table_cell":
            start += `<td${node.attrs.colspan === 1 ? "" : ` colspan="${node.attrs.colspan}"`}${node.attrs.rowspan === 1 ? "" : ` rowspan="${node.attrs.rowspan}"`}>`
            end = "</td>" + end
            break
        case "table_header":
            start += `<th${node.attrs.colspan === 1 ? "" : ` colspan="${node.attrs.colspan}"`}${node.attrs.rowspan === 1 ? "" : ` rowspan="${node.attrs.rowspan}"`}>`
            end = "</th>" + end
            break
        case "equation":
            start += "<span class=\"equation\">"
            end = "</span>" + end
            content = convertLatexToMarkup(node.attrs.equation, {mathstyle: "textstyle"})
            break
        case "hard_break":
            content += `<br${this.endSlash}>`
            break
        default:
            break
        }

        if (!content.length && node.content) {
            node.content.forEach(child => {
                content += this.walkJson(child, options)
            })
        }

        if (node.type != "text" && this.pastillaDom != "") {

            end += this.pastillaDom
            this.pastillaDom = ""
        }

        this.lastelement = node.type

        return start + content + end
    }

    assembleBody(docContent) {
        return `<div id="main-content-unidad">${this.walkJson(docContent)}</div>`
    }

    assebleIndice(docContent) {

        let indice_principal, arreglo, primeraParte, nuevaCadena, last_node

        let hay_apartado = false
        let hay_subapartado = false

        let indice_final = ""

        docContent.content.forEach(node => {
            if (node.type == "richtext_part" && node.attrs.title == "Titulo") {

                last_node = node.attrs.title

                indice_principal = ""

                for (let index = 0; index < node.content.length; index++) {
                    const element = node.content[index]
                    indice_principal += element.content[0].text
                }

                arreglo = indice_principal.split('.');
                primeraParte = arreglo.slice(0, 1).join('.');
                nuevaCadena = indice_principal.substring(primeraParte.length + 1);

                indice_final += '<ul class="list-group" id="index-unidad"><li class="index-item-unidad list-group-item  list-group-item-action"><a class="index-href index-title-font" href="" ><span class="index-color">'
                indice_final += primeraParte
                indice_final += '.</span>'
                indice_final += nuevaCadena
                indice_final += '</a>'
                
            }
            else if (node.type == "richtext_part" && node.attrs.title == "Apartado" && node.content != undefined) {

                hay_apartado = true

                if (last_node == "Titulo" ) {
                    indice_final += '<ul class="list-group">'
                }
                else if (last_node == "Apartado") {
                    indice_final += '</li>'
                }

                // else if (last_node == "Subapartado") {
                //     indice_final += '</ul>'
                // }

                last_node = node.attrs.title

                indice_principal = ""

                for (let index = 0; index < node.content.length; index++) {
                    const element = node.content[index]
                    indice_principal += element.content[0].text
                }

                this.apartado_num_index++

                this.subapartado_num_index = 0

                let apartado = this.numeracion + "." + this.apartado_num_index

                indice_final += '<li class="index-item-unidad list-group-item list-group-item-action list-hover"><a class="index-href index-font" href="unidad-2.html#apartado-1"><span class="index-color">'
                indice_final += apartado
                indice_final += '.</span>'
                indice_final += indice_principal
                indice_final += '</a>'

            }
        })
        //     else if (node.type == "richtext_part" && node.attrs.title == "Subapartado" && node.content != undefined) {

        //         hay_subapartado = true

        //         if (last_node == "Apartado" ) {
        //             indice_final += '<ul class="list-group collapse">'
        //         }

        //         indice_principal = ""

        //         for (let index = 0; index < node.content.length; index++) {
        //             const element = node.content[index]
        //             indice_principal += element.content[0].text
        //         }

        //         this.subapartado_num_index++

        //         let subapartado = this.numeracion + "." + this.apartado_num_index + "." + this.subapartado_num_index

        //         indice_final += '<li class="index-item-unidad list-group-item list-group-item-action"><a class="index-href index-font" href=""><span class="index-color">'
        //         indice_final += subapartado
        //         indice_final += '.</span>'
        //         indice_final += indice_principal
        //         indice_final += '</a></li>'
        //     } 
        // })

        // if (hay_subapartado == true) {
        //     indice_final += '</ul>'
        // }

        if (hay_apartado == true) {
            indice_final += '</li></ul>'
        }

        indice_final += '</li></ul>'

        return indice_final
    }

    assembleBack() {
        let back = ""
        if (this.footnotes.length || this.exporter.citations.bibHTML.length || Object.keys(this.affiliations).length) {
            back += "<div id=\"back\">"
            if (Object.keys(this.affiliations).length) {
                back += `<div id="affiliations">${Object.entries(this.affiliations).map(
                    ([name, id]) => `<aside class="affiliation" id="aff-${id}"><label>${id}</label> <div>${escapeText(name)}</div></aside>`
                ).join("")}</div>`
            }
            if (this.footnotes.length) {
                back += `<div id="footnotes">${this.footnotes.join("")}</div>`
            }
            if (this.exporter.citations.bibHTML.length) {
                back += `<div id="references">${this.exporter.citations.bibHTML}</div>`
                this.exporter.styleSheets.push({filename: "css/bibliography.css", contents: pretty(this.exporter.citations.bibCSS, {ocd: true})})
            }
            back += "</div>"
        }
        return back
    }

    obtenerNumeroTitulo(node, options = {}) {

        let title_content

        node.content.forEach(child => {
            title_content += this.walkJson(child, options)
        })

        const regex = /^\D*(\d+)\./

        const coincidencias = regex.exec(title_content);

        let numero = 0

        if (coincidencias !== null) {
            numero = coincidencias[1];
        } 

        return numero
    }

}
