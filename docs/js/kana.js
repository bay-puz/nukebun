function isKana(char) {
    if (char.charAt(0) === "ー") {
        return true
    }
    return ('ァ'.codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= 'ヺ'.codePointAt(0))
}

function isHira(char) {
    return ('ぁ'.codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= 'ゖ'.codePointAt(0))
}

function convertHira(char) {
    const code = char.codePointAt(0)
    const kata = String.fromCodePoint(code + 96)
    return normalizeKana(kata)
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

function isNewLine(char) {
    return char === "\n"
}

function isKutoten(char) {
    return (char === "、" || char === "。")
}

function splitText(text) {
    var charList = []
    for (let index = 0; index < text.length; index++) {
        charList.push(normalizeKana(text.charAt(index)))
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

function getKatakana(string) {
    for (let index = 0; index < string.length; index++) {
        const char = string.substring(index, index + 1);
        if (isHira(char)) {
            return convertHira(char)
        }
        if (isKana(char)) {
            return normalizeKana(char)
        }
    }
    return ""
}