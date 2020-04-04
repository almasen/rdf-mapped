const distanceCalculator = require('../distance');

const sortByTime = (events) => {
    events.sort((event1, event2) => {
        const date1 = new Date(event1.date);
        const date2 = new Date(event2.date);
        if (date1 > date2) return 1;
        else if (date1 < date2) return -1;
        else return 0;
    });
    return events;
};

const sortByDistanceFromUser = (events, user) => {
    events.forEach(event => {
        event.distance = distanceCalculator.getDistance(user, event, 'M');
    });
    events.sort((event1, event2) => event1.distance - event2.distance);
    return events;
};

const sortByTimeAndDistance = (events, user) => {
    return sortByDistanceFromUser(sortByTime(events), user);
};

const groupBy = key => array =>
    array.reduce(
        (objectsByKeyValue, obj) => ({
            ...objectsByKeyValue,
            [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
        }), {},
    );
const groupByCause = groupBy('causeName');

module.exports = {
    groupByCause,
    sortByTimeAndDistance,
};
