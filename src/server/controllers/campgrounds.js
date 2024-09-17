import model from "../repositories/mongoose.js"

export const showAllCampgrounds = async (req, res) => {
    const campgrounds = await model.findAllCampgrounds();
    res.json(campgrounds);
  }

export const showCampgroundEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await model.findCampgroundById(id);
    res.json(campground);
  }

export const editCampground = async (req, res) => {
    const { id } = req.params;
    const { location, description, price, title, imageurl } = req.body;
    const userid = req.user._id;
    await model.editCampground(
      id,
      location,
      description,
      price,
      title,
      imageurl,
      userid
    );
    res.redirect(`/campground/${id}`);
  }

export const showCampgroundDetails = async (req, res, next) => {
    const { id } = req.params;
    const campground = await model.findCampgroundById(id);
    res.json(campground);
  }

export const createCampground = async (req, res, next) => {
    const { location, description, price, title } = req.body;
    const campgroundImages = req.files.map(f => ({url: f.path, filename: f.filename}))
    await model.createCampground(
      location,
      description,
      price,
      title,
      campgroundImages,
      req.user._id
    );
    res.redirect("/campgrounds");
  }

export const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const userid = req.user._id;
    await model.deleteCampgroundById(id, userid);
    res.status(200).json({ message: `Campground ID ${id} Deleted.` });
  }

