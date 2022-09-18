
const data = {"facebook":    
{   
    "userInfo": {
        "name": "Caelia Romano",
        "dob": "9/27/1996",
        "phone": "202-555-0141",
        "password": "autumnlatte27",
        "email": "marzipanetteria@gmail.com",
        "company": "Marzipan Panetteria",
        "company_position": "Owner and CEO",
        "hometown": "Palermo, Italy",
        "relationship": "Single",
        "current_city": "Los Angeles",
        "school": "North Park High school",
        "gender": "female"
    },
    "photos" :[
        { "photoTag": "city", "caption": "No place like the city of angels" },
        { "photoTag": "fall", "caption": "My favorite autumn activity has gotta be long sunset walks with a good ol' latte" },
        { "photoTag": "regular", "caption": "My go to? Pumpkin spice latte with extra whipped cream :D" },
        { "photoTag": "starbucks", "caption": "Starbucks is a guilty pleasure" },
        { "photoTag": "autumn", "caption": "If you couldn't tell, autumn is my favorite season" },
        { "photoTag": "birthday", "caption": "Birthday in 10 days on september 27! Everyone's invited :)" },
        { "photoTag": "park", "caption": "Nothing says autumn quite like a latte in the park" },
        { "photoTag": "coffee", "caption": "Someone stop me I'm addicted" },
        { "photoTag": "cafe", "caption": "Another day, another latte" },
        { "photoTag": "dog", "caption": "Please meet my lovely dog, Latte!" },
        { "photoTag": "grandma", "caption": "Visiting my sicilian nonna Russo!" },
        { "photoTag": "pasta", "caption": "How cacio e pepe should be made!" },
        { "photoTag": "pumpkin spice", "caption": "Pumpkin spice latte to celebrate the arrival of autumn!" }
    ],
    "status": [
        { "caption": "If I was born in 1996 that makes me a millenial and not genz, right?" },
        { "caption": "The cafe is now offering cannoli! It's been a long time coming, I know :)" },
        { "caption": "Omg can you believe these people were wearing HOT pink in winter. Honey purple is the way to go. Purple goes all year round!" },
        { "caption": "Just dropped $500 on purple gucci flipflops." }
    ]} 
}

var inputPassword = "Purple98";

function createWordObjs(content, location){
    let retArr = [];
    for (let i = 0; i < content.length; i++) {
        let wordObj = {
            "word" : content[i],
            "count" : 0,
            "location" : location
        }
        retArr.push(wordObj);
    }
    return retArr; 
}

function processDOB(dob){
    const dobArray = dob.split("/");
    // split year to '98? and then add to array
    return createWordObjs(dobArray, "date of birth");
}

function processPhone(phone){
    const phoneArray = phone.split("-");
    return createWordObjs(phoneArray, "phone number");
}

function processText(content) {
    const splitContent = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(" ");
    return createWordObjs(splitContent, "facebook caption");
}

function processJSON(facebook) {
    var completeList = [];
    for (const info in facebook) {
        const userContent = facebook[info];

        for (const text in userContent) {
            const content = userContent[text];
            if (typeof content === 'string') {
                if(text === 'dob') {  // here we could do a switch case for cleaner coe
                    completeList = completeList.concat(processDOB(content));
                    continue;
                } else if (text === 'phone') {
                    completeList = completeList.concat(processPhone(content));
                    continue;
                } else {
                    completeList = completeList.concat(processText(content));
                }
                
            } else { // processing objects
                // photos or status 
                for (const property in content) {
                    const text = content[property];
                    completeList = completeList.concat(processText(text));
                }
            }          
        }
    }
    return completeList;    
}

async function countWords (data) {
    const bank = new Map();
    var wordCount = new Map();
    const facebook = data.facebook;
    const list = processJSON(facebook);

    for (let i = 0; i < list.length; i++) {
        let word = list[i].word;
        if (word === "") continue;
        if (bank.has(word)) {
            let curWordItem = bank.get(word);
            curWordItem.count += 1;
            bank.set(word, curWordItem);
        } else {
            list[i].count = 1;
            bank.set(word, list[i])
        }
    }

    return bank;
} 

async function testPassword (pswd, data) {
    const bank = await countWords(data);
    var pass = pswd.toLowerCase().toString();    
    var matches = 0;

    const matchedWords = [];
    let currentWordMatch = '';
    for (let start = 0; start < pass.length; start++) {
        for (let end = start+1; end <= pass.length; end++) {
            var str = pass.substring(start, end);
            if (bank.has(str)) {
                currentWordMatch = str;
            } 
        }
        if (bank.has(currentWordMatch)) {
            if (currentWordMatch.length < 3) {
                currentWordMatch = ''
                continue;
            } else {
                let currentWordMatchCount = bank.get(currentWordMatch).count;
                matches += bank.get(currentWordMatch);
                matchedWords.push(bank.get(currentWordMatch));
            }
        }
        currentWordMatch = '';
    }    
    // console.log(matches);
    console.log(matchedWords);
}

testPassword("latte1996", data);