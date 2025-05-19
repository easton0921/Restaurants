
module.exports.migrate = async () => {
    console.log('checking database version...');
    let dbVersion = await Model.DbVersion.findOne({});

    if (!dbVersion || dbVersion.version < 1) {
        await Promise.all([
            addCmsData(),
            addInitialData(),
            addMoreAdmin(),
            addFaqsData()
        ])
        dbVersion = await Model.DbVersion.findOneAndUpdate({}, { $set: { version: 1 } }, { upsert: true, new: true });
    }

};

/**
 * Function to add initial cms data
 */
async function addCmsData() {
    let data = {
        email: 'demoapptunix@yopmail.com',
        countryCode: "+91",
        phone: '1234567890',
        terms: 'terms',
        terms_ar: 'terms_ar',
        privacyPolicy: 'policy',
        privacyPolicy_ar: 'policy_ar',
        aboutUs: 'app',
        aboutUs_ar: 'app_ar',
    };
    await new Model.Cms(data).save();
};

/**
 * Function to add intial admin
 */
async function addInitialData() {
    let admin = {
        name: "admin",
        email: "admin.restaurants@yopmail.com",
        password: 'Test@123',
        role: constants.ROLE.ADMIN,
        isEmailVerified: true
    };

    admin = await new Model.User(admin).save();
}

/**
 * Function to test admin
 */
async function addMoreAdmin() {
    let admin = {
        name: "admin",
        email: "admin.testing@yopmail.com",
        password: 'Test@123',
        role: constants.ROLE.ADMIN,
        isEmailVerified: true
    };

    await new Model.User(admin).save();
    await new Model.User({ ...admin, email: "admin.developer@yopmail.com" }).save();
    await new Model.User({ ...admin, email: "admin.backend@yopmail.com" }).save();
    await new Model.User({ ...admin, email: "admin.app@yopmail.com" }).save();
    await new Model.User({ ...admin, email: "admin.staff@yopmail.com" }).save();
}

/**
 * Function to add faqs
 */
async function addFaqsData() {
    let data = [
        {
            question: 'question1',
            answer: 'answer1',
        },
        {
            question: 'question2',
            answer: 'answer2',
        }
    ];
    await Model.Faq.insertMany(data);
};