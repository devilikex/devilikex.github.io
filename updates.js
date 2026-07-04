const jsonURL = "https://devilikex.github.io/_data/updates.json";

async function getUpdates() {
    const listContainer = document.getElementById("newsList");

    if(!listContainer) {
        console.error("element not found");
        return;
    }

    try {
        const response = await fetch(jsonURL);
        if (!response.ok) 
        throw new Error('Failed to get updates: ' + response.status);
        
        const data = await response.json();
        listContainer.innerHTML = "";

        const posts = data.posts;
        posts.forEach(post => {
            const postDate = new Date(post.date).toLocaleDateString();
            const parsedBody = marked.parse(post.body || "");
            const postElement = document.createElement("article");
            postElement.className = "blogPost";
            postElement.innerHTML = `
                <h3 class="postTitle">${post.title}</h3>
                <span class="postDate">${postDate}</span>
                <div class="postBody">${parsedBody}</div>
            `;
            listContainer.insertBefore(postElement, listContainer.firstChild);

        });

        if (posts.length === 0) {
            listContainer.innerHTML = "<p>No new updates.</p>";
            }
        }
        
        catch (error) {
            console.error("Error fetching updates: ", error);
            listContainer.innerHTML = "<p>Failed to load updates.</p>";
            }
    }

    document.addEventListener("DOMContentLoaded", getUpdates);