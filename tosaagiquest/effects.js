function modifyText(textInput, color, weight) {
    let text;
        if (weight === 3) {
            text = `<span class="${color}"><strong>${textInput}</strong></span>`;
        } else if (weight === 2) {
            text = `<span class="${color}">${textInput}</span>`;
        }

    return text;
}

function fadeOut(element) {
    let opac = 1;
    let timer = setInterval(() => {
        if (opac <= 0.1){
            clearInterval(timer);
            element.style.opacity = "none";
        }

        element.style.opacity = opac;
        element.style.filter = `alpha(opacity=${opac * 100})`;
        opac -= opac * 0.1;
    }, 50);
}

export {modifyText, fadeOut};