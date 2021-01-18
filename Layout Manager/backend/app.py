import json
from flask import Flask, request
from flask_cors import CORS
import dao
from db import *

# define db filename
db_filename = "rest.db"
app = Flask(__name__)
cors = CORS(app)

# setup config
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_filename}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

# initialize app
db.init_app(app)
with app.app_context():
    # db.drop_all()
    db.create_all()

# generalized response formats
def success_response(data, code=200):
    return json.dumps({"success": True, "data": data}), code

def failure_response(message, code=404):
    return json.dumps({"success": False, "error": message}), code

########################## Restaurant Operations ###############################
@app.route("/restaurants/")
def get_restaurants():
    return success_response(dao.getAllRestaurants())

@app.route("/restaurants/", methods=["POST"])
def create_restaurant():
    body = json.loads(request.data)
    rest = dao.createRestaurant(body.get("name"), body.get("password"), body.get("width"), body.get("height"), 2/100*max(body.get("width"), body.get("height")))
    return success_response(rest, 201)

@app.route("/restaurants/<int:rest_id>/")
def get_restaurant(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    return success_response(rest)

@app.route("/restaurants/<int:rest_id>/", methods=["POST"])
def update_restaurant(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    pad = dao.updateRestByID(rest_id, body.get("name", rest["name"]), body.get("password", rest["password"]),
    body.get("width", rest["width"]), body.get("height", rest["height"]), body.get("padding", rest["padding"]))
    return success_response(pad)

@app.route("/restaurants/<int:rest_id>/", methods=["DELETE"])
def delete_restaurant(rest_id):
    rest = dao.deleteRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    return success_response(rest)

########################## Table Operations ###############################
@app.route("/restaurants/<int:rest_id>/tables/", methods=["POST"])
def create_tables(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    tables = dao.addTableToRestaurant(rest_id, body.get("width"), body.get("height"), body.get("capacity"), body.get("number", 1), body.get("type", None))
    return success_response(tables)

@app.route("/restaurants/<int:rest_id>/tables/", methods=["DELETE"])
def delete_tables(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data).get("ids",[])
    res = []
    for id in body:
        cur = dao.removeTableFromRestaurant(id)
        if cur == None:
            return failure_response("Atleast one table was not found!")
        else:
            res.append(cur)
    return success_response(res)

########################## Chair Operations ###############################
@app.route("/restaurants/<int:rest_id>/chairs/", methods=["POST"])
def create_chairs(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    chairs = dao.addChairToRestaurant(rest_id, body.get("width"), body.get("height"), body.get("number",1),body.get("type", None))
    return success_response(chairs)

@app.route("/restaurants/<int:rest_id>/chairs/", methods=["DELETE"])
def delete_chairs(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data).get("ids",[])
    res = []
    for id in body:
        cur = dao.removeChairFromRestaurant(id)
        if cur == None:
            return failure_response("Atleast one chair was not found!")
        else:
            res.append(cur)
    return success_response(res)

########################## Reservation Operations ###############################
@app.route("/restaurants/<int:rest_id>/reservations/")
def get_reservations(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    reservations = dao.getReservationsByRestaurant(rest_id)
    return success_response(reservations)

@app.route("/restaurants/<int:rest_id>/reservations/", methods=["POST"])
def create_reservation(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    res = dao.addReservationToRestaurant(rest_id, body.get("number"), body.get("lastName"), body.get("mobileNumber"),body.get("date"), body.get("time"), body.get("duration", 60), body.get("grpID", None), body.get("grp2ID", None))
    return success_response(res)

@app.route("/restaurants/<int:rest_id>/reservations/<int:res_id>/", methods=["POST"])
def update_reservation(rest_id, res_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    res = dao.updateReservationByID(res_id, body.get("duration", None))
    if res is None:
        return failure_response("Reservation not found!")
    return success_response(res)

@app.route("/restaurants/<int:rest_id>/reservations/<int:res_id>", methods=["DELETE"])
def delete_reservation(rest_id, res_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    res = dao.removeReservationFromRestaurant(res_id)
    if res == None:
        return failure_response("Reservation was not found!")
    return success_response(res)

########################## Objection Operations ###############################
@app.route("/restaurants/<int:rest_id>/objections/", methods=["POST"])
def create_objection(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    obj = dao.addObjectionToRestaurant(rest_id, body.get("coords"), body.get("type",None))
    return success_response(obj)

@app.route("/restaurants/<int:rest_id>/objections/<int:obj_id>/", methods=["POST"])
def update_objection(rest_id, obj_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    obj = dao.updateObjectionByID(obj_id, body.get("coords", None))
    if obj is None:
        return failure_response("Objection not found!")
    return success_response(obj)

@app.route("/restaurants/<int:rest_id>/objections/<int:obj_id>/", methods=["DELETE"])
def delete_objection(rest_id, obj_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    obj = dao.removeObjectionFromRestaurant(obj_id)
    if obj == None:
        return failure_response("Objection was not found!")
    return success_response(obj)

########################## Seating Area Operations ###############################
@app.route("/restaurants/<int:rest_id>/sittingAreas/", methods=["POST"])
def create_sittingAreas(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    sa = dao.addSittingAreaToRestaurant(rest_id, body.get("coords"), body.get("padding"), body.get("type", None))
    return success_response(sa)

@app.route("/restaurants/<int:rest_id>/sittingAreas/<int:sa_id>/", methods=["POST"])
def update_sittingArea(rest_id, sa_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    sa = dao.updateSittingAreaByID(sa_id, body.get("coords", None))
    if sa is None:
        return failure_response("Sitting Area not found!")
    return success_response(sa)

@app.route("/restaurants/<int:rest_id>/sittingAreas/<int:sa_id>/", methods=["DELETE"])
def delete_sittingAreas(rest_id, sa_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    sa = dao.removeSeatingAreaFromRestaurant(sa_id)
    if sa == None:
        return failure_response("Seating area was not found!")
    return success_response(sa)

########################## Group Operations ##################################
@app.route("/restaurants/<int:rest_id>/groups/", methods=["POST"])
def create_group(rest_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    sa = dao.addGroupToRestaurant(rest_id, body.get("table"), body.get("chairs"), body.get("coords"), body.get("padding"), body.get("orientation"), body.get("sittingArea", None))
    return success_response(sa)

@app.route("/restaurants/<int:rest_id>/groups/<int:grp_id>/", methods=["POST"])
def update_group(rest_id, grp_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    body = json.loads(request.data)
    grp = dao.updateGroupByID(grp_id, body.get("topLeft", None), body.get("padding", None), body.get("orientation", None), body.get("sittingArea", None))
    if grp is None:
        return failure_response("Group not found!")
    return success_response(grp)

@app.route("/restaurants/<int:rest_id>/groups/<int:grp_id>/", methods=["DELETE"])
def delete_groups(rest_id, grp_id):
    rest = dao.getRestaurantByID(rest_id)
    if rest is None:
        return failure_response("Restaurant not found!")
    grp = dao.removeGroupFromRestaurant(grp_id)
    if grp == None:
        return failure_response("Group was not found!")
    return success_response(grp)

################################# Run Script ##################################
if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)
