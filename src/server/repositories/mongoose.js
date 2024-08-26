import mongoose from "mongoose"

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/MyProject');
}

const kittySchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String, 
});

const Kitten = mongoose.model('Kitten', kittySchema);
const silence = new Kitten({ title: "test", price: "5", description: "ayaya", location: "over dere"});
console.log(silence.title, silence.price, silence.description, silence.location); 
