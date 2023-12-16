NEWLINE = "\n"

function showProblem(text, kanas, row) {
    const lines = sliceText(text, row)

    var noKanaWords = []
    var kanaWords = []
    for (const line of lines) {
        var split = splitText(line)
        for (let index = 0; index < split.length; index+=2) {
            noKanaWords.push(split[index])
            kanaWords.push(split[index + 1])
        }
        noKanaWords.push(NEWLINE)
        kanaWords.push("")
    }

    const inputKanaSet = kanaSetFromStr(kanas)
    const kanaSet = mergeKanaSet(inputKanaSet, kanaWords)

    var numberList = []
    for (const word of kanaWords) {
        numberList.push(getNumberList(word, kanaSet))
    }

    var problemElement = document.getElementById("problem")
    problemElement.innerHTML = null
    problemElement.appendChild(createProblemElement(numberList, noKanaWords))
    var answerElement = document.getElementById("answer")
    answerElement.innerHTML = null
    answerElement.appendChild(createAnswerElement(kanaSet.length))

    return kanaSet
}

function createProblemElement(numberList, noKanaList) {
    const element = document.createElement("span")
    if (numberList.length !== noKanaList.length) {
        return element
    }
    for (let index = 0; index < numberList.length; index++) {
        element.appendChild(createNoKanaWordElement(noKanaList[index]))
        element.appendChild(createKanaWordElement(numberList[index]))
    }
    return element
}

function createNoKanaWordElement(str) {
    var spanElement = document.createElement("span")
    spanElement.innerText = str
    return spanElement
}

function createKanaWordElement(numbers) {
    var spanElement = document.createElement("span")
    spanElement.classList.add("kanaWord")
    for (const number of numbers) {
        spanElement.appendChild(createKanaElement(number))
    }
    return spanElement
}

function createKanaElement(number, kana = "") {
    var rubyElement = document.createElement("ruby")
    rubyElement.innerText = kana.length === 1 ? kana : "　"
    rubyElement.classList.add("answerChar" + number)

    var rtElement = document.createElement("rt")
    rtElement.innerText = number
    rubyElement.appendChild(rtElement)

    return rubyElement
}

function createAnswerElement(length) {
    const tableElement = document.createElement("table")
    tableElement.appendChild(createAnswerHeadElement(length))
    tableElement.appendChild(createAnswerBodyElement(length))
    return tableElement
}

function createAnswerHeadElement(length) {
    var headElement = document.createElement("tr")
    for (let index = 0; index < length; index++) {
        var thElement = document.createElement("th")
        thElement.innerText = index + 1
        headElement.appendChild(thElement)
    }
    return headElement
}

function createAnswerBodyElement(length) {
    var bodyElement = document.createElement("tr")
    for (let index = 0; index < length; index++) {
        var tdElement = document.createElement("td")
        tdElement.appendChild(createInputCharElement(index))
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}

function createInputCharElement(index) {
    const elementId = "answerChar" + String(index + 1)
    var inputElement = document.createElement("input")
    inputElement.id = elementId
    inputElement.classList.add("charInput")
    inputElement.addEventListener("change", function(){writeChar(index + 1)})
    return inputElement
}

function writeChar(id) {
    const elementId = "answerChar" + id
    const inputElement = document.getElementById(elementId)
    const inputChar = getKatakana(inputElement.value)

    var charElements = document.getElementsByClassName(elementId)
    for (var charElement of charElements) {
        const newElement = createKanaElement(id, inputChar)
        charElement.innerHTML = newElement.innerHTML
    }
    inputElement.value = inputChar
}
