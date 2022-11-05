const cheerio = require('cheerio');
var fs = require("fs") 
var json2csv = require("json2csv").Parser

const $ =cheerio.load(fs.readFileSync('file.html'));
// Cheerio selector commands are simple and identical to jQuery’s if you are familiar with the language. Append the below command in the last of your javascript file and save it in demo.js


//  console.log( $('.apple', '#fruits').text())
//  console.log( $('#fruits').text())

//  console.log( $('ul .pear').attr('class'))

/**
 * .attr(name, value) is used to modify attributes. If you set an attribute value to NULL, it means it is removed. You can also pass a map and function.


 */


// console.log( $('ul').attr('id'))
// console.log($.html());


console.log( $('.apple').attr('id', 'favorite').html())
console.log($.html());

