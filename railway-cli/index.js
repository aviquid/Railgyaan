const axios = require('axios');
const {
    RAILWAY_API_KEY,
    RAILWAY_API_ENDPOINT,
    INDIANRAIL_API_KEY,
    INDIANRAIL_API_ENDPOINT,
} = require('./apiKeys');

const fetchFromObject = (data, path) => {
    if(!path[0]) {
        return data
    }
    var newPath = path.shift();
    return fetchFromObject(data[newPath], path)
}
const trainBtwStation = (src, dest) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}TrainBetweenStation/apikey/${INDIANRAIL_API_KEY}/From/${src}/To/${dest}`;
    return returnPromise(endpoint);
}
const trainDaysInfo = (trainNo) => {
    const endpoint = `${RAILWAY_API_ENDPOINT}name-number/train/${trainNo}/apikey/${RAILWAY_API_KEY}/`;
    return returnPromise(endpoint, ["train", "days"]);
}
const routeInfo = (trainNo) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}TrainSchedule/apikey/${INDIANRAIL_API_KEY}/TrainNumber/${trainNo}/`;
    return returnPromise(endpoint, ["Route"]);
}
const fareInfo = (trainNo, src, dest) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}TrainFare/apikey/${INDIANRAIL_API_KEY}/TrainNumber/${trainNo}/From/${src}/To/${dest}/Quota/GN`;
    return returnPromise(endpoint, ["Fares"]);
}
const liveStationInfo = (stnCode) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}LiveStation/apikey/${INDIANRAIL_API_KEY}/StationCode/${stnCode}/hours/4/`;
    return returnPromise(endpoint, ["Trains"]);
}
const availabilityInfo = (trainNo, src, dest, date, classCode) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}SeatAvailability/apikey/${INDIANRAIL_API_KEY}/TrainNumber/${trainNo}/From/${src}/To/${dest}/Date/${date}/Quota/GN/Class/${classCode}`;
    return returnPromise(endpoint);
}
const coachPositionInfo = (trainNo) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}CoachPosition/apikey/${INDIANRAIL_API_KEY}/TrainNumber/${trainNo}`;
    return returnPromise(endpoint);
}
const liveTrainInfo = (trainNo, date) => {
    const endpoint = `${INDIANRAIL_API_ENDPOINT}livetrainstatus/apikey/${INDIANRAIL_API_KEY}/trainnumber/${trainNo}/date/${date}/`;
    return returnPromise(endpoint);
}
const returnPromise = (endpoint, resultPath = false) => {

    return new Promise((resolve, reject) => {

    axios.get(endpoint)
        .then(function ({data}) {
            resultPath ? resolve(fetchFromObject(data, resultPath)) : resolve(data);
        })
        .catch(function (error) {
            reject(error);
        });
  });
};

module.exports = {
    trainBtwStation,
    trainDaysInfo,
    routeInfo,
    fareInfo,
    liveStationInfo,
    availabilityInfo,
    coachPositionInfo,
    liveTrainInfo,
};
