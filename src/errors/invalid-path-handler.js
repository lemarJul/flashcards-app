
module.exports = (req, res, next) => {
    res.status(404).json({message: "Bad Request: Invalid path"})
}