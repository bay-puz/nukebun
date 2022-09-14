function isKana(char) {
    return ('ァ'.codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= 'ー'.codePointAt(0))
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

function splitText(text) {
    var kanaList = []
    var noKanaList = []
    var tmpStr = normalizeKana(text.charAt(0))
    if (isKana(tmpStr)) {
        noKanaList.push('')
    }
    for (let index = 0; index < text.length; index++) {
        const char1 = text.charAt(index)
        if (index < text.length - 1) {
            const char2 = normalizeKana(text.charAt(index + 1))
            if (isKana(char1) === isKana(char2)) {
                tmpStr += char2
                continue
            }
        }
        if (isKana(tmpStr)) {
            kanaList.push(tmpStr)
        }
        else {
            noKanaList.push(tmpStr)
        }
        if (index < text.length - 1) {
            tmpStr = normalizeKana(text.charAt(index + 1))
        }
        else if (!isKana(tmpStr)) {
            kanaList.push('')
        }
    }
    var splitList = []
    splitList.push(noKanaList)
    splitList.push(kanaList)
    return splitList
}

function convertNoKana(str) {
    var spanElement = document.createElement("span")
    spanElement.innerText = str
    return spanElement
}

function convertNumber(numbers) {
    var spanElement = document.createElement("span")
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

function countKana(kanaSet, wordList) {
    var countsKana = new Object()
    for (const kana of kanaSet) {
        countsKana[kana] = 0
    }
    for (const word of wordList) {
        for (let index = 0; index < word.length; index++) {
            const char = word[index];
            countsKana[char] += 1
        }
    }
    var entries = Object.entries(countsKana)
    entries.sort((a,b)=>{return a[1] - b[1]}) // 少ない順
    var countMap = new Map()
    for (const kanaCount of entries) {
        const kana = kanaCount[0]
        const count = kanaCount[1]
        if (countMap.has(count)){
            var array = countMap.get(count)
            array.push(kana)
            countMap.set(count, array)
        }
        else {
            const array = [kana]
            countMap.set(count, array)
        }
    }
    return countMap
}

function getDuplicatedWord(wordList) {
    var sameList = []
    var uniqWordList = Array.from(new Set(wordList))
    for (const word of wordList) {
        if (uniqWordList.at(0) === word) {
            uniqWordList.shift()
            continue
        }
        sameList.push(word)
    }
    return sameList;
}