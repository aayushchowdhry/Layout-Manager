"""
Optimum Furniture List Finder.

Author: Aayush Chowdhry
"""
class ValueTableNode:
    """
    An object of the valueTable containing relevant details.
    """
    @property
    def item(self):
        return self._item

    @property
    def value(self):
        return self._value

    @property
    def isIn(self):
        return self._isIn

    @property
    def backpointer(self):
        return self._bckptr

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, val):
        assert type(val)==int and val>=0
        self._value = val

    @isIn.setter
    def isIn(self, isIn):
        assert type(isIn)==bool
        self._isIn = isIn

    @backpointer.setter
    def backpointer(self, bckptr):
        assert isinstance(bckptr, ValueTableNode)
        self._bckptr = bckptr

    def __init__(self, item):
        """
        Intializes a value table node

        Parameter item: the object under consideration in this position in the
                        value table
        Precondition: item is an instance of Furniture
        """
        self._item = item
        self._value = None
        self._isIn = False
        self._bckptr = None

def findBestFurnitureCombo(furnitureList, maxArea, res = 1):
    """
    Returns a list of grouped furniture objects that maximizes capacity.

    Parameter furnitureList: inventory of grouped furniture objects to choose
                            from.
    Precondition: each object in the list has an associated area and capacity.

    Parameter maxArea: the maximum area that furniture objects can cover.
    Precondition: maxArea is a number greater than 0.
    """
    furnitureList = furnitureList.copy()
    furnitureList.sort()
    assert (type(maxArea) == int or type(maxArea) == float) and maxArea>0
    valueTable= createEmptyValueTable(furnitureList, maxArea, res)
    maxValueNode= fillInValueTableDynamically(valueTable, res)
    return backTrace(maxValueNode)

def createEmptyValueTable(furnitureList, maxArea, res):
    """
    Helper function that returns an empty value table corressponding to the
    given furniture list and maximum area specified.
    """
    valueTable = []
    for object in furnitureList:
        row = []
        for weight in range(0, int(maxArea+1), res):
            row.append(ValueTableNode(object))
        valueTable.append(row)
    return valueTable

def fillInValueTableDynamically(valueTable, res):
    """
    Helper function that uses dynamic programming to fill in the values and
    respective parameters of the objects in the value table node.
    """
    node = None
    for row in range(len(valueTable)):
        for col in range(len(valueTable[0])):
            weight = col*res
            node = valueTable[row][weight//res]
            if weight == 0:
                node.value = 0
            elif node.item.area > weight:
                if row == 0:
                    node.value = 0
                    node.isIn = False
                else:
                    prevNode = valueTable[row-1][weight//res]
                    node.value = prevNode.value
                    node.backpointer = prevNode
                    node.isIn = False
            else:
                if row==0:
                    node.value = node.item.capacity
                    node.isIn = True if node.value != 0 else False
                else:
                    valueOne = node.item.capacity + valueTable[row-1][int((weight-node.item.area)//res)].value
                    valueTwo = valueTable[row-1][weight//res].value
                    if valueOne>valueTwo:
                        node.value = valueOne
                        node.backpointer = valueTable[row-1][int((weight-node.item.area)//res)]
                        node.isIn = True
                    else:
                        node.value = valueTwo
                        node.backpointer = valueTable[row-1][weight//res]
                        node.isIn = False
    return node

def backTrace(node):
    """
    Helper function to backtrace the optimum furniture list from a given
    ValueTableNode.
    """
    objectsIn = []
    weight = 0
    while node is not None:
        if node.isIn==True:
            objectsIn.append(node.item)
            weight+= node.item.area
        node = node.backpointer
    return objectsIn
