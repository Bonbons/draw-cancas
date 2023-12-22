const canvas = new fabric.Canvas('canvas', { width: 1024, height: 1024 });

// Clear canvas - Delete shapes

document.getElementById('clear').addEventListener('click', () => {
  !deleteActiveObjects() && canvas.clear();
});

document.addEventListener('keydown', (event) => {
   event.key === 'Delete' && deleteActiveObjects();
})

function deleteActiveObjects() {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length === 0 )
    return false;
  activeObjects.forEach(activeObject => canvas.remove(activeObject));
  canvas.remove(activeObjects);
  return true;
}


// SHAPES STYLES  ―――――――――――――――――――――――――

const styleZone = document.getElementById('styleZone');
const colors = ['#43c8bf', '#896bc8', '#e54f6b'];
let defaultColor = colors[0];
let activeElement = null;
const isSelectedClass = 'isSelected';
let spans = [];

colors.forEach((color, i) => {
  const span = document.createElement('span');
  span.style.background = color;
  let icon = '';
  if(i === 0) {
    span.className = isSelectedClass;
    activeElement = span;
    icon = feather.icons.check.toSvg({'color':'currentColor'});
  }
  span.innerHTML = icon;  
  styleZone.appendChild(span);
  spans.push(span);
  span.addEventListener('click', (event) => {
    spans.forEach(spanToReset => spanToReset.innerHTML = '');
    if(span.className !== isSelectedClass) {
      span.classList.toggle(isSelectedClass);
      activeElement.classList.remove(isSelectedClass);
      activeElement = span;
      strokeColor = color;
      span.innerHTML = feather.icons.check.toSvg({'color':'currentColor'});
    }
    
    if(canvas.getActiveObject()) {
      const activeObjects = canvas.getActiveObjects();
      if (!activeObjects.length) return;

      activeObjects.forEach(function (object) {
        object.set('stroke', strokeColor);
      });
      
      canvas.renderAll();
    }
  
  })
  
});


// SHAPES CREATION  ―――――――――――――――――――――――――

let strokeWidth = 2;
let strokeColor = defaultColor;

// Square

document.getElementById('square').addEventListener('click', () => {
  canvas.add(new fabric.Rect({
    strokeWidth: strokeWidth,
    stroke: strokeColor,
    fill: 'transparent',
    width: 50,
    height: 50,
    left: 100,
    top: 100
  }));
});

// Circle

document.getElementById('circle').addEventListener('click', () => {
  canvas.add(new fabric.Circle({
    radius: 30,
    strokeWidth: strokeWidth,
    stroke: strokeColor,
    fill: 'transparent',
    left: 100,
    top: 100
  }));
});

// Triangle

document.getElementById('triangle').addEventListener('click', () => {
  canvas.add(new fabric.Triangle({
    strokeWidth: strokeWidth,
    stroke: strokeColor,
    fill: 'transparent',
    width: 50,
    height: 50,
    left: 100,
    top: 100
  }));
});

document.getElementById('download').addEventListener('click', () => {
  // Contenu du fichier texte
  var texte = JSON.stringify(canvas.toJSON());

  // Création d'un objet Blob avec le texte
  var blob = new Blob([texte], { type: "text/plain" });

  // Création d'une URL pour le Blob
  var url = URL.createObjectURL(blob);

  // Création d'un élément <a> pour le téléchargement
  var a = document.createElement("a");
  a.href = url;
  a.download = "objects.json";

  // Ajout de l'élément <a> au corps du document
  document.body.appendChild(a);

  // Clic sur l'élément <a> pour déclencher le téléchargement
  a.click();

  // Suppression de l'élément <a> du corps du document
  document.body.removeChild(a);

  // Révocation de l'URL pour libérer des ressources
  URL.revokeObjectURL(url);

});

document.getElementById('upload').addEventListener('click', () => {
  // Créer un élément d'entrée de fichier
  const input = document.createElement('input');
  input.type = 'file';

  input.onchange = e => { 
    const file = e.target.files[0]; 

     // setting up the reader
     const reader = new FileReader();
     reader.readAsText(file); // this is reading as data url
  
     // here we tell the reader what to do when it's done reading...
     reader.onload = readerEvent => {
        const content = readerEvent.target.result; // this is the content!
        const json = JSON.parse(content);
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
        });
      }
  }
  
  input.click();
  
});

feather.replace();
