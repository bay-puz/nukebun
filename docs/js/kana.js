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

function getNewLine() {
    return "\n"
}

function isNewLine(char) {
    return char === getNewLine()
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

function inputToProblem(text, kanas) {
    var noKanaWords = []
    var kanaWords = []
    var split = splitText(text)
    for (let index = 0; index < split.length; index+=2) {
        noKanaWords.push(split[index])
        kanaWords.push(split[index + 1])
    }
    noKanaWords.push(getNewLine())

    const inputKanaSet = kanaSetFromStr(kanas)
    const kanaSet = mergeKanaSet(inputKanaSet, kanaWords)

    var numberList = []
    for (const word of kanaWords) {
        numberList.push(getNumberList(word, kanaSet))
    }

    var problemList = []
    for (let index = 0; index < numberList.length; index++) {
        var noKana = noKanaWords[index]
        for (let charIndex = 0; charIndex < noKana.length; charIndex++) {
            problemList.push(noKana[charIndex])
        }
        var number = numberList[index]
        for (let numberIndex = 0; numberIndex < number.length; numberIndex++) {
            problemList.push(number[numberIndex])
        }
    }
    return [problemList, kanaSet]
}

function encodeNumber(num) {
    const converter = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY"
    return 'z' + converter.charAt(num)
}

function decodeNumber(char) {
    const converter = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY"
    return converter.indexOf(char)
}

function encodeChar(char) {
    return char.codePointAt(0).toString(16).padStart(4, '0')
}

function decodeChar(str) {
    return String.fromCodePoint(Number.parseInt(str, 16))
}

function encodeKana(kana) {
    const codePoint = kana.codePointAt(0) - 'ァ'.codePointAt(0)
    return codePoint.toString(16).padStart(2, '0')
}

function decodeKana(str) {
    const codePoint = Number.parseInt(str, 16) + 'ァ'.codePointAt(0)
    return String.fromCodePoint(codePoint)
}

function problemToCode(problemList) {
    var codeList = []
    for (const p of problemList) {
        if (typeof(p) === "number") {
            codeList.push(encodeNumber(p))
        } else {
            codeList.push(encodeChar(p))
        }
    }
    return codeList.join('')
}

function kanaToCode(kanaSet) {
    codeList = []
    for (const kana of kanaSet) {
        codeList.push(encodeKana(kana))
    }
    return codeList.join('')
}

function codeToProblem(code) {
    var problem = []
    for (let index = 0; index < code.length;) {
        const head = code.substring(index, index + 1)
        if (head === 'z') {
            const char = code.substring(index + 1, index + 2)
            problem.push(decodeNumber(char))
            index += 2
            continue
        }
        var str = code.substring(index, index + 4)
        problem.push(decodeChar(str))
        index += 4
    }
    return problem
}

function codeToKana(code) {
    var kanaSet = new Set()
    for (let index = 0; index < code.length; index += 2) {
        const str = code.substring(index, index + 2)
        kanaSet.add(decodeKana(str))
    }
    return kanaSet
}