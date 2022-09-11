function mapKanaList(list, set) {
    for(const kana of list) {
        for (let index = 0; index < kana.length; index++) {
            set.add(kana[index])
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