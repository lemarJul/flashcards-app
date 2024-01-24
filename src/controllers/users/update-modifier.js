module.exports = (req, resourceName) => {
    delete req.body.id; // prevent primaryKey from being updated
    delete req.body.username; // prevent username from being updated
}