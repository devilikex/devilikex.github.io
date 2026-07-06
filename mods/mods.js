
const jsonURL = "https://devilikex.github.io/_data/mods_updates.json";

async function gridUpdate() {
    const grid = document.getElementById("grid");

    if (!grid) {
        console.error("grid missing!");
    }

    if (typeof Remarkable === 'undefined' && typeof remarkable === 'undefined') {
        setTimeout(getUpdates, 100);
            return;
    }

    try {
        const response = await fetch(jsonURL);
        if (!response.ok) {
            throw new Error("failed to fetch" + response.status);
        }

        const data = await response.json; 

        const posts = data.posts;
        const md = (typeof Remarkable !== 'undefined') ? new Remarkable() : new remarkable.Remarkable();

        posts.forEach(post => {
            const postDate = new Date(post.date).toLocaleDateString();
            const parsedBody = md.render(post.body || "");
            
            const newCard = document.createElement("div");
            newCard.className = "card";

            newCard.innerHTML = `
                <h3 class="postTitle">${post.title}</h3>
                <div class="postBody">${parsedBody}</div>
            `;
            
            grid.appendChild(newCard);
        });

        if (posts.length === 0) {
            gridContainer.innerHTML = "<p>There are no mods to show</p>";
        }
    }

    catch (error) {
        console.error("failed to load mods: ", error);
    }
}

document.addEventListener("DOMContentLoaded", gridUpdate);