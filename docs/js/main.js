document.getElementById("inputText").addEventListener("input", update)
document.getElementById("kanaAll").addEventListener("change", update)
document.getElementById("setRow").addEventListener("change", updateSize)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true)});
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false)});

document.getElementById("checkProblem").addEventListener("click", checkProblem);

document.getElementById("problem").addEventListener("click", clickProblem);

function setMode() {
    const hiddenClass = (isEditMode()) ? "displaySolveMode" : "displayEditMode"
    var elements = document.getElementsByClassName(hiddenClass);
    for (const element of elements) {
        element.classList.add("hidden")
    }
}
setMode();

function setProblem(row = -1) {
    var params = new URLSearchParams(document.location.search);
    var problemList = []
    if (params.has("t")) {
        problemList = codeToProblem(params.get("t"))
    }
    var kanaSet = new Set()
    if (params.has("k")) {
        kanaSet = codeToKana(params.get("k"))
    }
    if (row < 0) {
        var row = params.has("r")? Number(params.get("r")) : 30
    }
    show(problemList, kanaSet, row)
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

function updateSize() {
    if (isEditMode()) {
        update()
    } else {
        const row = document.getElementById("setRow").value
        setProblem(row)
    }
}

function show(problemList, kanaSet, row) {
    if (problemList.length === 0) {
        return
    }

    showProblem(problemList, kanaSet, row)
    if (isEditMode()) {
        showKana(kanaSet)
        analytics(problemList, kanaSet)
    }
}

function showProblem(problemList, kanaSet, row) {
    row = (row < 5)? 5: row
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

function showUrl(isEdit) {
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

function isEditMode() {
    const params = new URLSearchParams(document.location.search);
    if (params.has("m") && params.get("m") == "solve") {
        return false
    }
    return true
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}

function checkProblem() {
    const params = new URLSearchParams(document.location.search);
    if (!params.has("k") || !params.has("m") || params.get("m") !== "solve") {
        say("このURLでは正解判定は使えません。")
        return
    }
    const kanaList = getBoardKanaList()
    if (kanaList.includes("")) {
        say("未完成です")
        return
    }
    const answerKanaSet = codeToKana(params.get("k"))
    const answerKanaList = [...answerKanaSet]

    if (answerKanaList.toString() === kanaList.toString()) {
        say("正解です！")
    } else {
        say("間違っているところがあります")
    }
}

function say(msg) {
    const dialog = document.getElementById("dialog")
    const dialogButton = document.getElementById("dialogButton")
    dialogButton.addEventListener("click", function(){dialog.close()})
    const dialogMessage = document.getElementById("dialogMessage")
    dialogMessage.innerText = msg
    dialog.showModal()
}