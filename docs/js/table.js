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
    rubyElement.classList.add(getAnswerCharClass(number))

    var rtElement = document.createElement("rt")
    rtElement.innerText = number
    rtElement.classList.add(getNumberClass(number))
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
    for (let number = 1; number <= length; number++) {
        var thElement = document.createElement("th")
        thElement.innerText = number
        thElement.classList.add(getNumberClass(number))
        headElement.appendChild(thElement)
    }
    headElement.addEventListener("click", clickProblem)
    return headElement
}

function createAnswerBodyElement(length) {
    var bodyElement = document.createElement("tr")
    for (let number = 1; number <= length; number++) {
        var tdElement = document.createElement("td")
        tdElement.appendChild(createInputCharElement(number))
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}

function createInputCharElement(number) {
    const elementId = getAnswerCharClass(number)
    var inputElement = document.createElement("input")
    inputElement.id = elementId
    inputElement.classList.add("charInput")
    inputElement.addEventListener("change", function(){writeChar(number)})
    return inputElement
}

function writeChar(number) {
    const elementId = getAnswerCharClass(number)
    const inputElement = document.getElementById(elementId)
    const inputChar = getKatakana(inputElement.value)

    var charElements = document.getElementsByClassName(elementId)
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

function highlightElement(element) {
    clearHighlight()
    if(element === null) return
    for(const elementClass of element.classList){
        const number = getClassNumber(elementClass)
        if (number < 0) return
        console.log(number);
        highlight(number)
    }
}

function highlight(number) {
    var elements = document.getElementsByClassName(getAnswerCharClass(number))
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