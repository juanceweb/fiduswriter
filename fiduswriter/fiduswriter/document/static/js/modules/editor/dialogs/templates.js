import {escapeText} from "../../common"
import {
    CATS
} from "../../schema/i18n"


export const linkDialogTemplate = ({defaultLink, internalTargets, linkType, title, target, allowedContent}) =>
    `${
        allowedContent.cross_reference && internalTargets.length && false ?
            `<div class="fw-radio">
            <input type="radio" name="link-type" value="cross_reference" class="cross-reference-check">
            <label class="cross-reference-label">${gettext("Cross reference")}</label>
        </div>
        <div class="fw-select-container">
            <select class="cross-reference-selector fw-button fw-light fw-large" required="">
                <option class="placeholder" selected="" disabled="" value="">
                    ${gettext("Select Target")}
                </option>
                ${
    internalTargets.map(iTarget =>
        `<option class="cross-reference-item" type="text" value="${iTarget.id}" ${target === iTarget.id ? "selected" : ""}>
                            ${escapeText(iTarget.text)}
                        </option>`
    ).join("")
}
            </select>
            <div class="fw-select-arrow fa fa-caret-down"></div>
        </div><p></p>` : ""
    }${
        allowedContent.link && internalTargets.length && false ?
            `<div class="fw-radio">
            <input type="radio" name="link-type" value="internal" class="link-internal-check">
            <label class="link-internal-label">${gettext("Internal")}</label>
        </div>
        <div class="fw-select-container">
            <select class="internal-link-selector fw-button fw-light fw-large" required="">
                <option class="placeholder" selected="" disabled="" value="">
                    ${gettext("Select Target")}
                </option>
                ${
    internalTargets.map(iTarget =>
        `<option class="link-item" type="text" value="${iTarget.id}" ${target === iTarget.id ? "selected" : ""}>
                            ${escapeText(iTarget.text)}
                        </option>`
    ).join("")
}
            </select>
            <div class="fw-select-arrow fa fa-caret-down"></div>
        </div>
        <p></p>
        <div class="fw-radio">
            <input type="radio" name="link-type" value="external" class="link-external-check">
            <label class="link-external-label">${gettext("External")}</label>
        </div>`
            :
            ""
    }${
        allowedContent.link ?
        `<div class="fw-radio">
            <input type="radio" name="link-type" value="external" class="link-external-check">
            <label class="link-external-label">${gettext("External")}</label>
        </div>
        <input class="link-title" type="text" value="${escapeText(title)}" placeholder="${gettext("Palabra")}"/>
        <p></p>
        <input class="link" type="text" value="${target && linkType === "external" ? target : defaultLink}" placeholder="${gettext("Texto")}"/>` :
            ""
    }`


/** Dialog to add a note to a revision before saving. */
export const revisionDialogTemplate = ({dir}) =>
    `<p>
        <input type="text" class="revision-note" placeholder="${gettext("Description (optional)")}" dir="${dir}">
    </p>`

export const tableInsertTemplate = () => `
    <table class="insert-table-selection">
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </table>`

export const tableConfigurationTemplate = ({language}) =>
    `<table class="fw-dialog-table">
        <tbody>
            <tr>
                <th><h4 class="fw-tablerow-title">${gettext("Alignment")}</h4></th>
                <td>
                    <select class="table-alignment">
                        <option value="left">${gettext("Left")}</option>
                        <option value="center">${gettext("Center")}</option>
                        <option value="right">${gettext("Right")}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><h4 class="fw-tablerow-title">${gettext("Width")}</h4></th>
                <td>
                    <select class="table-width">
                        <option value="100">${gettext("100 %")}</option>
                        <option value="75">${gettext("75 %")}</option>
                        <option value="50">${gettext("50 %")}</option>
                        <option value="25">${gettext("25 %")}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><h4 class="fw-tablerow-title">${gettext("Column style")}</h4></th>
                <td>
                    <select class="table-layout">
                        <option value="fixed">${gettext("Fixed width")}</option>
                        <option value="auto">${gettext("Fit content")}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><h4 class="fw-tablerow-title">${gettext("Listed as")}</h4></th>
                <td>
                    <select class="table-category">
                        <option value="none">${gettext("None")}</option>
                        <option value="table">${CATS["table"][language]}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><h4 class="fw-tablerow-title">${gettext("Caption")}</h4></th>
                <td>
                    <select class="table-caption">
                        <option value="true">${gettext("Enable")}</option>
                        <option value="false">${gettext("Disable")}</option>
                    </select>
                </td>
            </tr>
        </tbody>
    </table>`

export const orderedListStartTemplate = ({order}) =>
    `<div title="${gettext("List start")}">
        <p><input class="list-start" type="number" name="list-start" min="1" value="${order}"></p>
    </div>`

export const mathDialogTemplate = () =>
    `<div title="${gettext("Math")}">
        <p><span class="math-field" type="text" name="math" ></span></p>
    </div>`

export const videoDialogTemplate = (urlVideo, titulo, desc, fuente, alt) =>
    `<div>
        <p class="video-etiqueta">Titulo</p><p><input class="video-titulo"/ value="${titulo}"></p>
        <p class="video-etiqueta">Descripción</p><textarea class="video-desc"/>${desc}</textarea>
        <p class="video-etiqueta">Url Video</p><p><input class="video-url"/ value="${urlVideo}"></p>
        <p class="video-etiqueta">Alt</p><p><input class="video-alt"/ value="${alt}"></p>
        <p class="video-etiqueta">Fuente</p><p><input class="video-fuente"/ value="${fuente}"></p>
    </div>`

export const audioDialogTemplate = (urlAudio, titulo, desc, fuente, alt) =>
    `<div>
        <p class="etiqueta">Titulo</p><p><input class="audio-titulo"/ value="${titulo}"></p>
        <p class="etiqueta">Descripción</p><textarea class="audio-desc"/>${desc}</textarea>
        <p class="etiqueta">Iframe Audio ivoox (compartir -> reproductor -> Versión normal) </p><p><input class="audio-url"/ value="${urlAudio}"></p>
        <p class="etiqueta">Alt</p><p><input class="audio-alt"/ value="${alt}"></p>
        <p class="etiqueta">Fuente</p><p><input class="audio-fuente"/ value="${fuente}"></p>
    </div>`

export const InteractivoDialogTemplate = (urlInteractivo, titulo, desc, fuente, alt) =>
    `<div title="URL Interactivo">
        <p class="etiqueta">Titulo</p><p><input class="interactivo-titulo"/ value="${titulo}"></p>
        <p class="etiqueta">Descripción</p><textarea class="interactivo-desc"/>${desc}</textarea>
        <p class="etiqueta_br">Iframe Actividad </p>
        <p class="etiqueta_br">https://genial.ly/es/: compartir -> insertar  -> iframe</p>
        <p class="etiqueta_br"> https://h5p.org/: embed -> iframe</p>
        <p><textarea class="interactivo-field">${urlInteractivo}</textarea></p>
        <p class="etiqueta">Alt</p><p><input class="interactivo-alt"/ value="${alt}"></p>
        <p class="etiqueta">Fuente</p><p><input class="interactivo-fuente"/ value="${fuente}"></p>
    </div>`

export const HyperlinkDialogTemplate = () =>
        `<input class="link-title" type="text" value="" placeholder="${gettext("Link")}"/>`

export const CitaToolDialogTemplate = () =>
    `<div title="URL Interactivo">
        <p class="etiqueta">Cita Larga</p>
        <input class="cita-input"/>
        <p class = "cita-ejemplo">Apellido, N. (año). Título del trabajo. Editorial.</p>
        <select name="apa" id="select_apa" class="cita-select">
          <option value='Apellido, N. (año). Título del trabajo. Editorial.'>Libro impreso</option>
          <option value='Apellido, N. (año). Título del trabajo. Editorial. DOI o URL'>Libro en línea</option>
          <option value='Apellido, N. (Ed.). (año). Título del trabajo. Editorial.'>Libro con editor</option>
          <option value='Apellido Autor, N. (año). Título del capítulo o entrada. En N. Apellido Editor (Ed.), Título del libro (xx ed., Vol. xx, pp. xxx-xxx). Editorial.'>Capítulo de libro</option>
          <option value='Apellido, A., Apellido, B. y Apellido, C.  (año). Título del artículo. Nombre de la revista, volumen(número), página-página. '>Publicaciones periódicas impresas</option>
          <option value='Apellido, A., Apellido, B. y Apellido, C. (año). Título del artículo específico. Título de la Revista, Volumen(número de la revista), número de página inicio-número de página fin. URL'>Publicaciones periódicas en línea</option>
          <option value='Apellido, N. (fecha de publicación). Titular del artículo. Nombre del periódico en cursiva.'>Artículo de periódico impreso</option>
          <option value='Apellido, N. (fecha de publicación). Titular del artículo. Nombre del periódico en cursiva. URL'>Artículo de periódico en línea</option>
          <option value='Apellido, N. (año). Título de la tesis [Tesis de doctorado, Nombre de la institución que otorgó el título]. Nombre de la base de datos. URL.'>Tesis en línea</option>
          <option value='Apellido, A., Apellido, B. y Apellido, C. (fecha de publicación). Título del artículo de la página web. Nombre del sitio web. URL'>Páginas web</option>
          <option value='Apellido, N. (Director). (año). Título [Película]. Productor.'>Películas</option>
          <option value='Apellido, N. (fecha de publicación). Título del artículo en el blog. Nombre del Blog. URL'>Blog</option>
          <option value='Apellido, N. (fecha de publicación). Veinte primeras palabras [Comentario en la entrada “Título de la entrada”]. Nombre del Blog. URL'>Comentario en blog</option>
          <option value='Nombre del autor. [Nombre de usuario en Youtube] (fecha). Título del video [Video]. Youtube. URL'>Youtube</option>
          <option value='Usuario. (dd/mm/aaaa). Veinte primeras palabras. [tuit]. Twitter. htpp://twitter.com/usuario'>Twitter</option>
          <option value='Nombre de usuario. (dd/mm/aaaa). Veinte primeras palabras. [Actualización Facebook]. URL'>Post de Facebook</option>
          <option value='Apellido, N. (rol en la publicación). (2015-presente). Título del podcast. URL. '>Podcast</option>
          <option value='Apellido, N. (rol en la publicación). (2015-presente). Título del episodio (Número del episodio) [Episodio de podcast]. En Título del podcast. URL.'>Episodio de podcast</option>
          <option value='Número y año de la ley. Asunto. Fecha de promulgación. Número en el Diario Oficial.'>Leyes</option>
          <option value='Nombre oficial de la Constitución [abreviación]. Artículo específico citado. Fecha de promulgación (País).'>Constitución política</option>
          <option value='Título oficial del Código [abreviación]. Número y año de la ley a que corresponde. Artículo(s) citado(s). Fecha de promulgación (País).'>Códigos</option>
        </select>
        <p class="etiqueta">Cita Corta</p>
        <input class="cita-corta-input"/>
        <p class = "cita-corta-ejemplo">(Apellido, año)</p>
        <select name="apa" id="select_apa_corto" class="cita-corta-select">
          <option value='(Apellido, año)'>Un/a Autor/a</option>
          <option value='(Apellido, Apellido, año)'>Dos Autores/as.</option>
          <option value='(Apellido et al., año)'>Tres o más Autores/as</option>
          <option value='(Apellido, año: pág.) '>Un/a Autor/a y es cita directa</option>
          <option value='(Apellido, Apellido, año: pág.) '>Dos Autores/as y es cita directa</option>
          <option value='(Apellido et al., año: pág.-pág.)'>Tres o más Autores/as y es cita directa</option>
        </select>
    </div>`


export const figureImageItemTemplate =  ({id, cats, image, thumbnail, title}) =>
    `<tr id="Image_${id}" class="${cats.map(cat => `cat_${escapeText(cat)} `)}" >
         <td class="type" style="width:100px;">
            ${
    thumbnail === undefined ?
        `<img src="${image}" style="max-heigth:30px;max-width:30px;">` :
        `<img src="${thumbnail}" style="max-heigth:30px;max-width:30px;">`
}
        </td>
        <td class="title" style="width:212px;">
            <span class="fw-inline">
                <span class="edit-image fw-link-text fa fa-image" data-id="${id}">
                    ${escapeText(title)}
                </span>
            </span>
        </td>
        <td class="checkable" style="width:30px;">
        </td>
    </tr>`

/** A template to select images inside the figure configuration dialog in the editor. */
export const figureImageTemplate = ({imageDB}) =>
    `<div>
        <table id="imagelist" class="tablesorter fw-data-table" style="width:342px;">
            <thead class="fw-data-table-header">
                <tr>
                    <th width="50">${gettext("Image")}</th>
                    <th width="150">${gettext("Title")}</th>
                </tr>
            </thead>
            <tbody class="fw-data-table-body fw-small">
                ${Object.values(imageDB).map(image => figureImageItemTemplate(image))}
            </tbody>
        </table>
        <div class="dialogSubmit">
            <button class="edit-image createNew fw-button fw-light">
                ${gettext("Upload")}
                <span class="fa fa-plus-circle"></span>
            </button>
            <button type="button" id="selectImageFigureButton" class="fw-button fw-dark">
                ${gettext("Insert")}
            </button>
            <button type="button" id="cancelImageFigureButton" class="fw-button fw-orange">
                ${gettext("Cancel")}
            </button>
        </div>
    </div>`

/** A template to configure the display of a figure in the editor. */
export const configureFigureTemplate = ({language}) =>
    `<div class="fw-media-uploader">
            <input type="hidden" id="figure-category">
            <div class="figure-preview">
                <div class="inner-figure-preview"></div>
            </div>
            <table class="fw-dialog-table">
                <tbody>
                    <tr>
                        <th><h4 class="fw-tablerow-title">${gettext("Alignment")}</h4></th>
                        <td>
                            <select class="figure-alignment">
                                <option value="left">${gettext("Left")}</option>
                                <option value="center">${gettext("Center")}</option>
                                <option value="right">${gettext("Right")}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><h4 class="fw-tablerow-title">${gettext("Width")}</h4></th>
                        <td>
                            <div class="figure-width fw-dropdown fw-large fw-light fw-button"><label></label>&nbsp;<span class="fa fa-caret-down"></span></div>
                        </td>
                    </tr>
                    <tr>
                        <th><h4 class="fw-tablerow-title">${gettext("Listed as")}</h4></th>
                        <td>
                            <select class="figure-category">
                                <option value="none">${gettext("None")}</option>
                                ${
    Object.entries(CATS).map(([id, titleObject]) =>
        `<option value="${id}">${titleObject[language]}</option>`
    ).join("")
}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><h4 class="fw-tablerow-title">${gettext("Caption")}</h4></th>
                        <td>
                            <select class="figure-caption">
                                <option value="true">${gettext("Enable")}</option>
                                <option value="false">${gettext("Disable")}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><h4 class="fw-tablerow-title">${gettext("Alt")}</h4></th>
                        <td>
                            <input class="image-alt"></input>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>`

/** A template to configure citations in the editor */
export const configureCitationTemplate = ({citedItemsHTML, citeFormat}) =>
    `<div id="my-sources" class="fw-ar-container">
            <h3 class="fw-green-title">${gettext("My sources")}</h3>
        </div>
        <span id="add-cite-source" class="fw-button fw-large fw-square fw-light fw-ar-button"><i class="fa fa-caret-right"></i></span>
        <div id="cited-items" class="fw-ar-container">
            <h3 class="fw-green-title">${gettext("Citation format")}</h3>
            <div class="fw-select-container">
                <select id="citation-style-selector" class="fw-button fw-light fw-large" required="">
                    <option value="autocite" ${citeFormat === "autocite" ? "selected" : ""}>${gettext("(Author, 1998)")}</option>
                    <option value="textcite" ${citeFormat === "textcite" ? "selected" : ""}>${gettext("Author (1998)")}</option>
                </select>
                <div class="fw-select-arrow fa fa-caret-down"></div>
            </div>
            <table id="selected-cite-source-table" class="fw-data-table tablesorter">
                <thead class="fw-data-table-header"><tr>
                    <th width="135">${gettext("Title")}</th>
                    <th width="135">${gettext("Author")}</th>
                    <th width="50" align="center">${gettext("Order")}</th>
                    <th width="50" align="center">${gettext("Remove")}</th>
                </tr></thead>
                <tbody class="fw-data-table-body fw-min">
                  ${citedItemsHTML}
                </tbody>
            </table>
        </div>`

/** A template for each selected citation item inside the citation configuration
    dialog of the editor. */
export const selectedCitationTemplate = ({title, author, id, db, prefix, locator}) =>
    `<tr id="selected-source-${db}-${id}" class="selected-source">
        <td colspan="4" width="385">
          <table class="fw-cite-parts-table">
              <tr>
                  <td width="135">
                      <span class="fw-data-table-title fw-inline">
                          <i class="fa fa-book"></i>
                          <span data-id="${id}">
                              ${escapeText(title)}
                          </span>
                      </span>
                  </td>
                  <td width="135">
                      <span class="fw-inline">
                          ${escapeText(author)}
                      </span>
                  </td>
                  <td width="50" align="center">
                      <span class="order-down fw-inline fw-link-text" data-id="${id}" data-db="${db}">
                          <i class="fa fa-sort-down"></i>
                      </span>
                      <span class="order-up fw-inline fw-link-text" data-id="${id}" data-db="${db}">
                          <i class="fa fa-sort-up"></i>
                      </span>
                  </td>
                  <td width="50" align="center">
                      <span class="delete fw-inline fw-link-text" data-id="${id}" data-db="${db}">
                          <i class="fa fa-trash-alt"></i>
                      </span>
                  </td>
              </tr>
              <tr>
                  <td class="cite-extra-fields" colspan="3" width="335">
                      <div>
                          <label>${gettext("Page")}</label>
                          <input class="fw-cite-page" type="text" value="${escapeText(locator)}" />
                      </div>
                      <div>
                          <label>${gettext("Text before")}</label>
                          <input class="fw-cite-text" type="text" value="${escapeText(prefix)}" />
                      </div>
                  </td>
              </tr>
          </table>
      </td>
    </tr>`


export const contributorTemplate = ({contributor}) =>
    `<input type="text" name="firstname" value="${contributor.firstname ? contributor.firstname : ""}" placeholder="${gettext("Firstname")}"/>
    <input type="text" name="lastname" value="${contributor.lastname ? contributor.lastname : ""}" placeholder="${gettext("Lastname")}"/>
    <input type="text" name="email" value="${contributor.email ? contributor.email : ""}" placeholder="${gettext("Email")}"/>
    <input type="text" name="institution" value="${contributor.institution ? contributor.institution : ""}" placeholder="${gettext("Institution")}"/>
    `

export const languageTemplate = ({currentLanguage, allowedLanguages}) =>
    `<select class="fw-button fw-light fw-large">
        ${
    allowedLanguages.map(language =>
        `<option value="${language[0]}" ${language[0] === currentLanguage ? "selected" : ""}>
                    ${language[1]}
                </option>`
    ).join("")
}
    </select>`
