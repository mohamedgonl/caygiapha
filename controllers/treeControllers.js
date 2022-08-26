const Tree = require('../models/FamilyTreeModel');
const Person = require('../models/PersonModel');


const createTree = async (req, res) => {
    try {
        let data = req.body;
        let tree = new Tree({name: data.name})
        await tree.save();
        res.send({msg: 'Create family tree success', tree: tree})

    } catch (err) {
        res.send({msg: 'Create new tree failed', error: err})
    }
}

const getTreeInfo = async (req, res) => {
    try {
        if (req.params.id == null) {
            let trees = await Tree.find()
            res.send({trees: trees})
        } else { 
             let tree = await Tree.findById(req.params.id)
            if (tree == null) 
                res.send({msg: 'Invalid tree id'})
             else {
                let members = await Person.find({tids: tree.id});
                res.send({msg: 'Get tree info success', tree: tree, members: members})
            }
        }

    } catch (err) {
        res.send({msg: 'Get tree info failed', error: err})
    }
}


/*
const addRoot = async (req, res) => {
    try {
        // const createPerson = (data) => {
        //     let person = new Person({name: data.name})
        //     person.gender = ["male", "female", "other"].includes(data.gender) ? data.gender : 'other';
        //     person.save();
        //     return person;
        // }
        let tree = await Tree.findById(req.params.id);
        if (tree == null) 
            res.send({msg: 'Family not found'});
         else {
            let personId = req.body.personId;
            if (personId) { // add person to root
                let person = await Person.findById(personId);
                if (person) {
                    
                    if(!person.tids.includes(tree.id))  person.tids.push(tree.id);
                    person.isDirChild = true;
                    person.level = 0;
                    person.isRoot = true;
                    tree.roots.push(personId);
                    res.send({msg: 'Add person to root success', tree: tree, root: root})
                } else {
                    tree.roots.push
                }
            } // create new root else {}

        }
    } catch (err) {
        console.log(err);
    }
}
*/
const createRoot = async (req, res) => {
    try {
        let tree = await Tree.findById(req.params.id);
        if (tree == null) 
            res.send({msg: 'Family tree not found'})
         else {
            let person;
            // set gender
            if (["male", "female", "other"].includes(req.body.gender)) 
                person = new Person({name: req.body.name, gender: req.body.gender, isDirChild: true, isRoot: true})
             else 
                person = new Person({name: req.body.name, gender: 'other', isDirChild: true, isRoot: true});
            
             person.tids.push(tree.id)
             tree.roots.push(person.id);
            await tree.save();
            await person.save();
            res.send({msg: 'Create root success', tree: tree})
        }
    } catch (err) {
        res.send({msg: 'Create root failed', error: err})
    }
}

const deleteTree = async (req, res) => {
    try {
        let {id} = req.params;
        let trees;
        if (id) {
            trees = await Tree.findByIdAndDelete(id);
            await Person.updateMany({
                tids: id
            },{
                $pull: {
                    tids: id
                }
            })
        } 
         else 
            trees = await Tree.deleteMany();
    
        res.send({msg: 'Delete tree success', trees: trees})

    } catch (err) {
        res.send({error: err})
    }
}

const editTreeInfo = async (req, res) => {
    try {

    } catch (err) {
        res.send({msg: 'Edit tree info failed', error: err})
    }
}

module.exports = {
    createTree,
    getTreeInfo,
    editTreeInfo,
    // addRoot,
    createRoot,
    deleteTree
}
