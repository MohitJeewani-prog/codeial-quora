const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

//this function processes the mails in the queue serially
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);

    commentsMailer.newComment(job.data);

    done();
});