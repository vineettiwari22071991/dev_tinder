const mongoose = require('mongoose')

const connnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: '{VALUE} is incorrect status type'
        },
        required: true

    }
});

connnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connnectionRequestSchema.pre('save', function(next) {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("You cannot send request to yourself")
    }
    next();
})

module.exports = mongoose.model('ConnectionRequest', connnectionRequestSchema);