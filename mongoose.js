var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb+srv://admin:12345@cluster0.ayoh6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
})
.then(async ()=>{
    console.log("db is connected"); 
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const UserSchema = new Schema({
    fname: {
        type: String,
    },
    lname:{
        type: String,
    },
    email: {
        type: String,
        index: { unique: true }
    },
    password: {
        type: String,
    }
})

const ProjectSchema = new Schema({
    parking_area: {
        type: Number
    },
    mmd_area: {
        type: Number
    },
    cost: {
        type: Number
    },
    field_area:{
        type: Number
    },
    floors: {
        type: Number
    },
    windows: {
        type: Number
    },
    doors: {
        type: Number
    },
    parking: {
        type: Boolean
    },
    mmd: {
        type: Boolean
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    }
})

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema)
module.exports = User, Project ;