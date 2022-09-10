document.getElementById("inputText").addEventListener("input", show)

function show() {
    const inputText = document.getElementById("inputText").value
    const splitsList = splitText(inputText)

    const noKanaList = splitsList[0]
    const kanaList = splitsList[1]

    const kanaMap = mapKanaList(kanaList)
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