const AppController = require('../AppController.js').AppController;

exports.FieldController = class FieldController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);
    }
}