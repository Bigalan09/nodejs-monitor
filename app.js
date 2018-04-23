'use strict';

const nodemailer = require('nodemailer');
const isReachable = require('is-reachable');
const moment = require('moment');

const gmailAuth = {
    user: '',
    pass: ''
};
const mailOptions = {
    from: '', // sender address
    to: '', // list of receivers
};
// -----------------------------
// ----- Do not edit below -----
// -----------------------------

var sites = [{
    host: 'google.com',
    status: []
}]

function check() {
    let list = [];
    for (var site of sites) {
        var work = doWork(site);
        list.push(work);
    }
    Promise.all(list).then(values => {
        for (var site of values) {
            let report = ``;
            let status = '';
            let shouldMail = false;
            if (site.status.length > 1) {
                let lastStatus = site.status[site.status.length - 1];
                let lastButOneStatus = site.status[site.status.length - 2];

                if (lastStatus.isReachable && lastButOneStatus.isReachable) {
                    report = `${site.host} is still up!`;
                } else if (!lastStatus.isReachable && !lastButOneStatus.isReachable) {
                    report = `${site.host} is still down!`;
                } else if (!lastButOneStatus.isReachable && lastStatus.isReachable) {
                    let lastUp = null;
                    for (var status of site.status) {
                        if (status.isReachable && status.timestamp != lastStatus.timestamp) lastUp = status;
                    }
                    if (lastUp != null) {

                        let now = lastStatus.timestamp;
                        let then = lastUp.timestamp;

                        let diff = moment.utc(now.diff(then)).format("HH:mm:ss");
                        report = `${site.host} came back up!<br />Site was down for ${diff}`;
                        status = 'up';
                        shouldMail = true;
                    }
                } else if (lastButOneStatus.isReachable && !lastStatus.isReachable) {
                    report = `${site.host} went down!`;
                    status = 'down';
                    shouldMail = true;
                } else {
                    report = `${site.host} did something weird.`;
                }
            } else if (site.status.length > 0) {
                let lastStatus = site.status[site.status.length - 1];
                if (lastStatus.isReachable) {
                    report = `${site.host} is available.`;
                    status = 'up';
                    shouldMail = true;
                } else {
                    report = `${site.host} is unavailable.`;
                    status = 'down';
                    shouldMail = true;
                }
            } else {
                report = `${site.host} huh?`;
            }

            if (shouldMail) {
                mailer(`${site.host} is ${status}`, `${report}`);
            }
        }
    });
}

function doWork(site) {
    return isReachable(site.host).then(reachable => {
        site.status.push({
            timestamp: moment(),
            isReachable: reachable
        });
        return site;
    });
}

setInterval(function () {
    check();
}, 5000);
check();

function mailer(subject, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: gmailAuth
    });
    mailOptions.subject = subject;
    mailOptions.html = body;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}