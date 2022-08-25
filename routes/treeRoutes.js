const { getTreeInfo, createTree, createRoot, deleteTree } = require('../controllers/treeControllers')

const treeRoute = require('express').Router()
treeRoute.get('/',getTreeInfo)
treeRoute.get('/:id',getTreeInfo)
treeRoute.post('/',createTree)
treeRoute.post('/:id/roots',createRoot)
treeRoute.delete('/:id',deleteTree)
treeRoute.delete('/',deleteTree)

module.exports = treeRoute