
import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        name: String,
        type: { type: String, enum: ['directory', 'file'], default: 'directory' },
        mime: String,
        size: Number,
        childs: [],
        parts: []
    });

nodeSchema.method("toOBJECT", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});


const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        mail: { type: String, unique: true },
        firstname: String,
        lastname: String,
        crv: String,
        iv: String,
        emk: String,
        hak: String,
        rsapub: String,
        rsapriv: String,
        signrsapub: String,
        signrsapriv: String,
        cc: String,
        mailconfirm: Boolean,
        confirmat: String,
        filesystem: { nodes: [nodeSchema], size: Number }
    }
);


userSchema.method("toOBJECT", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const userModel = mongoose.model('user', userSchema);


export {
    userModel,
    userSchema
}