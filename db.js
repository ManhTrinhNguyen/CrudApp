const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId
const dbname = "crud_mongodb";
const url = "mongodb://localhost:27017";
const mongoOption = {useNewUrlParser : true}

const state = {
    db: null
};
const connect = (cb) => {
    if(state.db) {
        return cb();
    } else {
        MongoClient.connect(url, mongoOption, (err, client) => {
            if(err) {
                 return cb(err)
            }else {
                state.db = client.db(dbname);
                cb();
            }
        })
    }
}

const getPrimaryKey = (_id) => {
    return ObjectId(_id)
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB, connect, getPrimaryKey}