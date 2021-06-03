const connect_to_db = require('./db');
const talk = require('./Talk');

module.exports.lets_tedx = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body = {}
    if (event.body) {
        body = JSON.parse(event.body)
    }
    // set default
    if(!body.tag) {
        callback(null, {
                    statusCode: 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the talks. Tag is null.'
        })
    }
    
    if (!body.doc_per_page) {
        body.doc_per_page = 10
    }
    if (!body.page) {
        body.page = 1
    }
    
    connect_to_db().then(() => {
        talk.find({tags: body.tag})
            .skip((body.doc_per_page * body.page) - body.doc_per_page)
            .limit(body.doc_per_page)
            .then(talks => {
                    var tot_durata = 0;
                    var playlist = [];
                    var secondi_utente = body.time * 60;
                    while(tot_durata < secondi_utente && talks.length > 0 ){
                        var elem = talks.shift();
                        var a = elem.duration.split(':');
                        var secondi_video = (+a[0])*60 + (+a[1]); 
                        var controllo = tot_durata + secondi_video;
                    
                        if(controllo <= secondi_utente){
                            playlist.push(elem);
                            tot_durata += secondi_video;
                        }
                     }
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(playlist)
                    })
                }
            )
            .catch(err =>
                callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: err.message
                })
            );
    });
};
