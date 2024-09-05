import {findAllCampgrounds, findCampgroundById} from "./repositories/mongoose.js"

import bodyParser from "body-parser"
import {Router} from "express"
import express from "express"
import cors from "cors"
import path from "path"
const app = express()
const PORT = process.env.PORT || 8080;
// app.use(express.static(path.join(__dirname, 'src')))

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.get('/api/data', (req, res) => {
    console.log("Test")
  res.json({message: "Hey"})
})

app.get('/api/campgrounds', async(req, res) => {
  const campgrounds = await findAllCampgrounds()
  res.json(campgrounds)
  console.log(campgrounds)
})

app.get('/api/campgrounds/:id', async(req, res) => {
  const {id} = req.params
  const campground = await findCampgroundById(id)
  res.json(campground)
  console.log("Heya")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
