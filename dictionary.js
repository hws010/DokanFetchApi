function search(word){
    if(word == ""){
        const resultContainer = document.getElementById("resultContainer");
        let HtmlElemnts;

        HtmlElemnts = `<h3>You need to insert a word!!</h3>`
        resultContainer.innerHTML = HtmlElemnts;
        return;
    }
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
    getData(url);
}

async function getData(url) {
    console.log("the url is sent and it is: " + url)
    const resultContainer = document.getElementById("resultContainer");
    let HtmlElemnts;

    resultContainer.innerHTML = `<p class="Loading">Searching...</p>`;

    try {
        const response = await fetch(url);
        
        if (response.status === 404) {
            throw new Error("NOT_FOUND");
        }
        if (!response.ok) {
            throw new Error("SERVER_PROBLEM");
        }

        const result = await response.json();
        HtmlElemnts = `<h3 class="WordTitle">The word is: ${result[0].word}</h3>`;
        
        const meanings = result[0].meanings;

        meanings.forEach(element => {
            HtmlElemnts += `<div class='InfoCard'>`
            HtmlElemnts += `<h3>Part Of Speech: {${element.partOfSpeech}}</h3>`

            HtmlElemnts += `<ul>`
                element.definitions.forEach(miniElement => {
                    HtmlElemnts += `<li>${miniElement.definition}</li>`
                    
                    if(miniElement.example != undefined){
                        HtmlElemnts += `<ul><li><i>example: ${miniElement.example}</i></li></ul>`
                        HtmlElemnts += `<br>`
                    }

                });

            HtmlElemnts += `</ul>`

            HtmlElemnts += `</div>`
        });

        resultContainer.innerHTML = HtmlElemnts;
        
    } catch (error) {
        console.error(error.message);
        if (error.message === "NOT_FOUND") {
            resultContainer.innerHTML = `
                <h3 class="ErrorTitle">Word Not Found</h3>
                <p class="ErrorText">The word you are looking for doesnt exist!</p>
            `;
        } else {
            resultContainer.innerHTML = `
                <h3 class="ErrorTitle">No Connection</h3>
                <p class="ErrorText">Try again later.</p>
            `;
        }
    }
}