document.getElementById("inputText").addEventListener("input", update)
document.getElementById("kanaAll").addEventListener("change", update)
document.getElementById("setRow").addEventListener("change", update)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)} );

document.getElementById("problem").addEventListener("click", clickProblem);

function setProblem() {
    var params = new URLSearchParams(document.location.search);
    var isEdit = true
    if (params.has("m") && params.get("m") != "edit" ) {
        isEdit = false
    }
    setMode(isEdit)
    var problemList = []
    if (params.has("t")) {
        problemList = codeToProblem(params.get("t"))
    }
    var kanaSet = new Set()
    if (params.has("k")) {
        kanaSet = codeToKana(params.get("k"))
    }
    var row =params.has("r") ? Number(params.get("r")) : 30
    show(problemList, kanaSet, row, isEdit)
    document.getElementById("inputText").value = problemToInput(problemList, kanaSet)
    document.getElementById("setRow").value = row
}
setProblem();

function update() {
    const text = document.getElementById("inputText").value
    const kanas = document.getElementById("kanaAll").value
    const row = document.getElementById("setRow").value
    const problem = inputToProblem(text, kanas)
    show(problem[0], problem[1], Number(row))
}

function show(problemList, kanaSet, row, isEdit = true) {
    if (problemList.length === 0) {
        return
    }

    showProblem(problemList, kanaSet, row)
    if (isEdit) {
        showKana(kanaSet)
        analytics(problemList, kanaSet)
    }
}

function showProblem(problemList, kanaSet, row) {
    const answerRow = Math.floor(row * 3 / 5)

    var problemElement = document.getElementById("problem")
    problemElement.innerHTML = null
    problemElement.appendChild(createProblemElement(problemList, row))

    var answerSize = kanaSet.size
    if (answerSize == 0) {
        answerSize = kanaSetLength(problemList)
    }
    var answerElement = document.getElementById("answer")
    answerElement.innerHTML = null
    answerElement.appendChild(createAnswerElement(answerSize, answerRow))
}

function showKana(kanaSet) {
    var kanaElement = document.getElementById("kanaAll")
    kanaElement.value = [...kanaSet].join('')
    kanaElement.size = kanaSet.size * 2 + 2
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
    if (isEdit || isCheck) {
        params.append("k", kanaToCode(problem[1]))
    }
    params.append("r", row)

    const url = new URL(location.href)
    url.search = params;
    var urlElement = document.getElementById("showURL")
    urlElement.href = url
    urlElement.innerText = url.toString()
    var lineElement = document.getElementById("URLLine")
    lineElement.classList.remove("hidden")
}

function setMode(isEdit) {
    const hiddenClass = (isEdit) ? "displaySolveMode" : "displayEditMode"
    var elements = document.getElementsByClassName(hiddenClass);
    for (const element of elements) {
        element.classList.add("hidden")
    }
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}