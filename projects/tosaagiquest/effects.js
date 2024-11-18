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

function verticalWipe(element) {
    element.style.display = "block"
    element.style.bottom = "";
    element.style.top = "0";
    element.style.height = "20%";

    setTimeout(() => {
        element.style.height = "40%";

        setTimeout(() => {
            element.style.height = "60%";
            
            setTimeout(() => {
                element.style.height = "80%";

                setTimeout(() => {
                    element.style.height = "100%";
                }, 50);
            }, 50);
        }, 50);
    }, 50);
}

function verticalWipeOut(element) {
    element.style.top = "";
    element.style.bottom = "0";
    element.style.height = "80%";

    setTimeout(() => {
        element.style.height = "60%";

        setTimeout(() => {
            element.style.height = "40%";

            setTimeout(() => {
                element.style.height = "20%";

                setTimeout(() => {
                    element.style.display = "none";
                    element.style.flexDirection = "row";
                }, 50);
            }, 50);
        }, 50);
    }, 50);
}

export {modifyText, fadeOut, verticalWipe, verticalWipeOut};