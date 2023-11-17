import {escapeText} from "../../common"

/** A template for HTML export of a document. */
export const htmlExportTemplate = ({head, body, back, settings, lang, xhtml}) =>
    `${
        xhtml ?
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" :
            "<!DOCTYPE html>"
    }
<html lang="${lang}"${xhtml ? ` xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}"` : ""}>
    <head>
        <meta charset="UTF-8">
        ${settings.copyright && settings.copyright.holder ? `<meta name="copyright" content="© ${settings.copyright.year ? settings.copyright.year : new Date().getFullYear()} ${escapeText(settings.copyright.holder)}" />` : ""}
        ${head}
        <link rel="stylesheet" href="assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/css/document-unq.css">
        <link rel="stylesheet" media="print" href="assets/css/styles-print.css">
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media
        queries -->
        <!--[if lt IE 9]>
         <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
         <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
        <script type="text/javascript" src="assets/js/toggle-navbar.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    </head>
    <body>
    <header class="navbar navbar-light bg-light" id="header">
            <a class="navbar-brand logo-unq" href="#">
            <img class="logo-unq-img" src="assets/media/logo_unq_virtual.png" width="153" height="54" alt="logo_virtual_unq">
            <img class="logo-unq-img" src="assets/media/logo_unq.png" width="136" height="51" alt="logo_unq">
            </a>
            <a class="navbar-brand" id="navbar-brand-title" href="#">
            <h3 id="navbar-title">Gestión de pymes</h3>
            <img id="logo-mdm-img" src="assets/media/logo_mdm_blanco.jpg" alt="logo_mdm_blanco">
            </a><nav class="navbar navbar-light bg-light justify-content-end" id="menu">
            <div class="collapse show navbar-collapse justify-content-end" id="menu-short">
            <div class="container-fluid">
                <div class="row">
                <div class="navbar-nav justify-content-end">
                    <h5 class="navbar-brand" id="menu-short-title">Menu</h5>
                </div>
                </div>
            </div>
            </div>
            <div class="collapse navbar-collapse justify-content-end" id="menu-long">
            <div class="container-fluid">
                <div class="row">
                <div class="navbar-nav justify-content-end"><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Inicio" aria-hidden="true" aria-label="Inicio" class="nav-item nav-link icon navbaricon " href="index.html">H</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Legales" aria-hidden="true" aria-label="Legales" class="nav-item nav-link icon navbaricon " href="legales.html">T</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Introducción" aria-hidden="true" aria-label="Introducción" class="nav-item nav-link icon navbaricon " href="introduccion.html">q</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Unidad 1" aria-hidden="true" aria-label="Unidad 1" class="nav-item nav-link icon navbaricon navbar-unidad-icon " href="unidad-1.html">1</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Unidad 2" aria-hidden="true" aria-label="Unidad 2" class="nav-item nav-link icon navbaricon navbar-unidad-icon active" href="unidad-2.html">2</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Referencias bibliográficas" aria-hidden="true" aria-label="Referencias bibliográficas" class="nav-item nav-link icon navbaricon " href="bibliografia.html">B</a><a data-bs-placement="bottom" data-bs-toggle="tooltip" title="Imprimir" aria-hidden="true" aria-label="Imprimir" class="nav-item nav-link icon navbaricon " href="javascript:imprimirMDM();">F</a>
                </div>
                </div>
            </div>
            </div>
        </nav>
    </header>
        <section id="main" class="container-fluid">
            <div class="row">
                <div class="col-md-4 d-none d-md-block" id="indice"><ul class="list-group" id="index-unidad"><li class="index-item-unidad list-group-item  list-group-item-action"><a class="index-href index-title-font" href="unidad-2.html#unidad-title"><span class="index-color">2.</span> La dirección en las pymes. Fundamentos del proceso gerencial</a><ul class="list-group"><li class="index-item-unidad list-group-item list-group-item-action list-hover"><a class="index-href index-font" href="unidad-2.html#apartado-1"><span class="index-color">2.1.</span> La administración operativa </a></li><li class="index-item-unidad list-group-item list-group-item-action list-hover"><a class="index-href index-font" href="unidad-2.html#apartado-2"><span class="index-color">2.2.</span> Las estructuras, funciones y roles gerenciales en las pymes</a><ul class="list-group collapse"><li class="index-item-unidad list-group-item list-group-item-action"><a class="index-href index-font" href="unidad-2.html#subapartado-2-1"><span class="index-color">2.2.1.</span> Estructuras</a></li><li class="index-item-unidad list-group-item list-group-item-action"><a class="index-href index-font" href="unidad-2.html#subapartado-2-2"><span class="index-color">2.2.2.</span> Las funciones gerenciales y las pymes</a></li></ul></li></ul></li></ul></div>
                <div class="col-md-8 offset-md-4"><div id="main-content-unidad">            
                ${body} 
                ${back}
                    ${
                settings.copyright && settings.copyright.holder ?
                    `<div>© ${settings.copyright.year ? settings.copyright.year : new Date().getFullYear()} ${settings.copyright.holder}</div>` :
                    ""
            }
                    ${
                settings.copyright && settings.copyright.licenses.length ?
                    `<div>${settings.copyright.licenses.map(license => `<a rel="license" href="${escapeText(license.url)}">${escapeText(license.title)}${license.start ? ` (${license.start})` : ""}</a>`).join("</div><div>")}</div>` :
                    ""
            }
                </div>
                </div>
            </div>
        </section> 
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/wheelzoom.js"></script>
    <script src="assets/js/tooltip.js"></script>
    <script src="assets/js/script.js"></script>
    </body>
</html>`
