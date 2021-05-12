var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb+srv://admin:12345@cluster0.ayoh6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(async ()=>{
    console.log("db is connected"); 
}).catch(err => {
    console.log(Error, err.message);
  })

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
    tot_days: Number,
    cost: Number,
    winter: String,
    dis_tractor_days: Number,
    dis_bagi_days: Number,
    dis_track: Number,
    dis_track_days: Number,
    dis_workers: Number,
    dis_workers_days: Number,
    dig_digers: Number,
    dig_digers_days: Number,
    basement: String,
    dig_track: Number,
    dig_track_days: Number,
    dig_tractor: Number,
    dig_tractor_days: Number,
    pou_iron: Number,
    pou_iron_days: Number,
    pou_workers: Number,
    pou_workers_days: Number,
    pou_workers_days: Number,
    pou_workers_days: Number
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
module.exports = {
    User: User, 
    Project: Project
} ;