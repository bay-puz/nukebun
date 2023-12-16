function analytics(text, kanaSet) {
    const words = splitText(text)
    var kanaWords = []
    for (let index = 1; index < words.length; index+=2) {
        const word = words[index]
        if (word.length > 0) {
            kanaWords.push(word)
        }
    }
    const counts = countKana(kanaSet, kanaWords)

    var countElement = document.getElementById("countKana")
    countElement.innerText = ''
    for (let [count, kanaArray] of counts) {
        var element = document.createElement("div")
        element.innerText = count +  "個：" + kanaArray.join('、')
        countElement.appendChild(element)
    }

    const wordRelations  = getWordRelations(kanaWords)

    const sameList = wordRelations.same
    var sameElement = document.getElementById("sameWord")
    sameElement.innerText = (sameList.length > 0) ? sameList.join('、') : "なし"

    const sameKind = wordRelations.sameKind
    var sameKindList = new Array()
    for (const same of sameKind) {
        sameKindList.push(same.join('・'))
    }
    var sameKindElement = document.getElementById("sameKindWord")
    sameKindElement.innerText = (sameKindList.length > 0) ? sameKindList.join('、') : "なし"

    const includedMap = wordRelations.included
    var includedList = new Array()
    for (const [word, includings] of includedMap) {
        includedList.push(word + "（" + includings.join('、') + "）")
    }
    var includedElement = document.getElementById("includedWord")
    includedElement.innerText = (includedList.length > 0) ? includedList.join('、') : "なし"
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
            const kana1 = kanaListFromStr(word1)
            const kana2 = kanaListFromStr(word2)
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

function kanaListFromStr(word) {
    return Array.from(kanaSetFromStr(word)).sort()
}