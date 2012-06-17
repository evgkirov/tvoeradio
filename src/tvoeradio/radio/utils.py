def get_user_stations_list(model, user, limit=None):
    def serialize_user_station_list(qs):
        retval = []
        for user_station in qs:
            retval.append({'type': user_station.station.type,
                           'name': user_station.station.name})
        return retval
    qs = model.objects.get_for_user(user)
    if limit:
        qs = qs[:limit]
    return serialize_user_station_list(qs)
