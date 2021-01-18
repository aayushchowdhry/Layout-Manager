def demarcate(restaurant, minSide):
    leftMost = 0
    topMost = 0
    currentPos = [0,0]
    objectionList = restaurant.objections.copy()
    while True:
        isObj= False
        ### find rightMost
        rightMost = findRightMost(currentPos, objectionList, restaurant.width)
        ### find bottomMost
        bottomMost = findBottomMost(rightMost, currentPos, objectionList, restaurant.height)

        ### ensure min
        if rightMost-currentPos[0]<minSide:
            isObj= True
            for obj in objectionList:
                if isPointIn((rightMost,currentPos[1]),obj):
                    bottomMost=min(obj.coords[3],bottomMost)
        elif bottomMost-currentPos[1]<minSide:
            isObj= True
            for obj in objectionList:
                if isPointIn((currentPos[0],bottomMost),obj):
                    rightMost=min(obj.coords[2],rightMost)

        ## draw
        try:
            if isObj:
                new = restaurant.addObjectionToInventory(currentPos[0], currentPos[1], rightMost, bottomMost)
            else:
                new = restaurant.addSeatingArea(currentPos[0], currentPos[1], rightMost, bottomMost)
            objectionList.append(new)
        except AssertionError:
            break

        ## set top and left most
        leftMost= findLeftMost(objectionList, restaurant.width, restaurant.height)
        topMost= findTopMost(objectionList, restaurant.width, restaurant.height)

        ## update currentPos
        currentPos[1] = topMost
        currentPos[0] = findMaxLeftFreeAt(currentPos[1], objectionList)

def findTopMost(objectionList, maxWidth, maxHeight):
    result = maxHeight
    for x in range(0,int(maxWidth)):
        result = min(findMaxTopFreeAt(x,objectionList),result)
    return result

def findLeftMost(objectionList, maxWidth, maxHeight):
    result = maxWidth
    for y in range(0,int(maxHeight)):
        result = min(findMaxLeftFreeAt(y, objectionList),result)
    return result

def findRightMost(currentPos, objectionList, maxWidth):
    left = currentPos[0]
    topMost = currentPos[1]
    result= maxWidth
    for obj in objectionList:
        coord = obj.coords
        if coord[2]<=left:
            pass
        else:
            if coord[1]<=topMost<coord[3]:
                result = min(result, coord[0])
    return result


def findBottomMost(rightMost, currentPos, objectionList, maxHeight):
    topMost = currentPos[1]
    result = maxHeight
    for obj in objectionList:
        coord = obj.coords
        if coord[3]<=topMost:
            pass
        else:
            if currentPos[0]<coord[2] and coord[0]<rightMost:
                result = min(result,coord[1])
    return result


def findMaxTopFreeAt(x, objectionList):
    maxTop = 0
    cont= True
    while cont:
        cont= False
        for element in objectionList:
            if isPointIn((x,maxTop),element):
                maxTop = max(maxTop, element.coords[3])
                cont= True
    return maxTop


def findMaxLeftFreeAt(y, objectionList):
    maxLeft = 0
    cont= True
    while cont:
        cont= False
        for element in objectionList:
            if isPointIn((maxLeft,y),element):
                maxLeft = max(maxLeft, element.coords[2])
                cont= True
    return maxLeft


def isPointIn(point, element):
    coords = element.coords
    if (coords[0]<=point[0]<coords[2] and coords[1]<=point[1]<coords[3]):
        return True
    return False
