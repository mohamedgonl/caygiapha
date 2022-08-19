// global store

var persons = []
var roots = []
var id_creator = 0;

// class definition
class Person {
    constructor({
        name,
        gender = 'male',
        pids = [], // partners id
        mid = null, // mother id
        fid = null, // father id
        pid = null, // parent id 
        childrenIds = [], // childrent id
        level = 0, // heigth of node
        isDirChild = false, // is direct child or not
        isRoot = false 
    }) {
        this.id = id_creator++;
        this.name = name,
        this.gender = gender,
        this.pids = pids,
        this.mid = mid,
        this.fid = fid,
        this.pid = pid,
        this.childrenIds = childrenIds,
        this.level = level,
        this.isDirChild = isDirChild,
        this.isRoot = isRoot


    }
    createChild(info, pid) { // add child without partner
        if (Person.findbyId(pid)) {
            let child = new Person({
                ...info,
                isDirChild: true
            })
            // set fid & mid
            if (this.gender === 'male') {
                child.fid = this.id;
                child.mid = pid
            } else {
                child.mid = this.id;
                child.fid = pid;
            } 
            child.pid = this.isDirChild ? this.id : pid; // set parent id
            child.level = this.level + 1; // set level
            this.childrenIds.push(child.id)

            // there is pid in params -> update partner
            let partnerIndex = this.pids.findIndex(e => e == pid)
            if (partnerIndex !== -1) { // update partner
                persons.forEach(e => {
                    if (e.id === pid) 
                        e.childrenIds.push(child.id)
                    
                });
            }
            persons.push(child)
        }

    }

    createPartner({name}) {
        if (!this.isDirChild) 
            return;
         else {
            let partner = new Person({name: name, level: this.level, pid: this.pid});
            // set gender
            partner.gender = this.gender === undefined ? undefined : this.gender === 'male' ? 'female' : 'male';
            partner.childrenIds = [] // set childsId
            partner.pids.push(this.id)
            // set pids
            // store this person
            this.pids.push(partner.id)
            persons.push(partner)
        }
    }
    edit({name, gender}) {
        if (name) 
            this.name = name
        if (gender) 
            this.gender = gender
    }
    static findbyId(personId) {
        if (personId) 
            return persons.find(e => e.id === personId)
    }
    static remove(personId) {
        removePerson(personId)
    }
    detRelationship(personId) {
        if(personId) {
            // Partner
            if(this.pids.includes(personId)){
                if(this.gender == 'male') return 'Person 1 is husband of person 2';
                else return 'Person 1 is wife of person 2';
            }
            // dirChirld
            if(this.fid == personId) return 'Person 2 is father of person 1';
            if(this.mid == personId) return 'Person 2 is mother of person 1';
            if(this.childrenIds.includes(personId)) {
                if(this.gender == 'male') return 'Person 1 is father of person 2';
                else  return 'Person 1 is father of person 2';
            }
           
            let person2 = Person.findbyId(personId);
            if(person2) {
                let LCA;
                let LCAobj = LowestCommonAncestor(this,person2);
                if(LCAobj === undefined) LCA = 0;
                else LCA = LCAobj.level;
                let A = LCA - this.level;
                let B = LCA - person2.level;
                if(A == B){
                    if(this.pid == person2.pid) return 'Sibling';
                    else return 'Cousin'
                }
                else {
                    if(Math.abs(A-B) == 1)  return 'Uncle/Ant';
                    else if(Math.abs(A-B) > 1) return 'Ancestor - Child';
                    return 'Continue';
                }
            }
            else return 'Person not found!'
        }
       
    }
}

 // helpers of Person class

 // remove one node: remove this node also its partners and childrents
function removePerson(personId) {

    let person = Person.findbyId(personId);

    if (person) {
        if (! person.isDirChild) {
            let partner = Person.findbyId(person.pids[0])
            partner.pids = partner.pids.filter(e => e.id != person.id);
            person.childrenIds.map(e => {
                let child = Person.findbyId(e);
                if (person.gender == 'male') 
                    child.fid = null;
                 else 
                    child.mid = null;
            })
            persons = persons.filter(e => e.id !== person.id)
        } else {
            // if this node is direct child else { // remove partners
            if (person.pids.length > 0) {
                person.pids.forEach(e => {
                    removePerson(e);
                });
            }
            // remove children
            if (person.childrenIds.length > 0) {
                person.childrenIds.forEach(e => {
                    removePerson(e)
                });
            }

            // remove node
            // remove node from parent
            let mother = Person.findbyId(person.mid)
            if (mother) 
                mother.childrenIds = mother.childrenIds.filter(e => e !== personId)
            let father = Person.findbyId(person.fid)
            if (father) 
                father.childrenIds = father.childrenIds.filter(e => e !== personId)
            // remove this node
            persons = persons.filter(e => e.id !== personId)
        }
    }

}


// find the lca of two nodes
function LowestCommonAncestor(u, v) {
    if (u.level<v.level) {
        [u, v] = [v, u] // swap u and v
    }
    while (u.level>v.level) {
        u = Person.findbyId(u.pid)
    }
    while (u !== v && u.level != 0 ) {
        u = Person.findbyId(u.pid)
        v = Person.findbyId(v.pid)
    }
    if(u.level == 0) return undefined
    return u;
}

class Tree {
    constructor(name, roots = []) {
        this.id = id_creator++;
        this.name = name,
        this.roots = roots
    }
    createRoot() {
        let root = new Person({pid: this.id, isDirChild: true, isRoot: true, level: 0});
        this.roots.push(root)
        persons.push(root)
    }
    addRoot(person) {
        if (person instanceof Person) {
            person.pid = this.id;
            person.isRoot = true
            this.roots.push(person);
        }
    }
    removeRoot(personId) {
        let root = this.roots.find(e => e.id == personId);
        if (root !== undefined && root !== -1) {
            root.isRoot = false;
            root.pid = null;
            this.roots = this.roots.filter(e => e.id !== root.id)
        }
    }

}


// --------------------TESTING----------------------


console.log('-----------------------------------');
let tree = new Tree({name: 'Gia phả họ Nguyễn', roots: []})
document.getElementById("title").innerText = tree.name.name

tree.createRoot()
tree.roots[0].edit({name: 'Tiến'})


let person = new Person({name: 'Long', gender: 'male', isDirChild: true});
persons.push(person)
tree.addRoot(person)


person.createPartner({name: 'Trang', isDirChild: false, gender: 'female'});
person.createChild({
    name: 'Phong',
    gender: 'male'
}, 3)
person.createChild({
    name: 'Mai',
    gender: 'female'
}, 3)
Person.findbyId(4).createPartner({name: 'Thanh'})
Person.findbyId(4).createChild({
    name: 'Hoàng',
    gender: 'male'
}, 6)


console.log(persons);


// --------------------DRAW CHART----------------------------

let chartData = persons.map(e => {
    let o = {
        id: e.id,
        name: e.name,
        gender: e.gender,
        mid: e.mid,
        fid: e.fid,
        pids: e.pids,
        heights: e.level
    }
    return o
})

var family = new FamilyTree(document.getElementById("tree"), {
    mouseScrool: FamilyTree.action.none,
    nodeBinding: {
        field_0: "name",
        field_1: "id"
    },
    enableSearch: false,
    nodes: chartData
});
