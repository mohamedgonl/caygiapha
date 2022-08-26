const Tree = require('../models/FamilyTreeModel');
const Person = require('../models/PersonModel');

const getAllPerson = async (req, res) => {
    try {
        const {limit} = req.query;
        const persons = await Person.find().limit(limit);
        if(persons == null) res.send({
            status: 'Success',
            msg: 'Not found any person'
        })
        res.send({status: 'Success', persons: persons})
    } catch (err) {
        res.send({error: err})
    }
}

const getPersonInfo = async (req, res) => {
    try {
        let id = req.params.id;
        let person = await Person.findById(id).populate({path: "pids mid fid pid childrenIds", model: 'Person'});
        res.send({person: person})
    } catch (err) {
        console.log(err);
    }
}

const createPerson = async (req, res) => {
    try {
        let person = new Person({name: req.body.name});
        // set gender
        if (["male", "female", "other"].includes(req.body.gender)) 
            person.gender = req.body.gender
        else 
            person.gender = 'other'

        await person.save();
        res.send({msg: 'Create person success', person: person})
    } catch (err) {
        console.log(err);
        res.send({error: err})
    }
}

const createChild = async (req, res) => {
    try {
        const pid = req.body.pid;
        const info = req.body.info;
        const id = req.params.id;

        // check id
        let parent = await Person.findById(id);
        if (parent == null) 
            res.send({msg: "Parent not found"})
         else {
            let child = new Person({
                ... info,
                // level: parent.level + 1,
                isDirChild: true,
                pid: parent.id
            });
            // update child 's tree ids
            child.tids.push(...parent.tids)
            if (pid) { // create child with partner
                let partner = await Person.findById(pid);

                if (! partner) 
                    res.send({msg: 'Partner not found!'})
                 else if (! parent.pids.includes(pid)) 
                    res.send({msg: 'Partner not match!'})
                 else { // update partner
                    await Person.findByIdAndUpdate(pid, {
                        $push: {
                            childrenIds: child.id
                        }
                    })
                    if (partner.gender == 'male') 
                        child.fid = partner.id;

                    if (partner.gender == 'female') 
                        child.mid = partner.id;

                        // update child's tree ids
                        child.tids.push(...partner.tids);        
                    }
            }
            if (parent.gender == 'male') 
                child.fid = parent.id;
            if (parent.gender == 'female') 
                child.mid = parent.id;
            // update parent
            parent.childrenIds.push(child.id);
            await parent.save()
            await child.save();
            res.send({
                msg: 'Create child success',
                child: child})
        }
    } catch (err) {
        res.send({
            msg: 'Create child fail',
            error: err
        })
    }
}

const createPartner = async (req, res) => {
    try {

        const info = req.body;
        const id = req.params.id;

        // check id
        let person = await Person.findById(id);

        if(person == null) res.send({
            msg: 'Person not found',
            id: id
        })
        else {
            // create partner
            let partner = new Person({
                ...info,
                // level: person.level,
                pids: [person.id]
            })
            partner.tids.push(...person.tids);
            person.pids.push(partner.id)
            await person.save();
            await partner.save();
            res.send({
                msg: 'Create partner success',
                partner: partner
            })
        }
        
    } catch (err) {
        res.send({
            error: err
        })
    }
}

const editInfo = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let gender = req.body.gender;
        if(gender!=null && !["male","female","other"].includes(gender)) res.send({
            status: 'Failed',
            msg: 'Gender invalid'
        })
        else {
            let person = await Person.findByIdAndUpdate(id, {
                ... data
            })
            res.send({
                msg: 'Update success',
                person: person})
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
}

const deletePerson = async (req, res) => {
    try {
        let {id} = req.params;
        let persons;
        if (id) 
            persons = await Person.findByIdAndDelete(id);
         else 
            persons = await Person.deleteMany();
        
        res.send({persons: persons})
    } catch (err) {
        console.log(err);
        res.send({error: err})
    }
}


module.exports = {
    getPersonInfo,
    getAllPerson,
    createChild,
    createPartner,
    createPerson,
    editInfo,
    deletePerson
}
