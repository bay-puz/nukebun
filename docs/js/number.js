function mapKanaList(list, base = '') {
    var map = new Set(base)
    for(const kana of list) {
        for (let index = 0; index < kana.length; index++) {
            map.add(kana[index])
        }
    }
    return [...map]
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