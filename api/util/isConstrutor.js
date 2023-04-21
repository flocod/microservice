const isConstructor = (func) => {
  try {
    new func();
  } catch (err) {
    return false;
  }

  return true;
};

module.exports=  isConstructor;
