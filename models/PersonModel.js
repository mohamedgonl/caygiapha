const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const Person = new Schema({
    name : {
        required: true,
        type: String
    },
    gender :{
        type: String,
        enum: ["male", "female", "other"],
        lowercase: true
    },
    tids: [{ // tree ids
        type: Schema.Types.ObjectId,
        ref: 'Tree',
    }],
    pids:  [{ // partners id
        type: Schema.Types.ObjectId,
        ref: 'Person',
    }],     
    mid : { // mother id
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Person',
    }, 
    fid : {// father id
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Person',
    }, 
    pid :{    // parent id 
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Person',
    }, 
    childrenIds: [{// childrent id
        type: Schema.Types.ObjectId,
        ref: 'Person',
    }], 
    // level : { // heigth of node
    //     type: Number,
    //     require: true,
    //     default: 0
    // }, 
    isDirChild : {// is direct child or not
        type: Boolean,
        default: false
    } ,
    isRoot : {
        type: Boolean,
        default: false 
    } 
},{collection: 'Person'})



module.exports = mongoose.model('Person', Person)