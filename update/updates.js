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

        const posts = data.post;

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
                `;
            
            const likeButton = document.createElement("div");
            const fallbackId = post.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // remove special characters
                .replace(/\s+/g, '-');        // replace spaces with hyphens
            const finalId = post.id || fallbackId;

            likeButton.className = "lyket-container";
            likeButton.setAttribute("data-lyket-type", "like"); 
            likeButton.setAttribute("data-lyket-id", finalId);
            likeButton.setAttribute("data-lyket-namespace", "devilike-blog");
            likeButton.setAttribute("data-lyket-theme", "heart");

            postElement.appendChild(likeButton);


            listContainer.insertBefore(postElement, listContainer.firstChild);

        });

        if (posts.length === 0) {
            listContainer.innerHTML = "<p>No new updates.</p>";
            
        } else {
            
            if (typeof Lyket !== 'undefined' && typeof Lyket.rehydrate === 'function') {
                Lyket.rehydrate();
                }
            }
        
        }
        
        catch (error) {
            console.error("Error fetching updates: ", error);
            listContainer.innerHTML = "<p>Failed to load updates.</p>";
            }
    }

    document.addEventListener("DOMContentLoaded", getUpdates);
    //getUpdates();