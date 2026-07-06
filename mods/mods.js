
const jsonURL = "https://devilikex.github.io/_data/mods_updates.json";

async function gridUpdate() {
    const grid = document.getElementById("grid");

    if (!grid) {
        console.error("grid missing!");
    }

    if (typeof Remarkable === 'undefined' && typeof remarkable === 'undefined') {
        setTimeout(gridUpdate, 100);
            return;
    }

    try {
        const response = await fetch(jsonURL);
        if (!response.ok) {
            throw new Error("failed to fetch" + response.status);
        } else {
            console.log("fetched");
        }

        const data = await response.json(); 

        const posts = Array.isArray(data) ? data : (data.posts || []);
        console.log("parsing array: ", posts);
        const md = (typeof Remarkable !== 'undefined') ? new Remarkable() : new remarkable.Remarkable();

        posts.forEach(post => {
            console.log("card creation: ${post.title}");
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
            gridUpdate.innerHTML = "<p>There are no mods to show</p>";
        }
    }

    catch (error) {
        console.error("failed to load mods: ", error);
    }
}

document.addEventListener("DOMContentLoaded", gridUpdate);