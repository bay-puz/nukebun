function mapKanaList(list, set) {
    var allKanaSet = new Set()
    for(const word of list) {
        for (let index = 0; index < word.length; index++) {
            allKanaSet.add(word[index])
        }
    }
    for (const kana of set) {
        if (!allKanaSet.has(kana)) {
            set.delete(kana)
        }
    }
    for (const kana of allKanaSet) {
        if (!set.has(kana)) {
            set.add(kana)
        }
    }
    return [...set]
}

function toKanaSet(kanaStr) {
    var set = new Set()
    for (let index = 0; index < kanaStr.length; index++) {
        char = kanaStr.charAt(index)
        if(isKana(char)) {
            set.add(normalizeKana(char))
        }
    }
    return set
}

function getKanaStr(map) {
    return map.join('')
}

function transKana(kana, map) {
    var transList = []
    for (let index = 0; index < kana.length; index++) {
        char = kana.charAt(index)
        transList.push(map.indexOf(char) + 1)
    }
    return transList
}