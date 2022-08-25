const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const FamilyTree = new Schema({
    name: {
        type: String
    },
    roots :[{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }]
},{collection: 'Tree'})


module.exports = mongoose.model('Tree',FamilyTree);