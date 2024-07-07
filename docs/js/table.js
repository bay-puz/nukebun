function createProblemElement(problem, row) {
    const element = document.createElement("p")
    element.id = "sentence"
    var rowCount = 0
    for (const char of problem) {
        if (rowCount >= row) {
            if (! isKutoten(char)) {
                var brElement = document.createElement("br")
                element.appendChild(brElement)
                rowCount = 0
            }
        }
        if (typeof(char) === 'number') {
            element.appendChild(createKanaElement(char))
            rowCount++
            continue
        }
        if (isNewLine(char)) {
            if (rowCount === 0) continue
            element.insertAdjacentHTML("beforeend", createFillString(row - rowCount))
            rowCount = row
            continue
        }
        element.insertAdjacentHTML("beforeend", char)
        rowCount++
    }
    element.insertAdjacentHTML("beforeend", createFillString(row - rowCount))
    return element
}

function createKanaElement(number, kana = "") {
    var rubyElement = document.createElement("ruby")
    rubyElement.innerText = kana.length === 1 ? kana : "　"
    rubyElement.classList.add(getAnswerCharClass(number))
    rubyElement.classList.add("kana")

    var rtElement = document.createElement("rt")
    rtElement.innerText = number
    rtElement.classList.add(getNumberClass(number))
    rubyElement.appendChild(rtElement)

    return rubyElement
}

function createFillString(count) {
    if (count <= 0) return ""
    var string = ""
    for (let index = 0; index < count; index++) {
        string += "　"
    }
    return string
}

function createAnswerElement(length, row) {
    const tableElement = document.createElement("table")
    var offset = 0
    while (length > row) {
        tableElement.appendChild(createAnswerHeadElement(row, offset))
        tableElement.appendChild(createAnswerBodyElement(row, offset))
        length = length - row
        offset = offset + row
    }
    if (length > 0) {
        tableElement.appendChild(createAnswerHeadElement(length, offset))
        tableElement.appendChild(createAnswerBodyElement(length, offset))
    }
    return tableElement
}

function createAnswerHeadElement(length, offset = 0) {
    var headElement = document.createElement("tr")
    for (let number = 1; number <= length; number++) {
        var thElement = document.createElement("th")
        thElement.innerText = number + offset
        thElement.classList.add(getNumberClass(number + offset))
        headElement.appendChild(thElement)
    }
    headElement.addEventListener("click", clickProblem)
    return headElement
}

function createAnswerBodyElement(length, offset = 0) {
    var bodyElement = document.createElement("tr")
    for (let number = 1; number <= length; number++) {
        var tdElement = document.createElement("td")
        tdElement.appendChild(createInputCharElement(number + offset))
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}

function createInputCharElement(number) {
    const elementId = getCharInputId(number)
    var inputElement = document.createElement("input")
    inputElement.id = elementId
    inputElement.classList.add("charInput")
    inputElement.addEventListener("change", function(){writeChar(number)})
    inputElement.addEventListener("focusin", function(){highlight(number)})
    return inputElement
}

function writeChar(number) {
    highlight(number)
    const inputElement = document.getElementById(getCharInputId(number))
    const inputChar = getKatakana(inputElement.value)

    var charElements = document.getElementsByClassName(getAnswerCharClass(number))
    for (var charElement of charElements) {
        const newElement = createKanaElement(number, inputChar)
        charElement.innerHTML = newElement.innerHTML
    }
    inputElement.value = inputChar
}

function getNumberClass(number) {
    return "number" + String(number)
}

function getAnswerCharClass(number) {
    return "answerChar" + String(number)
}

function getCharInputId(number) {
    return "input" + String(number)
}

function highlightElement(element) {
    if(element === null) return
    for(const elementClass of element.classList){
        const number = getClassNumber(elementClass)
        if (number < 0) continue
        highlight(number)
        document.getElementById(getCharInputId(number)).focus()
        return
    }
    clearHighlight()
}

function highlight(number) {
    clearHighlight()
    var elements = document.getElementsByClassName(getAnswerCharClass(number))
    for (var element of elements) {
        element.classList.add("highlight")
    }
    var elements = document.getElementsByClassName(getNumberClass(number))
    for (var element of elements) {
        element.classList.add("highlight")
    }
}

function clearHighlight() {
    const elements = document.getElementsByClassName("highlight")
    while (elements.length > 0) {
        elements[0].classList.remove("highlight")
    }
}

function getClassNumber(className) {
    if(className.startsWith("number")) {
        return Number(className.substring(6))
    }
    if(className.startsWith("answerChar")) {
        return Number(className.substring(10))
    }
    return -1
}