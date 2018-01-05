const AppController = require('../AppController.js').AppController;

exports.FollowerController = class FollowerController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);
    }
};
