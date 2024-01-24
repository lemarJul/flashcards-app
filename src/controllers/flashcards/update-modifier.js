module.exports = (req, resourceName) => {
  const DBloaded = req[resourceName];
    
  // prevent UniqueConstraintError
  const questionHasBeenEdited = req.body.question === DBloaded.question;
  if (questionHasBeenEdited) delete req.body.question;

  // prevent primaryKey from being updated
  delete req.body.id;
};
