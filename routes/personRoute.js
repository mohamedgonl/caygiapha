const { getPersonInfo, getAllPerson, createPerson, deletePerson, editInfo, createChild, createPartner } = require('../controllers/personControllers');

const personRoute = require('express').Router();
// .../persons/
personRoute.get('/:id',getPersonInfo)
personRoute.get('/',getAllPerson)
personRoute.post('/',createPerson)
personRoute.post('/:id/childs',createChild)
personRoute.post('/:id/partners',createPartner)
personRoute.put('/:id',editInfo)
personRoute.delete('/',deletePerson)
personRoute.delete('/:id',deletePerson)
module.exports = personRoute