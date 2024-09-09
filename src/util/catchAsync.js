const catchAsync = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch((e) => {
      e.message = "HEY";
      next(e);
    });
  };
};

export default catchAsync;
