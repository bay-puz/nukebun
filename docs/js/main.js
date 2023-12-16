document.getElementById("inputText").addEventListener("input", update)
document.getElementById("kanaAll").addEventListener("change", update)
document.getElementById("setRow").addEventListener("change", update)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl("edit")} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl("solve")} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl("solveCheck")} );

document.getElementById("problem").addEventListener("click", clickProblem);

function setProblem() {
    var params = new URLSearchParams(document.location.search);
    setMode(params.get("m"))

    var text = params.has("t") ? params.get("t"): ""
    var kanas = params.has("k") ? params.get("k") : ""
    var row =params.has("r") ? Number(params.get("r")) : 30
    show(text, kanas, row)
    document.getElementById("inputText").value = text
    document.getElementById("setRow").value = row
}
setProblem();

function update() {
    const text = document.getElementById("inputText").value
    const kanas = document.getElementById("kanaAll").value
    const row = document.getElementById("setRow").value
    show(text, kanas, Number(row))
}

function show(text, kanas, row) {
    if (!text || text.length === 0) {
        return
    }
    const kanaSet = showProblem(text, kanas, row)
    setKana(kanaSet)
    analytics(text, kanaSet)
}

function setKana(kanas) {
    var kanaElement = document.getElementById("kanaAll")
    kanaElement.value = kanas.join('')
    kanaElement.size = kanas.length * 2 + 2
}


function showUrl(mode) {
    var params = new URLSearchParams();
    if (mode === "solve" | mode === "solveCheck") {
        params.append("m", "solve");
    } else {
        params.append("m", "edit")
    }
    params.append("t", document.getElementById("inputText").value)
    params.append("k", document.getElementById("kanaAll").value)
    params.append("r", document.getElementById("setRow").value)

    const url = new URL(location.href)
    url.search = params;
    var urlElement = document.getElementById("showURL")
    urlElement.href = url
    urlElement.innerText = url.toString()
    var lineElement = document.getElementById("URLLine")
    lineElement.classList.remove("hidden")
}

function setMode(mode) {
    const hiddenClass = (mode === "solve") ? "displayEditMode" : "displaySolveMode"
    var elements = document.getElementsByClassName(hiddenClass);
    for (const element of elements) {
        element.classList.add("hidden")
    }
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.pageX, event.pageY)
    highlightElement(element)
}