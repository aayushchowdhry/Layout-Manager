/*
Greedy Placement Algorithm.

Author: Aayush Chowdhry
*/

function place(furnitureList, seatingArea){
    var minX= seatingArea.coords[0]; var minY= seatingArea.coords[1];
    var maxX= seatingArea.coords[2]; var maxY= seatingArea.coords[3];
    var placed = [];
    var currentPos= [minX,minY]; var didPlace; var element;
    while (true){
        // for every element to be placed
        didPlace= false;
        for (element of furnitureList){
            if (!placed.includes(element)){
                // check if it can be placed
                if (canElementFit(element, currentPos, placed, maxX, maxY)){
                    // if yes, fit it and update currentPos
                    element.coords = currentPos;
                    placed.push(element);
                    currentPos[0]= element.coords[2];
                    currentPos[1]= Math.max(findMaxFreeAt(currentPos[0], placed, minY), findMaxFreeAt(currentPos[0]+element.width, placed, minY));
                    didPlace= true;
                } else {
                    // if not, switch orientation and check
                    element.switchOrientation();
                    if (canElementFit(element, currentPos, placed, maxX, maxY)){
                        // if can fit now, fit and update currentPos
                        element.coords = currentPos;
                        placed.push(element);
                        currentPos[0]= element.coords[2];
                        currentPos[1]= Math.max(findMaxFreeAt(currentPos[0], placed, minY), findMaxFreeAt(currentPos[0]+element.width, placed, minY));
                        didPlace= true;
                    }else{
                        // if not switch back orientation and check next element
                        element.switchOrientation();
                    }
                }
            }
        }
        // if no new element can be placed, move to next row
        if (!didPlace){
            // if no new element can be placed in the last row, you are done
            if (currentPos[0]=== minX || placed.length === furnitureList.length){
                return placed;
            }
            currentPos[0]= minX;
            currentPos[1]= findMaxFreeAt(currentPos[0], placed, minY);
        }
    }
}


function findMaxFreeAt(x, objectionList, minY){
    var maxTop = minY; var element; var coord;
    for (element of objectionList){
        coord = element.coords;
        if (coord[0]<=x && x<coord[2]){maxTop = Math.max(maxTop, coord[3]);}
    }
    return maxTop;
}


function canElementFit(element, currentPos, placed, maxX, maxY){
    var coords = [currentPos[0], currentPos[1], currentPos[0]+element.width, currentPos[1]+element.height];

    if (coords[2] > maxX || coords[3] > maxY){return false;}

    var objCoord; var obj;
    for (obj of placed){
        objCoord = obj.coords;
        if (isOverLapping(coords, objCoord)){return false;}
    }
    return true
}


function isOverLapping(coords1, coords2){
    if ( ((coords2[0]<=coords1[0] && coords1[0]<coords2[2]) || (coords2[0]<coords1[2] && coords1[2]<coords2[2]))
        && ((coords2[1]<=coords1[1] && coords1[1]<coords2[3]) || (coords2[1]<coords1[3] && coords1[3]<coords2[3]))
    ){return true;}

    if (((coords1[0]<=coords2[0] && coords2[0]<coords1[2]) || (coords1[0]<coords2[2] && coords2[2]<coords1[2]))
        && ((coords1[1]<=coords2[1] && coords2[1]<coords1[3]) || (coords1[1]<coords2[3] && coords2[3]<coords1[3]))
    ){return true;}

    return false;
}

export default place;

// #
// # def place(furnitureList, seatingArea):
// #     leftMost = seatingArea.coords[0]
// #     maxTop= seatingArea.coords[1]
// #     placed= []
// #     for element in furnitureList:
// #         right = leftMost+element.width
// #         topMost = max(findMaxFreeAt(leftMost, placed, maxTop),findMaxFreeAt(right, placed, maxTop))
// #         bottom=topMost+element.height
// #         if right<=seatingArea.width and bottom<=seatingArea.height:
// #             element.coords=[leftMost, topMost]
// #             placed.append(element)
// #             leftMost = right
// #         elif leftMost + element.height <= seatingArea.width:
// #             element.switchOrientation()
// #             right = leftMost+element.width
// #             topMost = max(findMaxFreeAt(leftMost, placed, maxTop),findMaxFreeAt(right, placed, maxTop))
// #             bottom=topMost+element.height
// #             if bottom<=seatingArea.height:
// #                 element.coords=[leftMost, topMost]
// #                 placed.append(element)
// #                 leftMost = right
// #         else:
// #             leftMost = 0
// #             right = leftMost+element.width
// #             topMost = max(findMaxFreeAt(leftMost, placed, maxTop),findMaxFreeAt(right, placed, maxTop))
// #             bottom = topMost+element.height
// #             if right<=seatingArea.width and bottom<=seatingArea.height:
// #                 element.coords= [leftMost, topMost]
// #                 placed.append(element)
// #                 leftMost = right
// #     return placed
// #
// # def findMaxFreeAt(x, list, maxTop):
// #     for element in list:
// #         coord = element.coords
// #         if coord[0]<=x<coord[2]:
// #             maxTop = max(maxTop, coord[3])
// #     return maxTop
//
// # def _drawTable(self, x1, y1, element):
// #     padding = element.padding
// #     x2= x1+element.width; y2= y1+element.height
// #     if element.orientation == "horizontal":
// #         self.drawing_area.create_rectangle(x1+padding,y1+padding+element.chairs[0].height,x2-padding,y2-padding-element.chairs[0].height)
// #         if element.capacity%2==0:
// #             for i in range(element.capacity//2):
// #                 x=x1+padding+(2*i+1)*1/element.capacity*(x2-padding-x1-padding)
// #                 self.drawing_area.create_rectangle(x-element.chairs[0].width/2,y1+padding,x+element.chairs[0].width/2,y1+padding+element.chairs[0].height)
// #                 self.drawing_area.create_rectangle(x-element.chairs[0].width/2,y2-padding-element.chairs[0].height,x+element.chairs[0].width/2,y2-padding)
// #     else:
// #         self.drawing_area.create_rectangle(x1+padding+element.chairs[0].height,y1+padding,x2-padding-element.chairs[0].height,y2-padding)
// #         if element.capacity%2==0:
// #             for i in range(element.capacity//2):
// #                 y=y1+padding+(2*i+1)*1/element.capacity*(y2-padding-y1-padding)
// #                 self.drawing_area.create_rectangle(x1+padding,y-element.chairs[0].width/2, x1+padding+element.chairs[0].height, y+element.chairs[0].width/2)
// #                 self.drawing_area.create_rectangle(x2-padding-element.chairs[0].height, y-element.chairs[0].width/2, x2-padding, y+element.chairs[0].width/2)
