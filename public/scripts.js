
const handleSubmit = async () => {
  let title = $('.title-input').val();
  let description = $('.description-input').val();
  const response = await saveItemToDatabase(title, description);
  appendListItem(title, description, response.id);
  clearInputs();
};

const appendListItem = (title, description, id) => {
  $('.bucket-list-container').append(`
    <div class="list-item-card">
      <h3 class="item-title-headers">${title}</h3>
      <p class="item-description-paragraphs"> ${description} </p>
      <button class="delete-buttons ${id}">Delete</button>      
    </div>
  `)
};

const saveItemToDatabase = async (title, description) => {
  const results = await fetch('/api/v1/bucketlist', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const response = await results.json();
  return response;
};

const clearInputs = () => {
  $('.title-input').val('');
  $('.description-input').val('');
};

$('.submit-button').on('click', handleSubmit);

