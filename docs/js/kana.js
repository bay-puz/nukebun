function isKana(char) {
    if (char.charAt(0) === "ー") {
        return true
    }
    return ('ァ'.codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= 'ヺ'.codePointAt(0))
}

function normalizeKana(char) {
    if(!isKana(char)) {
        return char
    }
    kanaBefore = "ァィゥェォヵヶッャュョヮ"
    kanaAfter = "アイウエオカケツヤユヨワ"

    index = kanaBefore.indexOf(char)
    if(index >= 0 ) {
        return kanaAfter.charAt(index)
    }
    return char
}

function sliceText(text, row) {
    var textLines = []
    for (let index = 0; index < text.length; index+=row) {
        const subText = text.substring(index, index + row)
        textLines.push(subText)
    }
    return textLines
}

function splitText(textLine) {
    var charList = []
    for (let index = 0; index < textLine.length; index++) {
        charList.push(normalizeKana(textLine.charAt(index)))
    }
    var splitList = []
    var preIsKana = false
    splitList.push('')
    for (let index = 0; index < charList.length; index++) {
        const char = charList[index]
        const nowIsKana = isKana(char)
        if (preIsKana === nowIsKana) {
            const lastIndex = splitList.length - 1
            splitList[lastIndex] += char
        } else {
            splitList.push(char)
            preIsKana = nowIsKana
        }
    }
    if (!preIsKana) {
        splitList.push('')
    }
    return splitList
}

function convertNoKana(str) {
    var spanElement = document.createElement("span")
    spanElement.innerText = str
    return spanElement
}

function convertNumber(numbers) {
    var spanElement = document.createElement("span")
    spanElement.classList.add("kanaWord")
    for (const number of numbers) {
        const rtElement = document.createElement("rt")
        rtElement.innerText = number

        const rubyElement = document.createElement("ruby")
        rubyElement.innerText = "＿"
        rubyElement.appendChild(rtElement)

        spanElement.appendChild(rubyElement)
    }
    return spanElement
}

function isIncluded(list1, list2) {
    if (list1.length >= list2.length) {
        return false
    }
    for (const kana of list1) {
        if (!list2.includes(kana)) {
            return false
        }
    }
    return true
}

function kanaSetFromStr(kanaStr) {
    var set = new Set()
    for (let index = 0; index < kanaStr.length; index++) {
        char = kanaStr.charAt(index)
        if(isKana(char)) {
            set.add(normalizeKana(char))
        }
    }
    return set
}

function mergeKanaSet(baseSet, kanaList) {
    var allKanaSet = new Set()
    for(const word of kanaList) {
        for (let index = 0; index < word.length; index++) {
            allKanaSet.add(word[index])
        }
    }
    for (const kana of baseSet) {
        if (!allKanaSet.has(kana)) {
            baseSet.delete(kana)
        }
    }
    for (const kana of allKanaSet) {
        if (!baseSet.has(kana)) {
            baseSet.add(kana)
        }
    }
    return [...baseSet]
}

function getNumberList(kanaStr, kanaSet) {
    var numbers = []
    for (let index = 0; index < kanaStr.length; index++) {
        char = kanaStr.charAt(index)
        numbers.push(kanaSet.indexOf(char) + 1)
    }
    return numbers
}