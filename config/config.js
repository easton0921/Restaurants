class Config {
    constructor() {
        this.allConfig = {
            Database: {
                URL: "",
                Debug: true,
                dbName: "",
                SSL_CERT: "",
                Type: "",
                dcDisableHooks: false
            },
            SecureAccess: {
                whitelistDomains: [],
                enable: false
            }, 
            App: {
                PORT: 0,
                ADMIN_PORT: 0,
                SOCKET_PORT: 0,
                CRON_PORT: 0,

                SiteName: "Restaurants",
                SiteSortName: "",
                secret: "",
                key: "",
                iv: "",
                jwtSecret: process.env.jwt_secret,
                tokenExpiresTime: "24h",
                ApiHost: "",
                WebHost: "",
            },
            AWS: {
                Key: "",
                Id: "",
                Bucket: "",
                region: "",
                S3Path: "",
                S3Url: "",
                CloudWatchGroupName: "",
                CloudWatchLog: false
            },
            SMTP: {
                From: "",
                FromEmail: "",
                Host: "",
                Service: "",
                User: "",
                Password: ""
            },

            Sovren: {
                Hostname: "",
                Port: "",
                AccountId: "",
                ServiceKey: ""
            },
            Redis: {
                Hostname: "",
                Port: "",
                MatchingKeyExpireInSeconds: 0,
                Url: "",
                Mode: ""
            },
            Twillo: {
                AccountSID: "",
                AuthToken: "",
                From: ""
            },
            Google: {
                provider: "",
                apiKey: "",
                httpAdapter: "",
                formatter: null,
                suppress_startDate: "",
                suppress_endDate: ""
            },
            SQS: {
                queueURL: "",
                exportQueueURL: "",
                elasticQueueURL: "",
                TimeSheet: "",
                Transaction: "",
            },
            CronJob: {
                nextDelay: 0,
                idleDelay: 0,
                URLPath: "",
                SecretKey: ""
            },
            Queue: {
                URL: "",
                SecretKey: ""
            },

            elasticsearch: {
                client: {
                    host: "",
                    auth: "",
                    protocol: "",
                    port: 0
                },
                index_name: "",
                sync_disabled: ''
            },
            SocketIO_URL: "",
            Transaction: {
                URLPath: "",
                SecretKey: ""
            },
            TimeSheet: {
                URLPath: "",
                SecretKey: ""
            },
            ExportQueue: {
                URL: "",
                SecretKey: ""
            }
        }
    }

    async init() {
        //Database Config
        this.allConfig.Database.URL = process.env.db_url;
        this.allConfig.Database.Debug = process.env.db_debug === 'true';
        this.allConfig.Database.dbName = process.env.db_name || 'sample';
        this.allConfig.Database.SSL_CERT = process.env.db_ssl_cert;
        this.allConfig.Database.Type = process.env.db_type;
        this.allConfig.Database.dcDisableHooks = process.env.db_dc_disable_hooks === 'true';

        //App Config
        this.allConfig.App.PORT = process.env.app_port || 3000;
        this.allConfig.App.ADMIN_PORT = process.env.admin_port || 3002;
        this.allConfig.App.SOCKET_PORT = process.env.app_socket_port || 3001;
        this.allConfig.App.key = process.env.app_key || '';
        this.allConfig.App.jwtSecret = process.env.jwt_secret || '';
        this.allConfig.App.iv = process.env.app_iv || '';
        this.allConfig.App.tokenExpiresTime = process.env.app_token_expires_time || '24h';
        this.allConfig.App.otpExpiresTime = process.env.app_otp_expires_time || '2m';   
        this.allConfig.App.ApiHost = process.env.app_api_host || '';

        //AWS Config
        this.allConfig.AWS.Key = process.env.BUCKET_KEY;
        this.allConfig.AWS.Id = process.env.BUCKET_ID;
        this.allConfig.AWS.Bucket = process.env.BUCKET_NAME;
        this.allConfig.AWS.region = process.env.BUCKET_REGION;
        this.allConfig.AWS.S3Path = process.env.aws_s3_path;
        this.allConfig.AWS.S3Url = process.env.aws_s3_url;
        this.allConfig.AWS.CloudWatchGroupName = process.env.aws_cloud_watch_group_name;
        this.allConfig.AWS.CloudWatchLog = process.env.aws_cloud_watch_log === 'true';

        //SMTP Config
        this.allConfig.SMTP.From = process.env.EMAIL_FROM;
        this.allConfig.SMTP.FromEmail = process.env.EMAIL_USER;
        this.allConfig.SMTP.Host = process.env.EMAIL_HOST;
        this.allConfig.SMTP.Service = process.env.smtp_service;
        this.allConfig.SMTP.User = process.env.EMAIL_USER;
        this.allConfig.SMTP.Password = process.env.EMAIL_PASS;
        this.allConfig.SMTP.Port = process.env.EMAIL_PORT;

        //Redis Config
        this.allConfig.Redis.Hostname = process.env.redis_hostname;
        this.allConfig.Redis.Port = process.env.redis_port;
        this.allConfig.Redis.MatchingKeyExpireInSeconds = process.env.redis_matching_key_expire_in_seconds;
        this.allConfig.Redis.Url = process.env.redis_url || 'redis://localhost:6379/1';
        this.allConfig.Redis.Mode = process.env.redis_mode;

        //CronJob Config 
        this.allConfig.CronJob.nextDelay = process.env.cronjob_next_delay;
        this.allConfig.CronJob.idleDelay = process.env.cronjob_idle_delay;
        this.allConfig.CronJob.URLPath = process.env.cronjob_url_path;

        //SocketIO_URL Config
        this.allConfig.SocketIO_URL = process.env.SocketIO_URL;

        return this;
    }

    get(key) {
        return this.allConfig[key];
    }

    has(key) {
        return !!this.allConfig[key];
    }
}

module.exports = Config;