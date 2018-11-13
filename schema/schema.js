const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql;
const railwayCli = require('../railway-cli');

const TrainBtwStationType = new GraphQLObjectType({
    name: 'TrainBtwStation',
    fields: () => ({
        TotalTrains: { type: GraphQLString },
        Trains: {
            type: new GraphQLList(TrainType),
        }
    })
});
const DaysType = new GraphQLObjectType({
    name: 'Days',
    fields: () => ({
        code: { type: GraphQLString },
        runs: { type: GraphQLString }
    })
});
const RouteType = new GraphQLObjectType({
    name: 'Route',
    fields: {
        SerialNo: { type: GraphQLString },
        StationCode: { type: GraphQLString },
        StationName: { type: GraphQLString },
        ArrivalTime: { type: GraphQLString },
        DepartureTime: { type: GraphQLString },
        Distance: { type: GraphQLString }
    }
});
const FareType = new GraphQLObjectType({
    name: 'Fare',
    fields: {
        Name: { type: GraphQLString },
        Code: { type: GraphQLString },
        Fare: { type: GraphQLString }
    }
});
const DateAvailabilityType = new GraphQLObjectType({
    name: 'DateAvailability',
    fields: {
        JourneyDate: { type: GraphQLString },
        Availability: { type: GraphQLString },
        Confirm: { type: GraphQLString }
    }
});
const AvailabilityType = new GraphQLObjectType({
    name: 'Availability',
    fields: {
        classCode: { 
            type: GraphQLString,
            resolve: ({ClassCode}) => ClassCode
        },
        dates: {
            type: new GraphQLList(DateAvailabilityType),
            resolve: ({Availability}, args) => Availability
        }
    },
});
const CoachType = new GraphQLObjectType({
    name: 'Coach',
    fields: {
        SerialNo: { type: GraphQLString },
        Code: { type: GraphQLString },
        Name: { type: GraphQLString },
        Number: { type: GraphQLString }
    },
});
const CoachPositionType = new GraphQLObjectType({
    name: 'CoachPosition',
    fields: {
        LastUpdate: { type: GraphQLString },
        Coaches: {
            type: new GraphQLList(CoachType)
        }
    },
});
const TrainType = new GraphQLObjectType({
    name: 'Train',
    fields: () => ({
        TrainNo: { type: GraphQLString },
        TrainName: { type: GraphQLString },
        Source: { type: GraphQLString },
        ArrivalTime: { type: GraphQLString },
        Destination: { type: GraphQLString },
        DepartureTime: { type: GraphQLString },
        TravelTime: { type: GraphQLString },
        TrainType: { type: GraphQLString },
        days: {
            type: new GraphQLList(DaysType),
            resolve(parent, args){
                // code to get data from external API / other source
                return railwayCli.trainDaysInfo(parent.TrainNo)
            }
        },
        Fare: {
            type: new GraphQLList(FareType),
            resolve({TrainNo, Source, Destination}, args){
                // code to get data from external API / other source
                return railwayCli.fareInfo(TrainNo, Source, Destination)
            }
        },
        Route: {
            type: new GraphQLList(RouteType),
            resolve(parent, args){
                // code to get data from external API / other source
                return railwayCli.routeInfo(parent.TrainNo)
            }
        },
        Availability: {
            type: AvailabilityType,
            args: {
                date: { type: new GraphQLNonNull(GraphQLString) }, 
                classCode: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve({TrainNo, Source, Destination}, {date, classCode}){
                // code to get data from external API / other source
                return railwayCli.availabilityInfo(TrainNo, Source, Destination, date, classCode)
            }
        },
        CoachPosition: {
            type: CoachPositionType,
            resolve({TrainNo}, args){
                // code to get data from external API / other source
                return railwayCli.coachPositionInfo(TrainNo)
            }
        }
    })
});
const LiveStationType = new GraphQLObjectType({
    name: 'LiveStation',    
    fields: {
        Source: { type: GraphQLString },
        Destination: { type: GraphQLString },
        Name: { type: GraphQLString },
        Number: { type: GraphQLString },
        ScheduleArrival: { type: GraphQLString },
        ScheduleDeparture: { type: GraphQLString },
        Halt: { type: GraphQLString },
        ExpectedArrival: { type: GraphQLString },
        DelayInArrival: { type: GraphQLString },
        ExpectedDeparture: { type: GraphQLString },
        DelayInDeparture: { type: GraphQLString }
    }
});
const LiveTrainStatus = new GraphQLObjectType({
    name: 'TrainStatus',
    fields: {
        SerialNo: { type: GraphQLString },
        StationName: { type: GraphQLString },
        StationCode: { type: GraphQLString },
        ScheduleArrival: { type: GraphQLString },
        ActualArrival: { type: GraphQLString },
        DelayInArrival: { type: GraphQLString },
        ScheduleDeparture: { type: GraphQLString },
        ActualDeparture: { type: GraphQLString },
        DelayInDeparture: { type: GraphQLString },
    },
});

const LiveTrainType = new GraphQLObjectType({
    name: 'LiveTrain',    
    fields: {
        StartDate: { type: GraphQLString },
        Status: { 
            type: new GraphQLList(LiveTrainStatus),
            resolve: (parent, args) => parent.TrainRoute
        }
    }
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        trainBtwStation: {
            type: TrainBtwStationType,
            args: { 
                src: { type: new GraphQLNonNull(GraphQLString) },
                dest: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {src, dest}){
                // code to get data from external API / other source
                return railwayCli.trainBtwStation(src, dest)
            }
        },
        liveStation: {
            type: new GraphQLList(LiveStationType),
            args: { 
                stnCode: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, {stnCode}){
                // code to get data from external API / other source
                return railwayCli.liveStationInfo(stnCode)
            }
        },
        liveTrain: {
            type: LiveTrainType,
            args: {
                trainNo: { type: new GraphQLNonNull(GraphQLString) },
                date: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {trainNo, date}){
                // code to get data from external API / other source
                return railwayCli.liveTrainInfo(trainNo, date)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});