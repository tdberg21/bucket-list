
const fetchBucketList = async () => {
  const response = await fetch('/api/v1/listitems');
  const results = await response.json();
  return results;
}

const handlePageLoad = async () => {
  const results = await fetchBucketList();
  results.forEach(item => prependListItem(item.title, item.description, item.id))
}

const handleSubmit = async () => {
  let title = $('.title-input').val();
  let description = $('.description-input').val();
  if (title && description) {
    const results = await saveItemToDatabase(title, description);
    prependListItem(title, description, results.id);
    clearInputs();
  }
};

const handleDelete = async (event) => {
  const results = await deleteItemFromDatabase(event.target.value);
  if (results.message) {
    event.target.closest('div').remove();
  }
}

const deleteItemFromDatabase = async (id) => {
  const response = await fetch(`/api/v1/listitems/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const results = await response.json();
  return results;
}

const prependListItem = (title, description, id) => {
  $('.bucket-list-container').prepend(`
    <div class="list-item-card">
      <div class="card-text">
        <h3 class="item-title-headers">${title}</h3>
        <p class="item-description-paragraphs"> ${description} </p>
      </div>
      <button class="delete-buttons" value=${id}>Delete</button>      
    </div>
  `);
};

const saveItemToDatabase = async (title, description) => {
  const response = await fetch('/api/v1/listitems', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const results = await response.json();
  return results;
};

const clearInputs = () => {
  $('.title-input').val('');
  $('.description-input').val('');
};

handlePageLoad();
$('.submit-button').on('click', handleSubmit);
$('section').on('click', '.list-item-card button', handleDelete);

