const resultContainer = document.getElementById("resultContainer");
const errorContainer = document.getElementById("ErrorContainer");
let HtmlElemnts = "";

function search(word){
    resetHtml();
    if(word == ""){
        resetHtml();
        errorContainer.innerHTML = `<h3>You need to insert a username!!</h3>`
        return;
    }
    let url = 'https://api.github.com/users/' + word;
    getData(url);
}

async function getData(mainRepo) {
    try {
        errorContainer.innerHTML = `<p class="Loading">Loading...</p>`;
        //getting the main SearchObject
        const request = await fetch(mainRepo);

        if (request.status === 404) {
            throw new Error("NOT_FOUND");
        }
        if (request.status === 403) {
            throw new Error("EXCEEDED_RATE_LIMIT");
        }
        if (!request.ok) {
            throw new Error("SERVER_PROBLEM");
        }

        const result = await request.json();
        
        //getting and storing data
        const repoResult = await getElements(result.repos_url);
        const followersResult = await getElements(result.followers_url);
        
        //looping through data and add it to the html
        cardGenerator(repoResult);
        resultContainer.innerHTML = HtmlElemnts;
        
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            errorContainer.innerHTML = `
                <h3 class="ErrorTitle">Account Not Found</h3>
                <p class="ErrorText">The account you are looking for doesnt exist! try another one.</p>
            `;
        } else if(error.message === "EXCEEDED_RATE_LIMIT"){
            errorContainer.innerHTML = `
                <h3 class="ErrorTitle">Rate Limit Exceeded</h3>
                <p class="ErrorText">You have exceeded the rate limit. wait for a little bit before searching again.</p>
            `;
        } else {
            errorContainer.innerHTML = `
                <h3 class="ErrorTitle">No Connection</h3>
                <p class="ErrorText">Try again later.</p>
            `;
        }
    }
}

function cardGenerator(repos){
    if(repos == ""){
        errorContainer.innerHTML = `
                <p class="ErrorText">The account you are looking has no repositories.</p>
            `;
        return
    }
    resetHtml();
    repos.forEach(element => {
        HtmlElemnts += `
        <div class="RepoCard">
            <h3 class="RepoName">${element.name}</h3>
            <span class="RepoOwner">${element.owner.login}</span>
            <p class="RepoDesc">
                ${element.description}
            </p>
        </div>
        `;
    });
}

async function getElements(element) {
    try {
        const request = await fetch(element)
        
        if(!request.ok){
            throw new Error("SERVER_PROBLEM")
        }

        const result = await request.json();
        
        return result;

    } catch (error) {
        console.log(error)
    }
}

function resetHtml(){
    resultContainer.innerHTML = "";
    errorContainer.innerHTML = "";
    HtmlElemnts = "";
}