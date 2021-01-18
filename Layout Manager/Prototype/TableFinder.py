def tableFinder(restaurant, number):
    number = number+1 if number%2==1 else number
    sas = restaurant.sittingAreas
    ## for each sittingArea
    for sa in sas:
        ## check each unoccupied table to fit the number
        for grp in sa.bestFurnitureList:
            ## if no adjacent table is occupied, return
            if (not grp.occupied) and (grp.capacity == number) and (not adjacentOccupied(grp, restaurant)):
                return grp

    ## if still no table is found, find tables with which adjacent occupied
    for sa in sas:
        for grp in sa.bestFurnitureList:
            if (not grp.occupied) and (grp.capacity == number):
                return grp

    ## if still no table is found, try finding table with greater capacity
    for sa in sas:
        for grp in sa.bestFurnitureList:
            if (not grp.occupied) and (grp.capacity == number+2) and (not adjacentOccupied(grp, restaurant)):
                return grp

    for sa in sas:
        for grp in sa.bestFurnitureList:
            if (not grp.occupied) and (grp.capacity == number+2):
                return grp

    ## if STILL no tables are found, try joining tables.
    return None

def adjacentOccupied(grp, restaurant):
    furList = restaurant.furniture
    p1 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[1]-grp.height/2]
    p2 = [grp.coords[2]+grp.width/2, (grp.coords[1]+grp.coords[3])/2]
    p3 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[3]+grp.height/2]
    p4 = [grp.coords[0]-grp.width/2, (grp.coords[1]+grp.coords[3])/2]
    for fur in restaurant.furniture:
        if fur.occupied:
            if isPointIn(p1, fur.coords) or isPointIn(p2, fur.coords) or isPointIn(p3, fur.coords) or isPointIn(p4, fur.coords):
                return True
    return False

def isPointIn(point, coords):
    return coords[0]<=point[0]<coords[2] and coords[1]<=point[1]<coords[3]
