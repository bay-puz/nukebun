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

function getKanaListFromStr(word) {
    return Array.from(getKanaSetFromStr(word)).sort()
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

function getWordRelations(wordList) {
    var sameWords = []
    var uniqWordList = Array.from(new Set(wordList))
    var index = 0
    for (const word of wordList) {
        if (uniqWordList.at(index) === word) {
            index += 1
            continue
        }
        sameWords.push(word)
    }

    var includedWords = new Map()
    var sameKindWords = []
    for (let index1 = 0; index1 < uniqWordList.length; index1++) {
        const word1 = uniqWordList[index1];
        for (let index2 = index1 + 1; index2 < uniqWordList.length; index2++) {
            const word2 = uniqWordList[index2];
            if (word1 === word2) {
                sameWords.push(word1)
                continue
            }
            const kana1 = getKanaListFromStr(word1)
            const kana2 = getKanaListFromStr(word2)
            if (kana1.toString() === kana2.toString()) {
                sameKindWords.push([word1, word2])
                continue
            }
            if (isIncluded(kana1, kana2)) {
                if (includedWords.has(word1)) {
                    var addedList = includedWords.get(word1)
                    addedList.push(word2)
                    includedWords.set(word1, addedList)
                }
                else {
                    includedWords.set(word1, [word2])
                }
                continue
            }
            if (isIncluded(kana2, kana1)) {
                if (includedWords.has(word2)) {
                    var addedList = includedWords.get(word2)
                    addedList.push(word1)
                    includedWords.set(word2, addedList)
                }
                else {
                    includedWords.set(word2, [word1])
                }
                continue
            }
        }
    }
    return {"same": sameWords, "sameKind": sameKindWords, "included": includedWords}
}