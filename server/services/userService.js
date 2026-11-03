import RevokedToken from "../models/revokedToken.model.js";
import User from "../models/user.model.js";


async function createUser(user) {
    const newUser = new User({
        username: user.username,
        email:user.email,
        passwordHash: user.passwordHash
    })
    await newUser.save();
    return newUser;
}

async function getUser(query, withPass = false) {
    const userQuery = User.findOne(query);

    if (withPass) {
        userQuery.select('+passwordHash');
    }

    return await userQuery;
}

async function logoutCurrentUser(jti, exp) {
    const revokedToken = new RevokedToken({
        jti: jti,
        expiresAt: new Date(exp * 1000)
    })

    await revokedToken.save()
}


export {
    createUser,
    getUser,
    logoutCurrentUser
}