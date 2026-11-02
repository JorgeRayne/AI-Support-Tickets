import mongoose, { Schema } from "mongoose";

const revokedTokenSchema = Schema({
    jti: {
        type: String,
        require: true,
        unique: true
    },
    expiresAt:{
        type: Date,
        require: true
    }
})

revokedTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);
export default RevokedToken