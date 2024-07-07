document.getElementById("inputText").addEventListener("input", update)
document.getElementById("kanaAll").addEventListener("change", update)
document.getElementById("setRow").addEventListener("change", update)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)} );

document.getElementById("problem").addEventListener("click", clickProblem);

function setProblem() {
    var params = new URLSearchParams(document.location.search);
    setMode(params.get("m"))

    var problem = []
    if (params.has("t")) {
        problem = codeToProblem(params.get("t"))
    }
    var kanaSet = new Set()
    if (params.has("k")) {
        kanaSet = codeToKana(params.get("k"))
    }
    var row =params.has("r") ? Number(params.get("r")) : 30
    const kanas = [...kanaSet].join('')
    const text = toText(problem, kanas)
    show(text, kanas, row)
    document.getElementById("inputText").value = text
    document.getElementById("setRow").value = row
}
setProblem();

function toText(problem, kanas) {
    var text = []
    for (const p of problem) {
        if (typeof(p) == "number") {
            text.push(kanas[p-1])
        } else {
            text.push(p)
        }
    }
    return text.join('')
}

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

function showProblem(text, kanas, row) {
    const problem = inputToProblem(text, kanas)
    const problemList = problem[0]
    const kanaSet = problem[1]
    const answerRow = Math.floor(row * 3 / 5)

    var problemElement = document.getElementById("problem")
    problemElement.innerHTML = null
    problemElement.appendChild(createProblemElement(problemList, row))

    var answerElement = document.getElementById("answer")
    answerElement.innerHTML = null
    answerElement.appendChild(createAnswerElement(kanaSet.length, answerRow))

    return kanaSet
}

function setKana(kanas) {
    var kanaElement = document.getElementById("kanaAll")
    kanaElement.value = kanas.join('')
    kanaElement.size = kanas.length * 2 + 2
}

function showUrl(isEdit, isCheck) {
    var params = new URLSearchParams();
    if (isEdit) {
        params.append("m", "edit")
    } else {
        params.append("m", "solve")
    }

    const text = document.getElementById("inputText").value
    const kanas = document.getElementById("kanaAll").value
    const row = document.getElementById("setRow").value

    const problem = inputToProblem(text, kanas)
    params.append("t", problemToCode(problem[0]))
    params.append("k", kanaToCode(problem[1]))
    params.append("r", row)

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
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}