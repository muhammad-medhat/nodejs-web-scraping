const cheerio = require("cheerio");
const mainUrl = "https://books.toscrape.com/";
const axios = require("axios");
const json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const booksList = [];

async function getBooks(url) {
  try {
    console.log("scraping url.......", url);
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const books = $("article");
    books.each(function () {
      // console.log($(this).find('h3 a').text());
      title = $(this).find("h3 a").text();
      price = $(this).find(".price_color").text();
      booksList.push({ title, price });
    });
    // console.log(booksList);
    const nxt = $(".next a");
    const nxtHref = nxt.attr("href");
    if (nxt.length > 0) {
      const str = nxtHref.startsWith("catalogue") ? "" : "catalogue";
      const newUrl = `${mainUrl}${str}/${nxtHref}`;
      // console.log(newUrl);
      getBooks(newUrl);
    } else{
      const parser = new json2csvParser()
      const csv = parser.parse(booksList)
      // console.log(csv);
      fs.writeFileSync('books.csv', csv)
    }
  } catch (error) {
    console.error(error);
  }
}
getBooks(mainUrl);
