let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // Toggle the visibility of the toy form container
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  const toyCollection = document.getElementById("toy-collection");

  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = document.createElement("div");
        card.classList.add("card");

        const header2 = document.createElement("h2");
        header2.textContent = toy.name;

        const image = document.createElement("img");
        image.src = toy.image;
        image.classList.add("toy-avatar");

        const likes = document.createElement("p");
        likes.textContent = `${toy.likes} likes`;

        const button = document.createElement("button");
        button.textContent = "Like ❤️";
        button.classList.add("like-btn");
        button.dataset.id = toy.id;

        card.appendChild(header2);
        card.appendChild(image);
        card.appendChild(likes);
        card.appendChild(button);

        toyCollection.appendChild(card);
      });
    })
    .catch(error => console.error("Error fetching toys:", error));

  // Add a new toy
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(response => response.json())
      .then(newToy => {
        const card = document.createElement("div");
        card.classList.add("card");

        const header2 = document.createElement("h2");
        header2.textContent = newToy.name;

        const img = document.createElement("img");
        img.src = newToy.image;
        img.classList.add("toy-avatar");

        const likes = document.createElement("p");
        likes.textContent = `${newToy.likes} Likes`;

        const button = document.createElement("button");
        button.textContent = "Like ❤️";
        button.classList.add("like-btn");
        button.dataset.id = newToy.id;

        card.appendChild(header2);
        card.appendChild(img);
        card.appendChild(likes);
        card.appendChild(button);

        toyCollection.appendChild(card);

        event.target.reset();
      })
      .catch(error => console.error("Error adding new toy:", error));
  });

  // Increase a toy's likes
  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.id;
      const likeElement = event.target.previousElementSibling;
      const newLikes = parseInt(likeElement.textContent) + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          likeElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error("Error updating likes:", error));
    }
  });
});

