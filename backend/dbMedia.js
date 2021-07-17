import mongoose from 'mongoose'

const mediaLinksSchema = mongoose.Schema({
    instagram: String,
    twitter: String,
    facebook: String,
    linkedin: String,
    snapchat: String
});

export default mongoose.model("medialinks", mediaLinksSchema);