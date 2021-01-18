from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Restaurant(db.Model):
    """
    An instance of a Restaurant. Contains input details such as furniture
    inventory etc.
    """
    __tablename__ = "restaurant"
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column("name", db.String, nullable=False)
    password = db.Column("password", db.String, nullable=False)
    width = db.Column("width", db.Float, nullable=False)
    height = db.Column("height", db.Float, nullable=False)
    padding = db.Column("padding", db.Float, nullable=False)
    tables = db.relationship("Table", cascade="delete")
    chairs = db.relationship("Chair", cascade="delete")
    objections = db.relationship("Objection", cascade="delete")
    groups = db.relationship("Group", cascade="delete")
    sittingAreas = db.relationship("SittingArea", cascade="delete")
    reservations = db.relationship("Reservation", cascade="delete")

    def __init__(self, name, password, width, height, padding):
        """
        Initializes an instance of a Restaurant.

        Parameter width: the width of the Restaurant.
        Precondition: width is a number > 0

        Parameter height: the height of the Restaurant.
        Precondition: height is a number > 0

        Parameter padding: the average padding around tables in this restaurant.
        Precondition: padding is a number greater than 0
        """
        assert type(name) == str and name is not None
        assert (type(width) == float or type(width) == int) and width>0
        assert (type(height) == float or type(height) == int) and height>0
        self.name = name
        self.password = password
        self.width = width
        self.height = height
        self.padding = padding
        self.groups = []
        self.tables= []
        self.chairs = []
        self.objections = []
        self.sittingAreas = []
        self.reservations = []

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "name": self.name,
            "password": self.password,
            "width": self.width,
            "height": self.height,
            "padding": self.padding,
            "sittingAreas": [sa.serialize() for sa in self.sittingAreas],
            "tables": [tb.serialize() for tb in self.tables],
            "chairs": [chr.serialize() for chr in self.chairs],
            "objections": [obj.serialize() for obj in self.objections],
            "groups": [grp.serialize() for grp in self.groups],
            "reservations": [res.serialize() for res in self.reservations]
        }


class SittingArea(db.Model):
    __tablename__ = "sittingArea"
    id = db.Column("id", db.Integer, primary_key=True)
    width = db.Column("width", db.Float, nullable=False)
    height = db.Column("height", db.Float, nullable=False)
    padding = db.Column("padding", db.Float, nullable=False)
    x1 = db.Column("x1", db.Float)
    y1 = db.Column("y1", db.Float)
    type = db.Column("type", db.String)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable="False")
    furniture = db.relationship("Group")

    def __init__(self, x1, y1, x2, y2, padding, restaurant_id, type=None):
        """
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
        """
        self.width = x2-x1
        self.height = y2-y1
        assert self.width>0 and self.height>0
        self.x1 = x1
        self.y1 = y1
        self.padding = padding
        self.furniture = []
        self.type= type
        self.restaurant_id = restaurant_id

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "width": self.width,
            "height": self.height,
            "padding": self.padding,
            "topLeft": [self.x1, self.y1],
            "type": "" if self.type is None else self.type,
            "furniture": [fur.serialize() for fur in self.furniture]
        }


class Table(db.Model):
    """
    An instance of a Table.
    """
    __tablename__ = "table"
    id = db.Column("id", db.Integer, primary_key=True)
    width = db.Column("width", db.Float, nullable=False)
    height = db.Column("height", db.Float, nullable=False)
    capacity=  db.Column("capacity", db.Integer)
    x1 = db.Column("x1", db.Float)
    y1 = db.Column("y1", db.Float)
    type = db.Column("type", db.String)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable="False")
    group_id = db.Column("Group", db.Integer, db.ForeignKey('group.id'), unique = True)

    def __init__(self, width, height, capacity, restaurant_id, group_id = None, type = None):
        """
        Initializes a table.

        Parameter width: the width of the table.
        Precondition: width is a number > 0

        Parameter height: the height of the table.
        Precondition: height is a number > 0

        Parameter capacity: the number of people this table seats
        Precondition: capacity is a number; usually even

        Parameter id: the unique identifier of the table

        Optional Parameter type: the specific type of this table
        """
        self.width = width
        self.height = height
        self.capacity = capacity
        self.x1 = None
        self.y1 = None
        self.type = type
        self.restaurant_id = restaurant_id
        self.group_id = group_id

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "width": self.width,
            "height": self.height,
            "capacity": self.capacity,
            "topLeft": [self.x1, self.y1],
            "type": "" if self.type is None else self.type,
            "currentGroup": self.group_id
        }


class Chair(db.Model):
    """
    An instance of a chair.
    """
    __tablename__ = "chair"
    id = db.Column("id", db.Integer, primary_key=True)
    width = db.Column("width", db.Float, nullable=False)
    height = db.Column("height", db.Float, nullable=False)
    x1 = db.Column("x1", db.Float)
    y1 = db.Column("y1", db.Float)
    type = db.Column("type", db.String)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable="False")
    group_id = db.Column("Group", db.Integer, db.ForeignKey('group.id'))

    def __init__(self, width, height, restaurant_id, group_id = None, type = None):
        """
        Parameter width: the width of the chair.
        Precondition: width is a number > 0

        Parameter height: the height of the chair.
        Precondition: height is a number > 0

        Optional Parameter type: the specific type of this chair.
        """
        self.width = width
        self.height = height
        self.x1 = None
        self.y1 = None
        self.type = type
        self.restaurant_id = restaurant_id
        self.group_id = group_id

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "width": self.width,
            "height": self.height,
            "topLeft": [self.x1, self.y1],
            "type": "" if self.type is None else self.type,
            "currentGroup": self.group_id
        }


class Objection(db.Model):
    """
    An instance of an objection.
    """
    __tablename__ = "objection"
    id = db.Column("id", db.Integer, primary_key=True)
    width = db.Column("width", db.Float, nullable=False)
    height = db.Column("height", db.Float, nullable=False)
    x1 = db.Column("x1", db.Float)
    y1 = db.Column("y1", db.Float)
    type = db.Column("type", db.String)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable="False")

    def __init__(self, x1, y1, x2, y2, restaurant_id, type=None):
        """
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
        """
        if x2<x1:
            tmp=x1
            x1=x2
            x2=tmp
        if y2<y1:
            tmp=y1
            y1=y2
            y2=tmp
        width = x2-x1
        height = y2-y1
        self.width = width
        self.height = height
        self.x1 = x1
        self.y1 = y1
        self.type = type
        self.restaurant_id = restaurant_id

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "width": self.width,
            "height": self.height,
            "type": "" if self.type is None else self.type,
            "topLeft": [self.x1, self.y1],
        }


class Group(db.Model):
    """
    An instance of a table-chair set with padding.
    """
    __tablename__ = "group"
    id = db.Column("id", db.Integer, primary_key=True)
    orientation = db.Column("orientation", db.String, nullable=False)
    padding = db.Column("padding", db.Float, nullable=False)
    table = db.relationship("Table", uselist= False)
    chairs = db.relationship("Chair")
    x1 = db.Column("x1", db.Float)
    y1 = db.Column("y1", db.Float)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    area_id = db.Column("SittingArea", db.Integer, db.ForeignKey('sittingArea.id'))

    @property
    def topLeft(self):
        return [self.x1, self.y1]

    @topLeft.setter
    def topLeft(self, point):
        """
        Setter
        """
        if point is None or None in point:
            self.x1 = None; self.y1 = None;
            self.table.x1 = None; self.table.y1 = None;
            for chr in self.chairs:
                chr.x1 = None; chr.y1 = None;

        else:
            # set coordinates of this object
            self.x1 = point[0];
            self.y1  = point[1];

            chairHeight = self.chairs[0].height if len(self.chairs)!=0  else 0

            if self.orientation == "vertical":
                # set coordinates of the table in this object
                self.table.x1 = point[0]+self.padding+chairHeight
                self.table.y1 = point[1]+self.padding
                # set coordinates of the chairs
                for i in range(0,len(self.chairs),2):
                    y= self.table.y1+(i+1)*1/len(self.chairs)*(self.table.height)
                    self.chairs[i].x1 = self.x1+self.padding
                    self.chairs[i].y1 = y-self.chairs[i].width/2
                    self.chairs[i+1].x1 = self.table.x1 + self.table.width
                    self.chairs[i+1].y1 = y-self.chairs[i+1].width/2
            else:
                # set coordinates of the table in this object
                self.table.x1 = point[0]+self.padding
                self.table.y1 = point[1]+self.padding+chairHeight
                # set coordinates of the chairs
                for i in range(0,len(self.chairs),2):
                    x= self.table.x1+(i+1)*1/len(self.chairs)*(self.table.width)
                    self.chairs[i].x1 = x-self.chairs[i].width/2
                    self.chairs[i].y1 = self.y1+self.padding
                    self.chairs[i+1].x1 = x-self.chairs[i+1].width/2
                    self.chairs[i+1].y1 = self.table.y1 + self.table.height

    def setPadding(self,padding):
        """
        Setter

        Parameter padding: the padding around the grouped table and chairs.
        Precondition: padding is a number > 0
        """
        assert (type(padding) == float or type(padding) == int) and padding>0
        # adjust width of the object
        self.padding = padding
        # adjust coordinates
        if None not in self.topLeft:
            self.topLeft = self.topLeft

    def setOrientation(self, orientation):
        """
        Setter

        Parameter orientation: the orientation this object must be set to.
        Precondition: orientation is either "vertical" or "horizontal"
        """
        assert orientation =="vertical" or orientation == "horizontal"
        if self.orientation != orientation:
            # change orientation of this object
            self.orientation = orientation
            # change that of the table
            tmp= self.table.width
            self.table.width= self.table.height
            self.table.height= tmp
            tmp2 = self.table.height
            # change coordinates if necessary
            if None not in [self.topLeft]:
                self.topLeft = self.topLeft



    def __init__(self, table, chairs, padding, orientation, restaurant_id, sittingArea_id=None):
        """
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
        """
        assert orientation == "vertical" or orientation == "horizontal"
        self.padding = padding
        self.orientation = orientation
        self.chairs = chairs
        self.table = table
        self.x1 = None
        self.y1 = None
        self.restaurant_id = restaurant_id
        self.area_id = sittingArea_id

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "orientation": self.orientation,
            "topLeft": [self.x1, self.y1],
            "padding": self.padding,
            "table": self.table.serialize(),
            "chairs": [chr.serialize() for chr in self.chairs],
            "sittingArea": self.area_id
        }


class Reservation(db.Model):
    """
    An instance of a Reservation.
    """
    __tablename__ = "reservation"
    id = db.Column("id", db.Integer, primary_key=True)
    number = db.Column("number", db.Integer)
    lastName = db.Column("lastname", db.String)
    mobileNumber = db.Column("mobilenumber", db.Integer)
    date = db.Column("date", db.String)
    time = db.Column("time", db.String)
    duration = db.Column("duration", db.Integer)
    restaurant_id = db.Column("Restaurant", db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    group_id = db.Column("Group", db.Integer, db.ForeignKey('group.id'))
    group2_id = db.Column("Group2", db.Integer, db.ForeignKey('group.id'))

    def __init__(self, number, last, mobile, date, time, duration, restID, grpID=None, grp2ID=None):
        """
        """
        self.number = number
        self.lastName = last
        self.mobileNumber = mobile
        self.date = date
        self.time = time
        self.duration = duration
        self.restaurant_id = restID
        self.group_id = grpID
        self.group2_id = grp2ID

    def serialize(self):
        """
        Returns python dictionary representation of this object
        """
        return {
            "id": self.id,
            "number": self.number,
            "lastName": self.lastName,
            "mobileNumber": self.mobileNumber,
            "date": self.date,
            "time": self.time,
            "duration": self.duration,
            "grp": self.group_id,
            "grp2": self.group2_id,
            "rest": self.restaurant_id
        }
