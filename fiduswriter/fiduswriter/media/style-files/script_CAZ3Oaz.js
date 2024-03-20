
const pathnameSplit = window.location.pathname.split('/');
const currentPath = pathnameSplit[pathnameSplit.length - 1];

//console.log(currentPath);

const navbarTitleElem = document.getElementById('navbar-title');
const logoMdmImgElem = document.getElementById('logo-mdm-img');

if (currentPath === 'index.html') {
  navbarTitleElem.style.display = 'none';
  logoMdmImgElem.style.display = 'block';
} else  {
  navbarTitleElem.style.display = 'block';
  logoMdmImgElem.style.display = 'none';
}

// ------------------------ Resize Index ----------------

function isInView(elementBox) {
  return elementBox.top < window.innerHeight && elementBox.bottom >= 0;
}

function resizeIndice() {
  let header = document.getElementById("header").getBoundingClientRect();
  let footer = document.getElementById("footer").getBoundingClientRect();
  if(isInView(footer)){
    let footerSize = window.innerHeight - footer.top;
    indice.style.maxHeight = (window.innerHeight - (header.bottom + footerSize + 26)) + "px";
  }else{
    indice.style.maxHeight = (window.innerHeight - header.bottom) + "px";
  }
}

const indice = document.getElementById('indice');
if(indice){
  resizeIndice();
  window.addEventListener("resize", function(){
    resizeIndice();
  });
  window.addEventListener("scroll", function() {
    let footer = document.getElementById("footer").getBoundingClientRect();
    if(isInView(footer)) {
      resizeIndice();
    }
  });  
}
//-----------------------------------------------------------
//------------- scroll spy ----------------------------------

/* 
/  Intersection observer va a ver que elementos estan en la pantalla.
/  Si intersectan un porsentaje (threshold), llaman el callback.
/  En este caso, lo llama cuando se ve completamente, y cuando 
/     se deja de ver el elemento.
*/

function findParentCollapsableUl(li) {
  let ul = null;
  let parent = li.parentNode;
  if(parent instanceof HTMLUListElement && parent.classList.contains("collapse")){
    ul = new bootstrap.Collapse(parent);
  }
  return ul;
}

function findChildCollapsableUl(element) {
  let chosenOne = null;
  let child = element.firstChild;
  while (child) {
    if (child instanceof HTMLUListElement && child.classList.contains("collapse")) {
      chosenOne = new bootstrap.Collapse(child, {toggle: false});
      break;
    }
    child = child.nextSibling;
  }
  return chosenOne;
}

const observer = new IntersectionObserver(function(entries) {
  for(let i=0; i<entries.length; i++) {
    // Propiedades de entries:
    // entries[i]['intersectionRatio']
    // entries[i]['isIntersecting']
    // entries[i]['target']

    //Obtengo el target, que es el <a href..>. y Obtengo su parentNode, que es su <li>
    //Si se ve en la pantalla (isIntersecting), lo coloco como activo.
    // Cuando se deja de ver (El evento del threshold 0), le saco lo activo.

    var li = document.querySelector('a[href*='+entries[i]['target'].id+']').parentNode;
    var ul = findChildCollapsableUl(li);
    if(entries[i]['isIntersecting']){
      li.classList.add("active");
      if(ul && !ul._element.classList.contains("show")){
        ul.show();
      }
    }else{
      li.classList.remove("active");
      if(ul && ul._element.classList.contains("show")){
        ul.hide();
      }
    }
  }
}, { root: null, threshold: [0, 1]  });

//Selecciono todas las clases spy para ser observadas
Array.from(document.querySelectorAll(".spy")).map(x => observer.observe(x));

//-----------------------------------------------------
//----------------list-group hover event---------------
Array.from(document.querySelectorAll(".list-hover")).map(target => {
  target.addEventListener('mouseenter', (e) => {
    let collapsable = findChildCollapsableUl(target);
    collapsable.show();
  });

  target.addEventListener('mouseleave', (e) => {
    if(!target.classList.contains("active")){
      let collapsable = findChildCollapsableUl(target);
      collapsable.hide();
    }
  });
});


//----------------------------------------------------
//------------------imprimir pagina-------------------
function imprimirMDM(){
  var modals = Array.from(document.querySelectorAll("div.modal.fade"));
  
  window.onbeforeprint = (event) => {
    Array.from(document.querySelectorAll(".collapse"))
          .map(collapsable => {
            let collapse = new bootstrap.Collapse(collapsable, {toggle: false});
            collapse.show();
          });
    modals.map(modal => {
            modal.className = 'bloque-texto';
            modal.setAttribute("aria-hidden", "false");
          });
  };

  window.onafterprint = (event) => {
    Array.from(document.querySelectorAll(".collapse"))
          .map(collapsable => {
            let collapse = new bootstrap.Collapse(collapsable, {toggle: true});
          });
    modals.map(modal => {
      modal.className = 'modal fade';
      modal.setAttribute("aria-hidden", "true");
    });
  }

  window.print();
  
  
}