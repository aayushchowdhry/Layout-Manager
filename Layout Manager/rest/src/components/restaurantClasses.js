/*
Restaurant and related classes.

Author: Aayush Chowdhry
*/
import findBestFurnitureCombo from './findFurniture.js'
import place from './placement.js'
import demarcate from './demarcate.js'
import findTable from './findTable.js'
const assert = require('assert');
// ########################### Main Restaurant Class ########################

/**
An instance of a Restaurant. Contains input details such as furniture
inventory etc.
*/
export default class Restaurant{
    get id(){return this._id;}

    get name(){return this._name;}

    get password(){return this._password;}

    get width(){return this._width;}

    get height(){return this._height;}

    get area(){return this._width * this._height;}

    get padding(){return this._padding;}

    get groups(){return this._groups;}

    get chairs(){return this._chairs}

    get tables(){return this._tables}

    get objections(){return this._objections;}

    get reservations(){return this._reservations;}

    get sittingAreas(){return this._sittingAreas;}

    get nextGroupID(){return this._nextGroupID;}

    set reservations(rss){this._reservations = rss;}

    set groups(grp){this._groups = grp;}

    set objections(obj){this._objections = obj;}

    set sittingAreas(sa){this._sittingAreas = sa;}

    set id(id){this._id = id;}

    set name(name){this._name = name;}

    set password(password){this._password = password;}

    set width(width){this._width = width;}

    set height(height){this._height = height;}

    set padding(padding){
        assert (typeof(padding) == "number" && padding>0);
        this._padding = padding;
    }

    getObjectionByID(id){
        var objection;
        for (objection of this._objections){
            if (objection.id == id){return objection;}
        }
        return null;
    }

    getSittingAreaByID(id){
        var sa;
        for (sa of this._sittingAreas){
            if (sa.id == id){return sa;}
        }
        return null;
    }

    getGroupByID(id){
        var grp;
        for (grp of this._groups){
            if (grp.id == id){return grp;}
        }
        return null;
    }

    /**
    Initializes an instance of a Restaurant.

    Parameter width: the width of the Restaurant.
    Precondition: width is a number > 0

    Parameter height: the height of the Restaurant.
    Precondition: height is a number > 0

    Parameter padding: the average padding around tables in this restaurant.
    Precondition: padding is a number greater than 0
    */
    constructor (id, name, password, width, height, padding){
        assert (typeof(width) == "number" && width>0)
        assert (typeof(height) == "number"  && height>0)
        this._name = name
        this._password = password
        this._id = id
        this._width = width
        this._height = height
        this._padding = padding
        this._groups = []
        this._tables = []
        this._chairs = []
        this._objections = []
        this._sittingAreas = []
        this._reservations = []
        this._nextSittingAreaID = 0
        this._nextGroupID = 0
    }

    /**
    Adds a table of the given specifications to the inventory.

    Parameter width: the width of the table.
    Precondition: width is a number > 0

    Parameter height: the height of the table.
    Precondition: height is a number > 0

    Parameter capacity: the number of people this table seats
    Precondition: capacity is a number; usually even

    Optional Parameter type: the specific type of this table
    */
    addTableToInventory(id, width, height, capacity, type=null){
        assert (width>0 && height>0 && capacity>=0);
        var tb= new Table(id, width, height, capacity, type);
        this._tables.push(tb);
        this._tables.sort(function(a,b){return b.capacity - a.capacity;});
        //this.updateGroupedFurniture();
        return tb;
    }

    /**
    Adds a chair of the given specifications to the inventory.

    Parameter width: the width of the chair.
    Precondition: width is a number > 0

    Parameter height: the height of the chair.
    Precondition: height is a number > 0:

    Optional Parameter type: the specific type of this chair
    */
    addChairToInventory(id, width, height, type=null){
        assert (width>0 && height>0);
        var chair= new Chair(id, width, height, type);
        this._chairs.push(chair);
        //this.updateGroupedFurniture();
        return chair;
    }


    /**
    Adds an objection to seating i.e. an area where tables and chairs can't
    be placed of the given specifications to the inventory.

    Parameter x1: the left most x-coordinate of this objection.
    Precondition: x1 is a number

    Parameter y1: the top most y-coordinate of this objection.
    Precondition: y1 is a number

    Parameter x2: the right most x-coordinate of this objection.
    Precondition: x2 is a number

    Parameter y2: the bottom most y-coordinate of this objection.
    Precondition: y2 is a number
    */
    addObjectionToInventory(id, x1, y1, x2, y2){
        if (id === "O"){
            id = 0; var objection;
            for (objection of this._objections){
                id = Math.max(id, objection.id);
            }
            id++;
        }
        var obj= new Objection(id,x1,y1,x2,y2);
        this._objections.push(obj);
        return obj;
    }

    /**
    Adds a group of table and chairs to the restaurant.
    */
    addGroupToInventory(id, tbID, chrIDs, padding, orientation, saID=null){
        assert (typeof(id) == "number");
        var tb; var chr; var table; var chairs = []; var sa; var grp;
        this._nextGroupID = Math.max(this._nextGroupID,id);
        this._nextGroupID++;
        for (tb of this._tables){
            if (tb.id === tbID){table = tb; break;}
        }
        for (chr of this._chairs){
            if (chrIDs.includes(chr.id)){chairs.push(chr);}
        }
        grp = new Group(id, table, chairs, padding, orientation, saID)
        this._groups.push(grp);
        if (saID !== null){
            for (sa of this._sittingAreas){
                //console.log(sa.id, saID)
                if (sa.id === saID){sa._furniture.push(grp); break;}
            }
        }
        return grp;
    }


    /**
    Adds a reservation to the restaurant.
    */
    addReservation(id, number, lastName, mobileNumber, date, time, duration, grpID, grp2ID){
        var res = new Reservation(id, number, lastName, mobileNumber, date, time, duration, [grpID, grp2ID], this.id);
        var today = new Date(); var dateObj;
        var date= date.split("-")
        var time= time.split(":")
        var dateObj = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]), Number(time[0]), Number(time[1]));
        if (today.getFullYear() === dateObj.getFullYear() && today.getMonth() === dateObj.getMonth() && today.getDate() === dateObj.getDate()){
            var resMins = dateObj.getHours()*60+dateObj.getMinutes();
            var todayMins = today.getHours()*60+today.getMinutes();
            if (resMins<=todayMins && todayMins<resMins+duration){
                if (this.getGroupByID(grpID) != null){
                    this.getGroupByID(grpID).occupied = {occupied:true, reservation: res};
                }
                if (this.getGroupByID(grp2ID) != null){
                    this.getGroupByID(grp2ID).occupied = {occupied:true, reservation: res};
                }
            }
        }
        this._reservations.push(res)
        return res;
    }

    /**
    Finds the suggested table for the given number of people
    */
    getTableFor(number){
        assert (number>0);
        var today = new Date();
        var mins = today.getHours()*60+today.getMinutes();
        var resList = []; var res; var resMins;
        for (res of this._reservations){
            resMins = Number(res.time.substring(0,2))*60+Number(res.time.substring(3,5));
            if (resMins>mins && mins+90>resMins){resList.push(res);}
        }
        var dontUse = []; var grps; var grp;
        for (res of resList){
            grps = findTable(this, res.number, dontUse);
            for (grp of grps){
                dontUse.push(grp)
            }
        }
        var table=findTable(this, number, dontUse);
        return table;
    }


    /**
    Adds a seating area of the given specifications to the restaurant.

    Parameter x1: the left most x-coordinate of this seating area.
    Precondition: x1 is a number

    Parameter y1: the top most y-coordinate of this seating area.
    Precondition: y1 is a number

    Parameter x2: the right most x-coordinate of this seating area.
    Precondition: x2 is a number

    Parameter y2: the bottom most y-coordinate of this seating area.
    Precondition: y2 is a number

    Optional Parameter type: the specific type of this seating area.
    */
    addSittingArea(id, x1, y1, x2, y2, type=null){
        if (id === "nw"){
            id = this._nextSittingAreaID;
            this._nextSittingAreaID++;
        } else {
            this._nextSittingAreaID = Math.max(this._nextSittingAreaID,id);
            this._nextSittingAreaID++;
        }
        var st= new SittingArea(id, x1, y1, x2, y2, this._padding, type);
        this._sittingAreas.push(st);
        this._sittingAreas.sort(function(a,b){return a.area - b.area;});
        return st;
    }


    /**
    Demarcates the restaurant into sitting areas i.e. areas where tables and
    chairs can be accomodated.
    */
    setSittingAreas(){
        if (this._groups.length !== 0){
            var minSide= Infinity; var element;
            for (element of this._groups){minSide= Math.min(element.width, element.height, minSide)};
            demarcate(this, minSide);
        } else {demarcate(this);}
        var sa;
        for (sa of this._sittingAreas){
            this._nextSittingAreaID = Math.max(sa.id, this._nextSittingAreaID)
        }
    }


    /**
    Finds and sets the an optimized layout for this restaurant.

    Optional Parameter res: the resolution with which the layout is
                        optimized. The higher this number, the less accurate
                        and quicker the optimization and visa-versa.
    Precondition: res is a number greater than 0
    */
    setLayout(res=1){
        this.updateGroupedFurniture();
        assert (res>0);
        var usedGroups = []; var i;
        for (i=0; i<this._sittingAreas.length; i++){
            this._sittingAreas[i].placeFurniture(this._groups, usedGroups, res);
            console.log((i+1)+"/"+(this._sittingAreas.length)+" Done");
        }
        console.log(usedGroups.length + "/" + this._groups.length+" Placed");
        return usedGroups;
    }


    /**
    Helper method.
    */
    updateGroupedFurniture(){
        this._groups = []; var used = []; var table; var chairs; var chair;
        for (table of this._tables){table.coords=null;}
        for (chair of this._chairs){chair.coords=null;}
        for (table of this._tables){
            chairs = this.findChairs(table, used);
            this._groups.push(new Group(this._nextGroupID, table, chairs, this._padding));
            this._nextGroupID++;
        }
    }


    /**
    Helper method.
    */
    findChairs(table, used){
        var chairList = []; var i=0; var chair;
        while (chairList.length<table.capacity && i<this._chairs.length){
            chair = this._chairs[i];
            if (chairList.length === 0){
                if ((!used.includes(chair)) && (chair.type === table.type) && (chair.width*table.capacity/2<table.width)){
                    chairList.push(chair);
                    used.push(chair);
                }
            } else {
                if ((!used.includes(chair)) && (chair.type === table.type) && (chair.isSame(chairList[0]))){
                    chairList.push(chair);
                    used.push(chair);
                }
            }
            i+=1;
        }
        return chairList;
    }
}

// ############################# SittingArea Class ##############################

class SittingArea{
    get id(){return this._id;}

    get area(){return this._width * this._height;}

    get width(){return this._width;}

    get height(){return this._height;}

    get furniture(){return this._furniture;}

    get padding(){return this._padding;}

    get coords(){return this._coords;}

    set coords(topLeft){
        assert (topLeft == null || topLeft.length === 2);
        if (topLeft == null) {this._coords = null} else{
        this._coords = [topLeft[0], topLeft[1], topLeft[0]+this._width, topLeft[1]+this._height];}
    }

    set furniture(fur){
        var item; var didFind; var elem;
        for (item of this._furniture){
            didFind = false;
            for (elem of fur){
                if (item.id === elem.id){didFind=true; break;};
            }
            if (!didFind){item.sittingArea = null;}
        };
        this._furniture = fur;
    }

    set id(id){
        this._id = id; var fur;
        for (fur of this._furniture){
            fur.sittingArea = id;
        }
    }

    set padding(padding){
        assert (typeof(padding) == "number" && padding>0);
        this._padding = padding;
        var item;
        for (item of this._furniture){item.padding = padding;}
    }


    /**
    Initializes a seating area.

    Parameter x1: the left most x-coordinate of this seating area.
    Precondition: x1 is a number

    Parameter y1: the top most y-coordinate of this seating area.
    Precondition: y1 is a number

    Parameter x2: the right most x-coordinate of this seating area.
    Precondition: x2 is a number

    Parameter y2: the bottom most y-coordinate of this seating area.
    Precondition: y2 is a number

    Parameter padding: the average padding around tables in this area.
    Precondition: padding is a number greater than 0

    Optional Parameter type: the specific type of this seating area.
    */
    constructor(id, x1, y1, x2, y2, padding, type=null){
        this._id = id;
        this._width = x2-x1;
        this._height = y2-y1;
        assert (this._width>0 && this._height>0);
        this._coords = [x1, y1, x2, y2];
        this._padding = padding;
        this._furniture = [];
        this._type= type;
    }


    /**
    Finds the best possible furniture combination for this seating area and
    greedily places it.

    Parameter furnitureList: the list of furniture items in the inventory.
    Precondition: furnitureList is a list of GroupedFurniture objects

    Parameter usedFurniture: the list of furniture items in furnitureList
                            that have been used by other seating areas.
    Precondition: usedFurniture is a list of GroupedFurniture objects

    Optional Parameter res: the resolution with which the layout is
                        optimized. The higher this number, the less accurate
                        and quicker the optimization and visa-versa.
    Precondition: res is a number greater than 0
    */
    placeFurniture(furnitureList, usedFurniture, res=null){
        if (res===null){
            res = Math.min(this.width, this.height)/100
        }

        // store original padding and find the minimum padding one can go down to fit objects
        const ogPadding = this._padding; const minPadding = 3*ogPadding/4;

        // find list of available furniture
        var list=[]; var element;
        for (element of furnitureList){
            if (!usedFurniture.includes(element)){list.push(element);}
        }

        //find best possible furniture combo for this area
        var best = findBestFurnitureCombo(list, this.area, res);

        // place it
        var result = place(best, this);

        //if everything isn't placed, reduce padding till minimum allowed padding and try again
        var lenList = [result.length];
        while (result.length<best.length && this._padding>minPadding){
            this._padding -= this._padding/10
            this.reorient(best, this._padding);
            result = place(best, this);
            lenList.push(result.length);
            // if no more can be placed for a while stop trying
            if (lenList.length>=10 && lenList[lenList.length-1] === lenList[lenList.length-10]){break;}
        }

        // if everything is placed, space it out as much as you can
        if (result.length !== 0){
            var currentPadding = this._padding
            this._padding += this._padding/10
            this.reorient(best, this._padding);
            var nextResult = place(best, this);
            while (nextResult.length>=result.length){
                result= nextResult;
                currentPadding = this._padding;
                this._padding += this._padding/10;
                this.reorient(best, this._padding);
                nextResult = place(best, this);
            }
            this._padding= currentPadding;
            this.reorient(best, this._padding);
            result= place(best, this);
        }

        // reset padding and orientation for objects finally used but were in the best possible list
        var unused = []; var item;
        for (item of best){if (!result.includes(item)){unused.push(item);}}
        this.reorient(unused, ogPadding);

        // set bestFurnitureList to the placed list and update usedFurniture
        this._furniture = result;
        var fur;
        for (fur of this._furniture){usedFurniture.push(fur); fur.sittingArea = this._id}
    }


    /**
    Helper method.
    */
    reorient(elementList, padding, primaryOrientation="horizontal"){
        var element;
        for (element of elementList){
            element.padding = padding;
            element.orientation = primaryOrientation;
        }
    }
}


// ############################ Furniture Classes ###############################

/**
An instance of a furniture object. To be used as an abstract class.
*/
class Furniture{

    get id(){return this._id;}

    get width(){return this._width;}

    get height(){return this._height;}

    get area(){return this._width * this._height;}

    get coords(){return this._coords;}

    get type(){return this._type;}

    set id(id){this._id = id;}

    set width(wdth){
        assert (wdth>0);
        this._width= wdth;
    }

    set height(hght){
        assert (hght>0)
        this._height= hght
    }

    set coords(topLeft){
        assert (topLeft == null || topLeft.length === 2);
        if (topLeft == null || topLeft.includes(null)) {this._coords = null} else{
        this._coords = [topLeft[0], topLeft[1], topLeft[0]+this._width, topLeft[1]+this._height];}
    }

    /**
    Initializes a furniture object.

    Parameter width: the width of the furniture object.
    Precondition: width is a number > 0

    Parameter height: the height of the furniture object.
    Precondition: height is a number > 0
    */
    constructor(id, width, height, type=null){
        this.width = width;
        this.height = height;
        this._coords = null;
        this._type = type;
        this._id = id;
    }
}

/**
An instance of a Table.
*/
class Table extends Furniture{

    get capacity(){return this._capacity;}

    isSame(table){
        if (table instanceof Table){
            var isEqDim = (table.width === this.width && table.height === this.height) || (table.width === this.height && table.height === this.width);
            return  isEqDim && table.capacity === this.capacity && table.type == this.type;
        } return false;
    }


    /**
    Initializes a table.

    Parameter width: the width of the table.
    Precondition: width is a number > 0

    Parameter height: the height of the table.
    Precondition: height is a number > 0

    Parameter capacity: the number of people this table seats
    Precondition: capacity is a number; usually even

    Parameter id: the unique identifier of the table

    Optional Parameter type: the specific type of this table
    */
    constructor(id, width, height, capacity, type=null){
        super(id, width, height, type);
        this._capacity = capacity
    }
}

/**
An instance of a chair.
*/
class Chair extends Furniture{

    isSame(chair){
        if (chair instanceof Chair){
            return chair.width === this.width && chair.height === chair.height && chair.type === chair.type;
        } return false;
    }

    /**
    Parameter width: the width of the chair.
    Precondition: width is a number > 0

    Parameter height: the height of the chair.
    Precondition: height is a number > 0

    Optional Parameter type: the specific type of this chair.
    */
    constructor(id, width, height, type=null){
        super(id, width, height, type);
    }
}

class Objection extends Furniture{

    /**
    Initializes a objection to seating i.e. an area that cannot accomodate
    tables and chairs.

    Parameter x1: the left most x-coordinate of this objection.
    Precondition: x1 is a number

    Parameter y1: the top most y-coordinate of this objection.
    Precondition: y1 is a number

    Parameter x2: the right most x-coordinate of this objection.
    Precondition: x2 is a number

    Parameter y2: the bottom most y-coordinate of this objection.
    Precondition: y2 is a number
    */
    constructor(id, x1, y1, x2, y2, type = "objection"){
        var tmp;
        if (x2<x1){tmp=x1; x1=x2; x2=tmp;} if (y2<y1){tmp=y1; y1=y2; y2=tmp;}
        var width = x2-x1;
        var height = y2-y1;
        super(id, width, height, type);
        this.coords = [x1, y1];
    }
}


/**
An instance of a table-chair set with padding.
*/
class Group{
    get width(){return this._width;}

    get height(){return this._height;}

    get area(){return this._width * this._height;}

    get coords(){return this._coords;}

    get type(){return this._type;}

    get id(){return this._id;}

    get capacity(){return this._capacity;}

    get padding(){return this._padding;}

    get chairs(){return this._chairs;}

    get table(){return this._table;}

    get orientation(){return this._orientation;}

    get sittingArea(){return this._sittingArea;}

    get occupied(){return this._occupied;}

    set occupied(ocp){this._occupied = ocp;}

    set id(id){this._id = id;}

    set sittingArea(sa){this._sittingArea = sa;}

    set coords(topLeft){
        assert (topLeft == null || topLeft.length === 2);

        if (topLeft==null || topLeft.includes(null)){
            var chr;
            this._coords=null;
            this._table.coords=null;
            for (chr of this._chairs){chr.coords=null;}
            return;
        }

        // set coordinates of this object
        this._coords = [topLeft[0], topLeft[1], topLeft[0]+this._width, topLeft[1]+this._height];

        var chairHeight = this._chairs.length !== 0 ? this._chairs[0].height : 0;

        // set coordinates of children
        var i;
        if (this._orientation === "vertical"){
            // set coordinates of the table in this object
            this._table.coords = [topLeft[0]+this._padding+chairHeight, topLeft[1]+this._padding];
            // set coordinates of the chairs
            var y;
            for (i=0; i<this._chairs.length; i+=2){
                y= this._table.coords[1]+(i+1)*this._table.height/this._chairs.length;
                this._chairs[i].coords = [this._coords[0]+this._padding, y-this._chairs[i].width/2];
                this._chairs[i+1].coords = [this._table.coords[2], y-this._chairs[i+1].width/2];
            }
        }else{
            // set coordinates of the table in this object
            this._table.coords = [topLeft[0]+this._padding, topLeft[1]+this._padding+chairHeight];
            // set coordinates of the chairs
            var x;
            for (i = 0; i<this._chairs.length; i+=2){
                x= this._table.coords[0]+(i+1)*this._table.width/this._chairs.length;
                this._chairs[i].coords = [x-this._chairs[i].width/2,this._coords[1]+this._padding];
                this._chairs[i+1].coords = [x-this._chairs[i+1].width/2,this._table.coords[3]];
            }
        }
    }

    set orientation(orient){
        assert (orient === "vertical" || orient === "horizontal")
        if (this._orientation !== orient){
            // change orientation of this object
            this._orientation = orient
            var tmp = this._width;
            this._width = this._height;
            this._height = tmp;
            // change that of the table
            tmp= this._table.width;
            this._table.width= this._table.height;
            this._table.height= tmp;
            // change coordinates if necessary
            if (this._coords != null){this.coords = [this._coords[0], this._coords[1]];}
        }
    }

    set padding(pad){
        assert (typeof(pad) == "number" && pad>0);
        // adjust width of the object
        var prevPadding = this._padding;
        this._padding = pad;
        this._width += 2*(pad-prevPadding);
        this._height += 2*(pad-prevPadding);
        // adjust coordinates if required
        if (this._coords != null){this.coords = [this._coords[0], this._coords[1]]}
    }


    /**
    Initializes a grouped furniture object.

    Parameter table: the table of this grouped furniture object.
    Precondition: table is an instance of Table

    Parameter chairs: the chairs surrounding the table in this grouped
                    furniture object.
    Precondition: chairs is a list of Chair objects

    Optional Parameter padding: the padding around the grouped table and
                            chairs.
    Precondition: padding is a number > 0

    Optional Parameter orientation: the orientation this object must be
                                set to.
    Precondition: orientation is either "vertical" or "horizontal"
    */
    constructor(id, table, chairs, padding=1, orientation="horizontal", sittingArea=null){
        assert (table instanceof Table && padding>0);
        assert (orientation === "vertical" || orientation === "horizontal");
        this._table = table;
        this._chairs = chairs;
        this._id = id;
        this._capacity = this._chairs.length;
        this._padding = padding;
        this._orientation = orientation;
        this._type = table._type;
        this._sittingArea = sittingArea;
        this._occupied = {occupied: false, reservation: null}
        if (this._capacity === 0){
            this._width = this._table.width+2*padding;
            this._height = this._table.height+2*padding;
        } else {
            if (orientation === "horizontal"){
                this._width = this._table.width+2*padding;
                this._height = this._table.height+2*(this._chairs[0].height+padding);
            } else {
                this._width = this._table.width+2*(this._chairs[0].height+padding)
                this._height = this._table.height+2*padding
            }
        }
    }

    /**
    Switches the orientation of the current object.
    */
    switchOrientation(){
        this.orientation = (this._orientation === "vertical") ? "horizontal" : "vertical";
    }
}


/**
An instance of a reservation.
*/
class Reservation{

    get id(){return this._id;}

    get number(){return this._number;}

    get lastName(){return this._lastName;}

    get mobileNumber(){return this._mobileNumber;}

    get date(){return this._date;}

    get time(){return this._time;}

    get duration(){return this._duration;}

    get grp(){return this._grp;}

    get rest(){return this._rest;}

    set duration(dur){
        assert (dur >= 0);
        this._duration = dur;
    }

    set rest(restID){this._rest = restID;}

    set grp(grpID){this._grp = grpID;}

    set time(t){this._time = t;}

    set date(dt){this._date = dt;}

    set mobileNumber(mn){
        assert (mn>=1000000000 && mn<= 9999999999);
        this._mobileNumber = mn;
    }

    set lastName(ln){this._lastName = ln;}

    set number(no){
        assert (no>0);
        this._number = no;
    }

    set id(id){this._id = id;}


    /**
    Initializes a reservation.
    */
    constructor(id, number, lastName, mobileNumber, date, time, duration, grpID, restID){
        assert (number>0 && 9999999999>=mobileNumber && mobileNumber>=1000000000)
        this._id = id;
        this._number = number;
        this._lastName= lastName;
        this._mobileNumber= mobileNumber;
        this._date= date;
        this._time= time;
        this._duration= duration;
        this._grp = grpID;
        this._rest = restID
    }
}

export {
    Group,
    SittingArea,
    Objection,
    Table,
    Chair,
    Reservation
}
