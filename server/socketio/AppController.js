exports.AppController = class AppController
{
    constructor(io, socket, rooms)
    {
        this.io = io;
        this.socket = socket;
        this.rooms = rooms;
    }
};