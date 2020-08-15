module.exports = {

    update: function(uri, query, value, msg = '', channel = null) {
        //const uri = client.config.dbpath;
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoClient.connect(err => {
            if (err) console.log(err);
            const collection = mongoClient.db("botdb").collection("v2");
            collection.updateOne(query, value, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                mongoClient.close();
                if(msg != '' && channel){
                    channel.send(msg)
                }
            });
        })
    
        
    }
    

}