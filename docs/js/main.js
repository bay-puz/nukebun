document.getElementById("inputText").addEventListener("input", show)
document.getElementById("kanaMap").addEventListener("change", show)

function show() {
    const inputText = document.getElementById("inputText").value
    const splitsList = splitText(inputText)

    const noKanaList = splitsList[0]
    const kanaList = splitsList[1]

    var mapElement = document.getElementById("kanaMap")
    inputKanaSet = toKanaSet(mapElement.value)

    const kanaMap = mapKanaList(kanaList, inputKanaSet)
    mapElement.value = getKanaStr(kanaMap)
    mapElement.size = kanaMap.length * 2 + 10

    var numberList = []
    for (const kana of kanaList) {
        numberList.push(transKana(kana, kanaMap))
    }

    var displayElement =  document.getElementById("display")
    displayElement.innerText = ''
    for (let index = 0; index < kanaList.length; index++) {
        displayElement.appendChild(convertNoKana(noKanaList[index]))
        displayElement.appendChild(convertNumber(numberList[index]))
    }
}