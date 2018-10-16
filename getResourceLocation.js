const fs = require('graceful-fs');
const D2O = JSON.parse(fs.readFileSync('./D2O/Maps.json'))
const elementLooks = JSON.parse(fs.readFileSync('./resources/template.json'))

const checkIfAlreadyExist = (x, y, container) => {
    for (let index in container) {
        if (container[index].posX == x && container[index].posY == y) {
            return index
        }
    }
    return false
}

Object.keys(elementLooks).forEach((prop) => {
    if (!fs.existsSync(`./resources/${prop}`))
        fs.mkdirSync(`./resources/${prop}`)
    Object.keys(elementLooks[prop]).forEach((element) => {
        if (!fs.existsSync(`./resources/${prop}/${element}.json`))
            fs.writeFileSync(`./resources/${prop}/${element}.json`, "")
        let container = [];
        Object.values(D2O).forEach(map => {
            let mapJson;
            if (fs.existsSync(`./D2P/${map.id}.json`))
                mapJson = JSON.parse(fs.readFileSync(`./D2P/${map.id}.json`))
            else
                return
            let quant = 0
            Object.values(mapJson.midgroundLayer).forEach(cell => {
                if (Array.isArray(cell)) {
                    cell.forEach(elementOnCell => {
                        if (elementOnCell.look) {
                            if (elementOnCell.look == elementLooks[prop][element]) {
                                quant += 1
                            }
                        }
                    });
                }
            })
            let areadyExist = checkIfAlreadyExist(map.posX, map.posY, container)
            if (quant > 0) {
                if (areadyExist) {
                    container[areadyExist].q += quant
                } else {
                    container.push({
                        "posX": map.posX,
                        "posY": map.posY,
                        "q": quant,
                        "w": map.worldMap
                    })
                }
            }
        });
        fs.writeFileSync(`./resources/${prop}/${element}.json`, JSON.stringify(container))
    })
})