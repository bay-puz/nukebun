function getKanaSet(baseSet, kanaList) {
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

function getKanaSetFromStr(kanaStr) {
    var set = new Set()
    for (let index = 0; index < kanaStr.length; index++) {
        char = kanaStr.charAt(index)
        if(isKana(char)) {
            set.add(normalizeKana(char))
        }
    }
    return set
}

function getKanaStr(set) {
    return set.join('')
}

function transKana(kana, set) {
    var transList = []
    for (let index = 0; index < kana.length; index++) {
        char = kana.charAt(index)
        transList.push(set.indexOf(char) + 1)
    }
    return transList
}