const cheerio = require("cheerio");
const axios = require("axios");
const json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const { title } = require("process");
const booksList = [];

const mainUrl = "https://freewaystradelinks.com/";

const getMenu = async (menuObj, ch, retArr) => {
  // console.log(menuObj);
  menuObj.each((i, li) => {
    let title = (desc = url = "");
    let sub = [];
    const sel = ch(li);

    title = sel.find(">a>.menu-title").text();
    desc = sel.find(">a>.menu-desc").text();
    url = sel.find(">a").attr("href");

    const hasChild = sel.hasClass("haschild");

    // if (hasChild) {
    //   // a promise result
    //   // sub = getMenu(sel.find("div>ul>li"), ch, [])
    //   sub = getMenu(sel.find("div>ul>li"), ch, []).then((mi) => {
    //     // console.log('mimimimimi',mi);
    //     return mi;
    //   });
    //   console.log('mi', sub);
    // }
    // while(sel.next().length>0){}
    getPage(url, "#ja-content-main>.item-page");

    sub.length > 0
      ? retArr.push({ hasChild, url, title, desc, sub })
      : retArr.push({ hasChild, url, title, desc });
  });
  // console.log(retArr);
  // console.log('============');

  return retArr;
};
const getPage = async (url, sel) => {
  console.log(`"getting content for ${url}`);

  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const page = $(sel);
  const title = page.find('.item-page >h2').text()

  const content = page.find('.article-content').html()

  //edit img src
  const img = $(content).find('img')
  const src = $(img).attr('src')
  $(img).attr('src', `https://web.archive.org/${src}`)

  const html = `
    <h2>${title}</h2>
    <p>${img}</p>
    <div>${$(content).find(':not(img, script)')}</div>
    <br>
    <br>
    <br>
  `
  fs.appendFile('doc.html', html)
  // fs.writeFileSync('doc.html', page.html())
  // fs.writeFileSync('doc.txt', page.text())

};
async function scrap(url) {
  try {
    console.log("scraping url.......", url);
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    // const $ =cheerio.load(fs.readFileSync('freewaystradelinks.html'));

    const menu = getMenu($("#ja-megamenu>ul>li"), $, []);
    console.log(typeof menu);
    // console.log(JSON.stringify(menu));
    Object.keys(menu).forEach((mi, i) => {
      console.log(`${i}'mmmmm'`, mi);
    });

    const urlp =
      "https://web.archive.org/web/20161011190305/http://freewaystradelinks.com/index.php/services/sea-frightt";
    const notFound =
      "https://web.archive.org/web/20161011190305/http://designuganda.com/freewaystradelinks.com/index.php/services/sea-frightt";
    getPage(urlp, "#ja-content-main>.item-page");
  } catch (error) {
    console.error(error);
  }
}
scrap(mainUrl);
