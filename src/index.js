document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.querySelector("#quote-list");
    const newQuoteForm = document.querySelector("#new-quote-form");
  
    // Fetch and display quotes on page load
    fetch("http://localhost:3000/quotes?_embed=likes")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((quote) => {
          renderQuote(quote);
        });
      });
  
    // Event listener for form submission
    newQuoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const quoteInput = document.querySelector("#new-quote");
      const authorInput = document.querySelector("#author");
  
      // Create a new quote object
      const newQuote = {
        quote: quoteInput.value,
        author: authorInput.value,
      };
  
      // Send a POST request to create a new quote
      fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      })
        .then((response) => response.json())
        .then((quote) => {
          renderQuote(quote); // Render the newly created quote
        });
  
      // Reset the form inputs
      quoteInput.value = "";
      authorInput.value = "";
    });
  
    // Event listener for deleting a quote
    quoteList.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-danger")) {
        const quoteCard = event.target.closest(".quote-card");
        const quoteId = quoteCard.dataset.quoteId;
  
        // Send a DELETE request to delete the quote
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
          method: "DELETE",
        })
          .then(() => {
            quoteCard.remove(); // Remove the quote from the DOM
          });
      }
    });
  
    // Event listener for liking a quote
    quoteList.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-success")) {
        const quoteCard = event.target.closest(".quote-card");
        const quoteId = quoteCard.dataset.quoteId;
  
        // Create a new like object
        const newLike = {
          quoteId: parseInt(quoteId),
        };
  
        // Send a POST request to create a new like
        fetch("http://localhost:3000/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLike),
        })
          .then((response) => response.json())
          .then((like) => {
            const likesCountSpan = quoteCard.querySelector("button span");
            likesCountSpan.textContent = like.length; // Update the likes count
          });
      }
    });
  
    // Render a quote on the page
    function renderQuote(quote) {
      const quoteCard = document.createElement("li");
      quoteCard.classList.add("quote-card");
      quoteCard.dataset.quoteId = quote.id;
  
      quoteCard.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class="btn-success">Likes: <span>0</span></button>
          <button class="btn-danger">Delete</button>
        </blockquote>
      `;
  
      quoteList.appendChild(quoteCard);
    }
  });
  