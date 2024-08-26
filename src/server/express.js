import {Router} from "express"
import express from "express"
import cors from "cors"
import path from "path"
const app = express()
const PORT = process.env.PORT || 8080;
// app.use(express.static(path.join(__dirname, 'src')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.get('/api/data', (req, res) => {
    console.log("Test")
  res.json({message: "Hey"})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
