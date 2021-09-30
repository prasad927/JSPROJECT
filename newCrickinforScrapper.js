
const cheerio=require("cheerio");
const request=require("request");
const fs=require("fs");
const path=require("path");
const { stringify } = require("querystring");
const { getSystemErrorMap } = require("util");
const xlsx=require("xlsx");
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";


request(url,cb);

function cb(error,resp,html){
    if(error){
        console.log(error);
    }else{
        //console.log(html);
        extractHtml(html);
    }
}

function extractHtml(html){
    let selectorTool = cheerio.load(html);
    let allMatchesDom = selectorTool(".match-score-block");
    
    //FOR LOOP CHANGED FOR TASTING CHANGE IT LATER
    for(let i=0;i<allMatchesDom.length;i++){
          let eachMatchDom = selectorTool(allMatchesDom[i]);
          let scorcardDom = selectorTool(eachMatchDom).find(".match-info-link-FIXTURES");
          let scrLink = scorcardDom.attr("href");
          let fullLink="https://www.espncricinfo.com"+scrLink;//making full link with url(link to scorcard)
          //console.log(fullLink);
          //extractPOTM(fullLink);
          extractTeamNames(fullLink);
    }
}

function extractTeamNames(fullLink){
    console.log(fullLink);
    request(fullLink,cb);
    function cb(err,resp,html){
        if(err){
            console.log(err);
        }else{
            extractTeamNameAndVenue(html);
            //console.log(html);
        }
    }    
}

function extractTeamNameAndVenue(html){
    let selectorTool = cheerio.load(html);
    let matchDetailDom = selectorTool(".match-info.match-info-MATCH");

    //Extracting result 
    let statusDom = selectorTool(matchDetailDom).find(".status-text");
    let result=statusDom.text();
    console.log("Result:",result);//convert this in string;*/


    /*extract team names use of batsman table*/
    let teamNameDom=selectorTool(".header-title.label ");
    teamNameDom = teamNameDom.slice(0,2);
    let teamNameArr=[]
    for(let i=0;i<teamNameDom.length;i++){
        let name=selectorTool(teamNameDom[i]).text();
        name=name.split("INNINGS")[0];
        //console.log(name);
        //createTeamsFolder(name);
        teamNameArr.push(name);
    }
    /*table for players (batsman table)*/
    let temp=1;
    let batsManTableDom = selectorTool(".table.batsman");//Gives Two DOMS Of both innings batting table
    for(let j=0;j<batsManTableDom.length;j++){
         let batsManDetatil=selectorTool(batsManTableDom[j]).find("tbody>tr");//all batsman out and not out
         //Above line gives all rows in batsman table
         for(let i=0;i<batsManDetatil.length;i++){
             let batsManStats = selectorTool(batsManDetatil[i]).find("td");
             //Above line gives only real bats mans row not any other extra row
             /*a batsManStats having length 8 is atcual batsman row*/
             if(batsManStats.length==8){
                 /*extract each stat*/
                 let name= selectorTool(batsManStats[0]).text().trim();
                 let run = selectorTool(batsManStats[2]).text().trim();
                 let ball= selectorTool(batsManStats[3]).text().trim();
                 let fours=selectorTool(batsManStats[5]).text().trim();
                 let sixes=selectorTool(batsManStats[6]).text().trim();
                 let srate=selectorTool(batsManStats[7]).text().trim();
                 //console.log(name+"  "+run+"  "+ball+"  "+fours+"  "+sixes+"  "+srate+"  VS  "+teamNameArr[temp]);
                 let stObj={
                     "runs":run,
                     "ball":ball,
                     "fours":fours,
                     "sixes":sixes,
                     "srate":srate,
                     "result":result,
                     "opponentName":teamNameArr[temp]
                 }
                 let selfteamname=teamNameArr[j].trim();
                //  createAndWriteFile(name,selfteamname,stObj);
                 processPlayer(stObj,selfteamname,name);
            } 
        }
        temp--;
        console.log("****************************************");
    }
}

let mainDirectory = "E:\\DATA DESKTOP 23-09-2021\\WebScrapping\\raw\\pocs\\IPL2020";//OF YOUR CHOICE
/*create json file to that foleder*/

function processPlayer(playerObj,selfteamname,playerName) {
    let teamPath = path.join(mainDirectory,selfteamname);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath,playerName);
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
