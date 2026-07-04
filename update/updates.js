const jsonURL = "https://devilikex.github.io/_data/updates.json";

async function getUpdates() {
    const listContainer = document.getElementById("newsList");

    if(!listContainer) {
        console.error("element not found");
        return;
    }

if (typeof Remarkable === 'undefined' && typeof remarkable === 'undefined') {
    setTimeout(getUpdates, 100);
    return;
}

    try {
        const response = await fetch(jsonURL);
        if (!response.ok) 
        throw new Error('Failed to get updates: ' + response.status);
        
        const data = await response.json();
        listContainer.innerHTML = "";

        const posts = data.posts;

        const md = (typeof Remarkable !== 'undefined') ? new Remarkable() : new remarkable.Remarkable();


        posts.forEach(post => {
            const postDate = new Date(post.date).toLocaleDateString();
            const parsedBody = md.render(post.body || "");
            const postElement = document.createElement("article");
            postElement.className = "blogPost";
            
postElement.innerHTML = `
    <h3 class="postTitle">${post.title}</h3>
    <span class="postDate">${postDate}</span>
    <div class="postBody">${parsedBody}</div>
    
    <div class="blog-likes">
        <div 
          data-lyket-type="like" 
          data-lyket-id="${post.title.replace(/\s+/g, '-').toLowerCase()}" 
          data-lyket-namespace="devilike-blog"
          data-lyket-template="heart"
          data-lyket-color-primary="#413f41"
          data-lyket-color-highlight="#fca9fc"
          data-lyket-font-family="chewy, sans serif"
        ></div>
    </div>
`;

            listContainer.insertBefore(postElement, listContainer.firstChild);

        });

        if (window.lyket && typeof window.lyket.reparse === 'function') {
        window.lyket.reparse();
            }

        if (posts.length === 0) {
            listContainer.innerHTML = "<p>No new updates.</p>";
            }
        }
        
        catch (error) {
            console.error("Error fetching updates: ", error);
            listContainer.innerHTML = "<p>Failed to load updates.</p>";
            }
    }

    //document.addEventListener("DOMContentLoaded", getUpdates);
    getUpdates();