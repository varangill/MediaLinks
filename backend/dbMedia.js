import mongoose from 'mongoose'

const mediaLinksSchema = mongoose.Schema({
    name: String,
    instagram: String,
    twitter: String,
    facebook: String
});

export default mongoose.model("medialinks", mediaLinksSchema);