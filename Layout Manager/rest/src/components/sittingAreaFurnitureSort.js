function sortSA(sa){
    var sorted = []; var rightMost = sa.coords[2]; var res = Math.min(sa.width, sa.height)/100
    var elementList = sa.furniture;
    // find leftMost topMost point
    var currentPos = [sa.coords[0], sa.coords[1]];
    var grp; var counter = 0
    // if isPointIn, push
    while (sorted.length < elementList.length && counter<10000){
        grp = findElement(currentPos, elementList);
        if (grp == null){
            if (currentPos[0]>=rightMost){
                var top = findMaxFreeAt(sa.coords[0], sorted, sa.coords[1])
                top = top === currentPos[1] ? top+res : top;
                currentPos = [sa.coords[0], top]
            } else {
                currentPos=[currentPos[0]+res, currentPos[1]];
            }
            counter++;
        } else {
            if (sorted.includes(grp)){
                currentPos=[sa.coords[0], findMaxFreeAt(sa.coords[0], sorted, sa.coords[1])];
                grp = findElement(currentPos, elementList);
                while (grp != null) {
                    currentPos = [currentPos[0], currentPos[1]+res];
                    grp=findElement(currentPos, elementList);
                }
            } else {
                sorted.push(grp);
                currentPos=[grp.coords[2], currentPos[1]];
            }
            counter = 0;
        }
    }
    if (sorted.length == elementList.length){return sorted}
    else {
        var element;
        for (element of elementList){
            if (!(sorted.includes(element))){sorted.push(element)}
        }
        return sorted;
    }
}

function findMaxFreeAt(x, elementList, minY){
    var maxTop = minY; var element; var coords;
    for (element of elementList){
        coords = element.coords;
        if (coords[0]<=x && x<coords[2]){maxTop = Math.max(maxTop, coords[3]);}
    }
    return maxTop;
}

function findElement(point, elementList){
    var element;
    for (element of elementList){
        if (isPointIn(point, element.coords)){return element;}
    } return null;
}

function isPointIn(point, coords){
    return coords[0]<=point[0] && point[0]<coords[2] && coords[1]<=point[1] && point[1]<coords[3];
}

export default sortSA;
