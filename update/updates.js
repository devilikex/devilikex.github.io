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
                `;

            listContainer.insertBefore(postElement, listContainer.firstChild);
            
           
            const likeId = postElement.querySelector('.postTitle').textContent.replace(/\s+/g, '-').toLowerCase();

            
            const likeBtn = document.createElement('button');
            likeBtn.className = 'native-like-btn';
            
            const apiNamespace = "devilikex_github_io";
            
           
            fetch(`https://countapi.xyz{apiNamespace}/${likeId}`)
                .then(res => res.json())
                .then(data => {
                    likeBtn.innerHTML = `🤍 ${data.value || 0}`;
                })
                .catch(() => {
                    likeBtn.innerHTML = `🤍 0`;
                });

            
            likeBtn.addEventListener('click', async () => {
                likeBtn.disabled = true; // Prevent duplicate multi-clicks
                try {
                    const res = await fetch(`https://countapi.xyz{apiNamespace}/${likeId}`);
                    const data = await res.json();
                    likeBtn.innerHTML = `🤍 ${data.value}`;
                } catch (err) {
                    console.error("Failed to update like count", err);
                } finally {
                    likeBtn.disabled = false;
                }
            });

            postElement.appendChild(likeBtn);
        });

        if (posts.length === 0) {
            listContainer.innerHTML = "<p>No Updates.</p>";
            
            } 
            if (typeof window.likebtn_init === 'function') {
            window.likebtn_init();
        }
        }
        
        
        catch (error) {
            console.error("Error fetching updates: ", error);
            listContainer.innerHTML = "<p>Failed to load updates.</p>";
            }
    }

    document.addEventListener("DOMContentLoaded", getUpdates);


    //getUpdates();