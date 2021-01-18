/*
Best Table Finder.

Author: Aayush Chowdhry
*/
import sortSA from './sittingAreaFurnitureSort.js'
const assert = require('assert');
/**
Returns a suggested table for the number of people specified in a given restaurant.

Parameter restaurant: given restaurant
Precondition: restaurant must be an instance of Restaurant

Parameter number: the number of people the table is wanted for
Precondition: number is a number greater than 0.
*/
function findTable(restaurant, number, dontUse){
    assert (number > 0);
    number = number%2===1 ? number+1 : number;
    var sas = restaurant.sittingAreas; var sa; var grp; var group; var grps;
    // for each sittingArea
    for (sa of sas){
        sa.furniture = sortSA(sa);
        // check each unoccupied table to fit the number
        for (grp of sa.furniture){
            // if no adjacent table is occupied, return
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied) && (grp.capacity === number) && !(adjacentOccupied(grp, restaurant))){return [grp];}
        }
    }

    // if still no table is found, find tables with which adjacent occupied
    for (sa of sas){
        for (grp of sa.furniture){
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied) && (grp.capacity === number)){return [grp];}
        }
    }

    // if still no table is found, try finding table with greater capacity
    for (sa of sas){
        for (grp of sa.furniture){
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied) && (grp.capacity === number+2) && !(adjacentOccupied(grp, restaurant))){return [grp];}
        }
    }

    for (sa of sas){
        for (grp of sa.furniture){
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied) && (grp.capacity === number+2)){return [grp];}
        }
    }
    // if STILL no tables are found, try joining tables.
    for (sa of sas){
        for (grp of sa.furniture){
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied)){
                grps = getAdjacentFree(grp, restaurant, dontUse)
                for (group of grps){
                    if (grp.capacity+group.capacity===number){return [grp, group];}
                }
            }
        }
    }

    for (sa of sas){
        for (grp of sa.furniture){
            if (!(dontUse.includes(grp)) && !(grp.occupied.occupied)){
                grps = getAdjacentFree(grp, restaurant, dontUse)
                for (group of grps){
                    if (grp.capacity+group.capacity===number+2){return [grp, group];}
                }
            }
        }
    }
    return null;
}

/**
Helper
*/
function adjacentOccupied(grp, restaurant){
    var furList = restaurant.groups; var fur;
    var p1 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[1]-grp.height/2];
    var p2 = [grp.coords[2]+grp.width/2, (grp.coords[1]+grp.coords[3])/2];
    var p3 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[3]+grp.height/2];
    var p4 = [grp.coords[0]-grp.width/2, (grp.coords[1]+grp.coords[3])/2];
    for (fur of furList){
        if (fur.coords != null && fur.occupied.occupied){
            if (isPointIn(p1, fur.coords) || isPointIn(p2, fur.coords) || isPointIn(p3, fur.coords) || isPointIn(p4, fur.coords)){return true;}
        }
    }
    return false;
}

/**
Helper
*/
function getAdjacentFree(grp, restaurant, dontUse){
    var furList = restaurant.groups; var fur; var res = [];
    var p1 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[1]-grp.height/2];
    var p2 = [grp.coords[2]+grp.width/2, (grp.coords[1]+grp.coords[3])/2];
    var p3 = [(grp.coords[0]+grp.coords[2])/2, grp.coords[3]+grp.height/2];
    var p4 = [grp.coords[0]-grp.width/2, (grp.coords[1]+grp.coords[3])/2];
    for (fur of furList){
        if ((fur.coords != null) && !(fur.occupied.occupied) && !(dontUse.includes(grp))){
            if (isPointIn(p1, fur.coords) || isPointIn(p2, fur.coords) || isPointIn(p3, fur.coords) || isPointIn(p4, fur.coords)){
                if (fur.sittingArea === grp.sittingArea){res.push(fur);}
            }
        }
    }
    return res;
}

/**
Helper
*/
function isPointIn(point, coords){
    return coords[0]<=point[0] && point[0]<coords[2] && coords[1]<=point[1] && point[1]<coords[3];
}

export default findTable;
