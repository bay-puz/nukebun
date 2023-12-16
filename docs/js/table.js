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
        element.appendChild(convertNoKana(noKanaList[index]))
        element.appendChild(convertNumber(numberList[index]))
    }
    return element
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
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}