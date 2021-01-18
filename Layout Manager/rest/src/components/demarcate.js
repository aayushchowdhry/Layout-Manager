function demarcate(restaurant, minSide=0){
    var topMost = 0;
    var currentPos = [0,0];
    var objectionList = restaurant.objections.concat(restaurant.sittingAreas);
    var isObj; var rightMost; var bottomMost; var obj; var nw;
    while (true) {
        isObj= false;

        // find rightMost
        rightMost = findRightMost(currentPos, objectionList, restaurant.width);

        //find bottomMost
        bottomMost = findBottomMost(rightMost, currentPos, objectionList, restaurant.height);

        //ensure min
        if (rightMost-currentPos[0]<minSide){
            isObj= true;
            for (obj of objectionList){
                if (isPointIn([rightMost,currentPos[1]],obj)){
                    bottomMost=Math.min(obj.coords[3],bottomMost);
                }
            }
        } else if (bottomMost-currentPos[1]<minSide){
            isObj= true;
            for (obj of objectionList){
                if (isPointIn([currentPos[0],bottomMost],obj)){
                    rightMost=Math.min(obj.coords[2],rightMost);
                }
            }
        }

        //draw
        if (isObj){
            if (rightMost === currentPos[0] || currentPos[1] === bottomMost){break;}
            nw = {coords: [currentPos[0], currentPos[1], rightMost, bottomMost]};
        } else {
            if (rightMost <= currentPos[0] || currentPos[1] >= bottomMost){break;}
            nw = restaurant.addSittingArea("nw",currentPos[0], currentPos[1], rightMost, bottomMost);
        }
        objectionList.push(nw)


        // set top and left most
        topMost= findTopMost(objectionList, restaurant.width, restaurant.height);

        //update currentPos
        currentPos[1] = topMost;
        currentPos[0] = findMaxLeftFreeAt(currentPos[1], objectionList);
    }
}

function findTopMost(objectionList, maxWidth, maxHeight){
    var result = maxHeight;
    for (var x = 0; x<maxWidth; x++){
        result = Math.min(findMaxTopFreeAt(x,objectionList),result);
    }
    return result;
}

function findRightMost(currentPos, objectionList, maxWidth){
    var left = currentPos[0];
    var topMost = currentPos[1];
    var result= maxWidth;
    var obj; var coord;
    for (obj of objectionList){
        coord = obj.coords;
        if (coord[2]<=left){}else{
            if (coord[1]<=topMost && topMost<coord[3]){
                result = Math.min(result, coord[0]);
            }
        }
    }
    return result;
}


function findBottomMost(rightMost, currentPos, objectionList, maxHeight){
    var topMost = currentPos[1];
    var result = maxHeight;
    var obj; var coord;
    for (obj of objectionList){
        coord = obj.coords;
        if (coord[3]<=topMost){} else{
            if (currentPos[0]<coord[2] && coord[0]<rightMost){
                result = Math.min(result,coord[1]);
            }
        }
    }
    return result;
}


function findMaxTopFreeAt(x, objectionList){
    var maxTop = 0;
    var cont= true;
    var element;
    while (cont){
        cont= false;
        for (element of objectionList){
            if (isPointIn([x,maxTop],element)){
                maxTop = Math.max(maxTop, element.coords[3]);
                cont= true;
            }
        }
    }
    return maxTop;
}


function findMaxLeftFreeAt(y, objectionList){
    var maxLeft = 0;
    var cont= true;
    var element;
    while (cont){
        cont= false;
        for (element of objectionList){
            if (isPointIn([maxLeft,y],element)){
                maxLeft = Math.max(maxLeft, element.coords[2]);
                cont= true;
            }
        }
    }
    return maxLeft;
}


function isPointIn(point, element){
    var coords = element.coords;
    if (coords[0]<=point[0] && point[0]<coords[2] && coords[1]<=point[1] && point[1]<coords[3]){
        return true;
    }
    return false;
}

export default demarcate;
