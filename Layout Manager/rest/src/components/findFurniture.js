/*
Optimum Furniture List Finder.

Author: Aayush Chowdhry
*/
var assert = require('assert');
/**
An object of the valueTable containing relevant details.
*/
class ValueTableNode{
    get item(){return this._item;}

    get value(){return this._value;}

    get isIn(){return this._isIn;}

    get backpointer(){return this._bckptr;}

    set value(val){
        assert (val>=0);
        this._value = val;
    }

    set isIn(isn){
        assert (typeof(isn)=='boolean');
        this._isIn = isn
    }

    set backpointer(bckptr){
        assert (bckptr instanceof ValueTableNode);
        this._bckptr = bckptr;
    }

    /**
    Intializes a value table node

    Parameter item: the object under consideration in this position in the
                    value table
    Precondition: item is an instance of Furniture
    */
    constructor(item){
        this._item = item
        this._value = null
        this._isIn = false
        this._bckptr = null
    }
}


/**
Returns a list of grouped furniture objects that maximizes capacity.

Parameter furnitureList: inventory of grouped furniture objects to choose
                        from.
Precondition: each object in the list has an associated area and capacity.

Parameter maxArea: the maximum area that furniture objects can cover.
Precondition: maxArea is a number greater than 0.
*/
function findBestFurnitureCombo(furnitureList, maxArea, res){
    furnitureList = furnitureList.slice();
    furnitureList.sort(function(a,b){return a.capacity - b.capacity;});
    assert (typeof(maxArea) == "number" && maxArea>0);
    var valueTable= createEmptyValueTable(furnitureList, maxArea, res);
    var maxValueNode= fillInValueTableDynamically(valueTable, res);
    return backTrace(maxValueNode);
}


/**
Helper function that returns an empty value table corressponding to the
given furniture list and maximum area specified.
*/
function createEmptyValueTable(furnitureList, maxArea, res){
    var valueTable = [];
    var object; var row; var weight;
    for (object of furnitureList){
        row = [];
        for (weight=0; weight<maxArea+1; weight+=res){
            row.push(new ValueTableNode(object));
        }
        valueTable.push(row);
    }
    return valueTable;
}


/**
Helper function to find the intDiv of two numbers
*/
function intDiv(a,b){
    var result = a/b;
    return (result>=0) ? Math.floor(result) : Math.ceil(result);
}


/**
Helper function that uses dynamic programming to fill in the values and
respective parameters of the objects in the value table node.
*/
function fillInValueTableDynamically(valueTable, res){
    var node = null; var row; var col; var weight; var prevNode; var valueOne; var valueTwo;
    for (row=0; row<valueTable.length; row++){
        for (col=0; col<valueTable[0].length; col++){
            weight = col*res;
            node = valueTable[row][intDiv(weight,res)];
            if (weight === 0){
                node.value = 0;
            } else if (node.item.area > weight){
                if (row === 0){
                    node.value = 0;
                    node.isIn = false;
                } else {
                    prevNode = valueTable[row-1][intDiv(weight,res)];
                    node.value = prevNode.value;
                    node.backpointer = prevNode;
                    node.isIn = false;
                }
            }else{
                if (row===0){
                    node.value = node.item.capacity;
                    node.isIn =  (node.value !== 0) ? true : false;
                }
                else{
                    valueOne = node.item.capacity + valueTable[row-1][intDiv((weight-node.item.area),res)].value;
                    valueTwo = valueTable[row-1][intDiv(weight,res)].value;
                    if (valueOne>valueTwo){
                        node.value = valueOne;
                        node.backpointer = valueTable[row-1][intDiv((weight-node.item.area),res)];
                        node.isIn = true;
                    } else {
                        node.value = valueTwo;
                        node.backpointer = valueTable[row-1][intDiv(weight,res)];
                        node.isIn = false;
                    }
                }
            }
        }
    }
    return node
}


/**
Helper function to backtrace the optimum furniture list from a given
ValueTableNode.
*/
function backTrace(node){
    var objectsIn = [];
    while (node != null){
        if (node.isIn){
            objectsIn.push(node.item);
        }
        node = node.backpointer;
    }
    return objectsIn;
}

export default findBestFurnitureCombo;
