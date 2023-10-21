function setupJsonData(element) {
  element.addEventListener('change', handleFileSelect);
  let jsonData = {};
  let currentLine = 0;
  let currentKey = 0;
  let linesPerPage = 1;
  const jsonContainer = document.getElementById('jsonViewer');

  function handleFileSelect(event) {
    const inputElement = event.target;

    if (!inputElement.files || !inputElement.files[0]) return;

    const file = inputElement.files[0];

    if (file.type !== 'application/json') {
      document.getElementById('alert').style.display = 'block';
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const json = event.target.result;

      try {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('alert').style.display = 'none';
        document.getElementById('card').style.display = 'none';
        jsonData = JSON.parse(json);
        const name = file.name;
        jsonContainer.innerHTML = `<div id='intro'><h1>${name}</h1></div>`;
        renderJSONData();
      } catch (error) {
        alert('Erro ao analisar JSON.');
      }
    };

    reader.readAsText(file);
  }

  function renderJSONData() {
    if (jsonContainer) {
      const keys = Object.keys(jsonData);
      for (let i = currentKey; i < keys.length; i++) {
        const key = keys[i];
        const data = jsonData[key];
        if (Array.isArray(data)) {
          let objectDiv = document.createElement('div');
          if (document.getElementById('json-object-father')) {
            objectDiv = document.getElementById('json-object-father');
          } else {
            objectDiv.className = 'json-object';
            objectDiv.id = 'json-object-father';
            objectDiv.innerHTML = `<h1>${keys[i]}:<span>[<span></h1>`;
            jsonContainer.appendChild(objectDiv);
          }
          for (let line = currentLine; line < Math.min(data.length, currentLine + linesPerPage); line++) {
            const dataToRender = data[line];
            const objectContainer = ValidatedTypeIndexOf(dataToRender);
            objectDiv.innerHTML = `${objectDiv.innerHTML}<h2 class='json-object-children-elementens-father'>${line}:{</h2>`;
            objectDiv.appendChild(objectContainer);
            objectDiv.innerHTML = `${objectDiv.innerHTML}<h2 class='json-object-children-elementens-father'>}</h2>`;
          }

          if (currentLine + linesPerPage < data.length) {
            currentLine += linesPerPage;
          } else {
            currentLine = 0;
            currentKey = i + 1;
          }

          const objectDiv2 = document.createElement('div');

          if (document.getElementById('json-object-father-close')) {
            return;
          } else {
            objectDiv2.className = 'json-object';
            objectDiv2.id = 'json-object-father-close';
            objectDiv2.innerHTML = `<h1><span>]</span></h1>`;
            jsonContainer.appendChild(objectDiv2);
          }
        } else {
          if(document.getElementsByClassName(`json-object-${data}`).length ===0 ){
            const objectString = JSON.stringify(data, null, 2);
            const objectDiv = document.createElement('div');
            objectDiv.className = `json-object-${data}`;
            objectDiv.innerHTML = `<h2 id='uniq'>${i}: <span>${objectString}</span></h2>`;
            jsonContainer.appendChild(objectDiv); 
          }

        }
      }
      jsonContainer.classList.add('json-container');
    }
  }

  function ValidatedTypeIndexOf(data) {
    const container = document.createElement('div');
    container.className = 'json-object-children-elementens-children';

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        const containerChildren = document.createElement('div');
        containerChildren.innerHTML = `<h3>${key}:<span>[</span></h3>`;
        const value = ValidatedTypeIndexOf(data[key]);
        containerChildren.appendChild(value);
        container.appendChild(containerChildren);
        containerChildren.innerHTML += "<h3><span>]</span></h3>";
      } else {
        const value = data[key];
        if (typeof value === "object" && value !== null || Array.isArray(value) && value !== null) {
          const containerChildren = document.createElement('div');
          const keyTagOpen = typeof value === "object" ? '{' : '[';
          const keyTagClose = typeof value === "object" ? '}' : ']';
          containerChildren.innerHTML = `<h3 class='key-open'>${key}:<span>${keyTagOpen}<span></h3>`;
          const valueInContainer = ValidatedTypeIndexOf(value);
          containerChildren.appendChild(valueInContainer);
          container.appendChild(containerChildren);
          containerChildren.innerHTML += `<h3><span>${keyTagClose}</span></h3>`;
        } else {
          var paragrafo = document.createElement("h2");
          paragrafo.innerHTML = key + ": " + `<span>${value}</span>`;
          container.appendChild(paragrafo);
        }
      }
    });

    return container;
  }

  function handleScroll() {
    if (jsonContainer.scrollTop + jsonContainer.clientHeight >= jsonContainer.scrollHeight - 500) {
      renderJSONData();
    }
  }

  if (jsonContainer) {
    jsonContainer.addEventListener('scroll', handleScroll);
  }
}
