from db import *

########################### Get Objects #######################################
def getAllRestaurants():
    return [rest.serialize() for rest in Restaurant.query.all()]

def getRestaurantByID(restID):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    return rest.serialize()

def getReservationsByRestaurant(restID):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    return [res.serialize() for res in rest.reservations]

def getTableByID(tbID):
    tb = Table.query.filter_by(id=tbID).first()
    if tb is None:
        return None
    return tb.serialize()

def getChairByID(chrID):
    chr = Chair.query.filter_by(id=chrID).first()
    if chr is None:
        return None
    return chr.serialize()

def getGroupByID(grpID):
    grp = Group.query.filter_by(id=grpID).first()
    if grp is None:
        return None
    return grp.serialize()

def getObjectionByID(objID):
    obj = Objection.query.filter_by(id=objID).first()
    if obj is None:
        return None
    return obj.serialize()

def getSittingAreaByID(saID):
    sa = SittingArea.query.filter_by(id=saID).first()
    if sa is None:
        return None
    return sa.serialize()

########################### Add Objects #######################################
def createRestaurant(name, password, width, height, padding):
    rest = Restaurant(name, password, width, height, padding)
    db.session.add(rest)
    db.session.commit()
    return rest.serialize()

def addSittingAreaToRestaurant(restID, coords, padding, type):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    if type == "":
        type = None
    sa = SittingArea(coords[0], coords[1], coords[2], coords[3], padding, restID, type=type)
    rest.sittingAreas.append(sa)
    db.session.add(sa)
    db.session.commit()
    return sa.serialize()

def addTableToRestaurant(restID, width, height, capacity, number, type):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    ls = []
    if type == "":
        type = None
    for i in range(number):
        tb = Table(width, height, capacity, restID, type=type)
        ls.append(tb)
        rest.tables.append(tb)
        db.session.add(tb)
    db.session.commit()
    return [tab.serialize() for tab in ls]

def addChairToRestaurant(restID, width, height, number, type):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    ls = []
    if type == "":
        type = None
    for i in range(number):
        chr = Chair(width, height, restID, type=type)
        ls.append(chr)
        rest.chairs.append(chr)
        db.session.add(chr)
    db.session.commit()
    return [char.serialize() for char in ls]

def addObjectionToRestaurant(restID, coords, type):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    if type == "":
        type = None
    obj = Objection(coords[0], coords[1], coords[2], coords[3], restID, type=type)
    rest.objections.append(obj)
    db.session.add(obj)
    db.session.commit()
    return obj.serialize()

def addGroupToRestaurant(restID, tableID, chairsID, coords, padding, orientation, sitID):
    rest = Restaurant.query.filter_by(id=restID).first()
    tb = Table.query.filter_by(id=tableID).first()
    chrs=[];
    for i in chairsID:
        chrs.append(Chair.query.filter_by(id=i).first())
    if (rest is None) or (tb is None) or (None in chrs):
        return None
    if tb.group_id is not None:
        groupToDel = Group.query.filter_by(id=tb.group_id).first()
        db.session.delete(groupToDel)
    grp = Group(tb, chrs, padding, orientation, restID, sitID)
    if orientation == "vertical":
        tmp = tb.width
        tb.width = tb.height
        tb.height = tmp
    tb.group_id = grp.id
    for chair in chrs:
        chair.group_id = grp.id
    grp.topLeft = None if coords is None else [coords[0], coords[1]]
    rest.groups.append(grp)
    db.session.add(grp)
    db.session.commit()
    return grp.serialize()

def addReservationToRestaurant(restID, number, lastName, mobile, date, time, duration, grpID, grp2ID):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    res = Reservation(number, lastName, mobile, date, time, duration, restID, grpID, grp2ID)
    rest.reservations.append(res)
    db.session.add(res)
    db.session.commit()
    return res.serialize()

########################### Delete Objects #####################################
def deleteRestaurantByID(restID):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    db.session.delete(rest)
    db.session.commit()
    return rest.serialize()

def removeGroupFromRestaurant(groupID):
    grp = Group.query.filter_by(id=groupID).first()
    if grp is None:
        return None
    grp.table.x1 = None
    grp.table.y1 = None
    if grp.orientation == "vertical":
        tmp = grp.table.width
        grp.table.width = grp.table.height
        grp.table.height = tmp
    for chair in grp.chairs:
        chair.x1 = None
        chair.y1 = None
    db.session.delete(grp)
    db.session.commit()
    return grp.serialize()

def removeTableFromRestaurant(tbID):
    tb = Table.query.filter_by(id=tbID).first()
    if tb is None:
        return None
    db.session.delete(tb)
    db.session.commit()
    return tb.serialize()

def removeChairFromRestaurant(chrID):
    chr = Chair.query.filter_by(id=chrID).first()
    if chr is None:
        return None
    db.session.delete(chr)
    db.session.commit()
    return chr.serialize()

def removeSeatingAreaFromRestaurant(saID):
    sa = SittingArea.query.filter_by(id=saID).first()
    if sa is None:
        return None
    db.session.delete(sa)
    db.session.commit()
    return sa.serialize()

def removeObjectionFromRestaurant(objID):
    obj = Objection.query.filter_by(id=objID).first()
    if obj is None:
        return None
    db.session.delete(obj)
    db.session.commit()
    return obj.serialize()

def removeReservationFromRestaurant(resID):
    res = Reservation.query.filter_by(id=resID).first()
    if res is None:
        return None
    db.session.delete(res)
    db.session.commit()
    return res.serialize()

########################### Update Objects #####################################
def updateRestByID(restID, name, password, width, height, padding):
    rest = Restaurant.query.filter_by(id=restID).first()
    if rest is None:
        return None
    rest.name = name
    rest.password = password
    rest.width = width
    rest.height = height
    rest.padding = padding
    db.session.commit()
    return rest.serialize()

def updateReservationByID(resID, duration):
    res = Reservation.query.filter_by(id=resID).first()
    if res is None:
        return None
    if duration is not None:
        res.duration = duration
    db.session.commit()
    return res.serialize()

def updateObjectionByID(objID, coords):
    obj = Objection.query.filter_by(id=objID).first()
    if obj is None:
        return None
    if coords is not None:
        obj.x1 = coords[0]
        obj.y1 = coords[1]
        obj.width = coords[2]-coords[0]
        obj.height = coords[3]-coords[1]
    db.session.commit()
    return obj.serialize()

def updateSittingAreaByID(saID, coords):
    sa = SittingArea.query.filter_by(id=saID).first()
    if sa is None:
        return None
    if coords is not None:
        sa.x1 = coords[0]
        sa.y1 = coords[1]
        sa.width = coords[2]-coords[0]
        sa.height = coords[3]-coords[1]
    db.session.commit()
    return sa.serialize()

def updateGroupByID(grpID, topLeft, padding, orientation, saID):
    grp = Group.query.filter_by(id=grpID).first()
    if grp is None:
        return None
    if topLeft is not None:
        grp.topLeft = topLeft
    if padding is not None:
        grp.setPadding(padding)
    if orientation is not None:
        grp.setOrientation(orientation)
    if saID is not None:
        grp.area_id = saID
    db.session.commit()
    return grp.serialize()
