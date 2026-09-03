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

function kanaToNumber(kana, kanaSet) {
    if (! kanaSet.has(kana)) {
        return -1
    }
    const kanaList = [...kanaSet]
    return kanaList.indexOf(kana) + 1
}

function numberToKana(num, kanaSet) {
    if (kanaSet.size < num) {
        return ""
    }
    const kanaList = [...kanaSet]
    return kanaList[num - 1]
}

function mergeKanaSet(baseSet, addSet) {
    for (const kana of baseSet) {
        if (!addSet.has(kana)) {
            baseSet.delete(kana)
        }
    }
    for (const kana of addSet) {
        baseSet.add(kana)
    }
    return baseSet
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

function kanaSetLength(problemList) {
    var kanaSet = new Set()
    for (const p of problemList) {
        if (typeof(p) === "number") {
            kanaSet.add(p)
        }
    }
    return kanaSet.size
}

function inputToProblem(text, kanas, isInputNumber = false) {
    var problemList = new Array()
    var baseSet = new Set()
    for (let index = 0; index < kanas.length; index++) {
        const kana = kanas.charAt(index)
        if (isKana(kana)) {
            baseSet.add(normalizeKana(kana))
        }else if (isHira(kana)) {
            baseSet.add(convertHira(kana))
        }
    }
    var charList = []
    var allKanaSet = new Set()
    for (let index = 0; index < text.length; index++) {
        const char = text.charAt(index)
        if (isKana(char)) {
            const kana = normalizeKana(char)
            charList.push(kana)
            allKanaSet.add(kana)
        } else {
            charList.push(char)
        }
    }
    var kanaSet = new Set()
    if (isInputNumber) {
        kanaSet = baseSet
    } else {
        kanaSet = mergeKanaSet(baseSet, allKanaSet)
    }
    for (const char of charList) {
        if (isKana(char)) {
            problemList.push(kanaToNumber(char, kanaSet))
        } else if(isInputNumber && Number(char)) {
            problemList.push(Number(char))
        } else {
            problemList.push(char)
        }
    }
    return [problemList, kanaSet]
}

function problemToInput(problemList, kanaSet) {
    var charList = []
    for (const char of problemList) {
        if (typeof(char) === "number") {
            charList.push(numberToKana(char, kanaSet))
        } else {
            charList.push(char)
        }
    }
    return charList.join('')
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