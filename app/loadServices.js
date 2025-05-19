let services = {};

const modules = Fs.readdirSync(__dirname + '/modules');
const folders = modules.filter(element => Fs.statSync(Path.join(__dirname + '/modules', element)).isDirectory());
folders.forEach(function (folder) {
    try {
        let servicesPathStr = './app' + '/modules/' + folder + '/' + 'services';
        if (Fs.existsSync(servicesPathStr)) {
            let servicesPath = Fs.readdirSync(servicesPathStr);
            servicesPath.forEach(function (file) {
                let servicePath = Path.join(__dirname + '/modules/' + folder + '/services/' + file);
                let serviceName = file.replace(/\.[^/.]+$/, "");
                if (!!serviceName && Fs.existsSync(servicePath)) {
                    let serv = require(servicePath);
                    services = {
                        ...services, ...{
                            [serviceName]: serv
                        }
                    };
                }
            });
        }
    } catch (e) {
        console.log(e)
        throw new Error(e);
    }
});

Fs.readdirSync(__dirname + '/services').forEach(function (file) {
    let serviceName = file.replace(/\.[^/.]+$/, "");
    let servicePath = Path.join(__dirname + '/services/' + file);
    if (!!serviceName && Fs.existsSync(servicePath)) {
        let serv = require(servicePath);
        services = {
            ...services, ...{
                [serviceName]: serv
            }
        };
    }
});

module.exports = services;

