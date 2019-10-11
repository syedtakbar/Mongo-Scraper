const request = require("request");
const cheerio = require("cheerio");
const Articles = require("../models/article");

module.exports = {
    scrape: ( cb, scrapedSite, scrapedElement) => {     

           request(scrapedSite, (err, response, html) => {             

            const $ = cheerio.load(html);       
                
            $(scrapedElement).each(function (i, element) {
 
                const headline = $(this).find("h3").text();
                const link = $(this).find("h3").children("a").attr("href");
                const summary = $(this).find("p").text();
                const img = $(this).find("img").attr("src");

                const result = {                
                        headline, 
                        link,
                        summary,
                        img
                };

                if (img && headline && link && summary ) {

                    const entry = new Articles(result);
                    entry.save(function (err, doc) {                    
                        if (err) {
                            console.log(err);                        
                        }                    
                        else {
                           // console.log(doc);                        
                        }
                    });
                }                
                
            });
            cb();  
        });
    }
};

